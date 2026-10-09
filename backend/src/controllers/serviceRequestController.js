// DB: Service Request controller managing full lifecycle and transition validation
import { ServiceRequest } from '../models/ServiceRequest.js';
import { Customer } from '../models/Customer.js';
import { ServiceProvider } from '../models/ServiceProvider.js';
import { createNotification } from '../services/notificationService.js';
import { SERVICE_REQUEST_STATUS, VERIFICATION_STATUS, ROLES } from '../config/constants.js';

// Valid status transitions map
const VALID_TRANSITIONS = {
  [SERVICE_REQUEST_STATUS.PENDING]: [
    SERVICE_REQUEST_STATUS.ACCEPTED,
    SERVICE_REQUEST_STATUS.REJECTED,
    SERVICE_REQUEST_STATUS.CANCELLED
  ],
  [SERVICE_REQUEST_STATUS.ACCEPTED]: [
    SERVICE_REQUEST_STATUS.IN_PROGRESS,
    SERVICE_REQUEST_STATUS.CANCELLED
  ],
  [SERVICE_REQUEST_STATUS.IN_PROGRESS]: [
    SERVICE_REQUEST_STATUS.COMPLETED
  ],
  [SERVICE_REQUEST_STATUS.REJECTED]: [],
  [SERVICE_REQUEST_STATUS.COMPLETED]: [],
  [SERVICE_REQUEST_STATUS.CANCELLED]: []
};

// Create a new service request (Customer only)
export const createServiceRequest = async (req, res, next) => {
  try {
    const {
      providerId,
      deviceCategory,
      brand,
      modelNumber,
      problemDescription,
      serviceDomain,
      scheduledDate,
      serviceAddress,
      estimatedCost
    } = req.body;

    const file = req.file;

    // Rule #12: Check customer approval status
    const customer = await Customer.findOne({ user: req.user._id });
    if (!customer || customer.adminApprovalStatus !== VERIFICATION_STATUS.APPROVED) {
      return res.status(403).json({
        success: false,
        message: 'Cannot create service requests. Your account verification must be approved by the admin first.'
      });
    }

    if (!providerId || !deviceCategory || !problemDescription) {
      return res.status(400).json({
        success: false,
        message: 'Provider, device category, and problem description are required.'
      });
    }

    // Verify target provider is active & eligible
    const provider = await ServiceProvider.findById(providerId).populate('user');
    if (
      !provider ||
      !provider.adminApproved ||
      !provider.faceRegistered ||
      !provider.documentsVerified ||
      provider.user.accountStatus !== 'active'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Selected service provider is not currently active or verified on Fixora.'
      });
    }

    const requestNumber = `FIX-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
    const problemImageUrl = file ? `/uploads/${file.filename}` : (req.body.problemImageUrl || '');

    const serviceRequest = await ServiceRequest.create({
      requestNumber,
      customer: req.user._id,
      provider: provider.user._id,
      deviceCategory,
      brand: brand || '',
      modelNumber: modelNumber || '',
      problemDescription,
      problemImageUrl,
      serviceDomain: serviceDomain || `${deviceCategory} Repair`,
      status: SERVICE_REQUEST_STATUS.PENDING,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(Date.now() + 86400000),
      serviceAddress: serviceAddress || customer.address || {},
      estimatedCost: Number(estimatedCost) || 0,
      statusHistory: [
        {
          fromStatus: null,
          toStatus: SERVICE_REQUEST_STATUS.PENDING,
          remarks: 'Service request booked by customer.',
          changedBy: req.user._id
        }
      ]
    });

    // NOTIFY: Provider received new booking request
    await createNotification({
      recipientId: provider.user._id,
      title: 'New Service Request',
      message: `You have a new service request (#${requestNumber}) for ${deviceCategory} from ${req.user.name}.`,
      type: 'SERVICE_REQUEST',
      link: `/provider/requests`
    });

    return res.status(201).json({
      success: true,
      message: 'Service request created successfully.',
      data: serviceRequest
    });
  } catch (error) {
    next(error);
  }
};

// Get Service Requests (Filtered by Role)
export const getMyServiceRequests = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === ROLES.CUSTOMER) {
      query.customer = req.user._id;
    } else if (req.user.role === ROLES.PROVIDER) {
      query.provider = req.user._id;
    } // If Admin, can view all

    const { status } = req.query;
    if (status) {
      query.status = status;
    }

    const requests = await ServiceRequest.find(query)
      .populate('customer', 'name email mobileNumber profileImage')
      .populate('provider', 'name email mobileNumber profileImage')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

// Get single Service Request Details
export const getServiceRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const request = await ServiceRequest.findById(id)
      .populate('customer', 'name email mobileNumber profileImage')
      .populate('provider', 'name email mobileNumber profileImage');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found.'
      });
    }

    // Role check: Only customer, assigned provider, or admin can inspect
    const isCustomer = request.customer._id.toString() === req.user._id.toString();
    const isProvider = request.provider._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === ROLES.ADMIN;

    if (!isCustomer && !isProvider && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this service request.'
      });
    }

    return res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    next(error);
  }
};

// Update Service Request Status (State Transition Guard)
export const updateServiceRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newStatus, remarks, finalCost } = req.body;

    const request = await ServiceRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Service request not found.'
      });
    }

    const currentStatus = request.status;
    const allowed = VALID_TRANSITIONS[currentStatus] || [];

    if (!allowed.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid state transition from '${currentStatus}' to '${newStatus}'. Allowed transitions: ${allowed.join(', ') || 'None (Terminal state)'}`
      });
    }

    // Check actor permissions for transition
    if (newStatus === SERVICE_REQUEST_STATUS.CANCELLED) {
      // Customer, assigned provider, or admin can cancel
      const canCancel =
        request.customer.toString() === req.user._id.toString() ||
        request.provider.toString() === req.user._id.toString() ||
        req.user.role === ROLES.ADMIN;
      if (!canCancel) {
        return res.status(403).json({ success: false, message: 'Unauthorized to cancel this request.' });
      }
    } else {
      // Status progressions (ACCEPTED, REJECTED, IN_PROGRESS, COMPLETED) must be performed by assigned Provider
      const isAssignedProvider = request.provider.toString() === req.user._id.toString();
      const isAdmin = req.user.role === ROLES.ADMIN;
      if (!isAssignedProvider && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Only the assigned service technician or admin can update this status.'
        });
      }
    }

    // Update status and history
    request.status = newStatus;
    if (finalCost !== undefined) request.finalCost = Number(finalCost);

    request.statusHistory.push({
      fromStatus: currentStatus,
      toStatus: newStatus,
      remarks: remarks || `Status changed to ${newStatus}`,
      changedBy: req.user._id
    });

    await request.save();

    // If marked completed, increment provider's completed count
    if (newStatus === SERVICE_REQUEST_STATUS.COMPLETED) {
      await ServiceProvider.findOneAndUpdate(
        { user: request.provider },
        { $inc: { completedServicesCount: 1 } }
      );

      // NOTIFY: Prompt customer to leave a review
      await createNotification({
        recipientId: request.customer,
        title: 'Service Completed',
        message: `Your service request #${request.requestNumber} has been marked completed! Please share your rating and review.`,
        type: 'SERVICE_REQUEST',
        link: `/customer/requests`
      });
    } else {
      // General notification to other party
      const recipientId =
        req.user._id.toString() === request.customer.toString()
          ? request.provider
          : request.customer;

      await createNotification({
        recipientId,
        title: `Service Request ${newStatus}`,
        message: `Service request #${request.requestNumber} status changed to ${newStatus}.`,
        type: 'SERVICE_REQUEST',
        link: `/requests/${request._id}`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Service request status updated to ${newStatus}.`,
      data: request
    });
  } catch (error) {
    next(error);
  }
};
