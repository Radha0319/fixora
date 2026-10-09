// VERIFY: Administrator controller for Customer and Provider Verification Review
import { Customer } from '../models/Customer.js';
import { ServiceProvider } from '../models/ServiceProvider.js';
import { User } from '../models/User.js';
import { ServiceRequest } from '../models/ServiceRequest.js';
import { createNotification, sendNotificationEmail } from '../services/notificationService.js';
import { VERIFICATION_STATUS, ROLES } from '../config/constants.js';

// Get Admin System Dashboard Stats
export const getAdminStats = async (req, res, next) => {
  try {
    const totalCustomers = await User.countDocuments({ role: ROLES.CUSTOMER });
    const totalProviders = await User.countDocuments({ role: ROLES.PROVIDER });
    const pendingCustomerVerifications = await Customer.countDocuments({
      adminApprovalStatus: VERIFICATION_STATUS.PENDING
    });
    const pendingProviderVerifications = await ServiceProvider.countDocuments({
      adminApprovalStatus: VERIFICATION_STATUS.PENDING
    });
    const totalServiceRequests = await ServiceRequest.countDocuments();
    const activeServiceRequests = await ServiceRequest.countDocuments({
      status: { $in: ['PENDING', 'ACCEPTED', 'IN_PROGRESS'] }
    });
    const completedServiceRequests = await ServiceRequest.countDocuments({
      status: 'COMPLETED'
    });

    return res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        totalProviders,
        pendingCustomerVerifications,
        pendingProviderVerifications,
        totalServiceRequests,
        activeServiceRequests,
        completedServiceRequests
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get List of Customers for Admin Review
export const getAdminCustomers = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) {
      query.adminApprovalStatus = status;
    }

    const customers = await Customer.find(query)
      .populate('user', 'name email mobileNumber accountStatus createdAt')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    next(error);
  }
};

// Review & Decide Customer Verification
// Rule #11 & #12: Approve, Reject, Request Re-submission
export const reviewCustomerVerification = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    const { action, remarks } = req.body; // action: 'APPROVE', 'REJECT', 'RESUBMISSION'

    const customer = await Customer.findById(customerId).populate('user');
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer record not found.'
      });
    }

    if (action === 'APPROVE') {
      customer.adminApprovalStatus = VERIFICATION_STATUS.APPROVED;
      customer.approvedAt = new Date();
      customer.adminRemarks = remarks || 'Approved by platform administrator.';
      await customer.save();

      // Rule #12: Customer triggers Email + In-App notification
      await sendNotificationEmail({
        toEmail: customer.user.email,
        subject: 'Welcome to Fixora - Account Verified!',
        textContent: 'Congratulations! You are a new member of our app! Your account has been verified and approved. You can now find verified service providers.',
        htmlContent: '<h3>Congratulations! You are a new member of our app!</h3><p>Your account has been verified and approved. You can now find verified service providers.</p>'
      });

      await createNotification({
        recipientId: customer.user._id,
        title: 'Account Approved',
        message: 'Your account has been verified and approved. You can now find verified service providers.',
        type: 'APPROVAL',
        link: '/customer/providers'
      });
    } else if (action === 'REJECT') {
      customer.adminApprovalStatus = VERIFICATION_STATUS.REJECTED;
      customer.adminRemarks = remarks || 'Verification document was rejected.';
      await customer.save();

      await createNotification({
        recipientId: customer.user._id,
        title: 'Verification Rejected',
        message: `Your verification submission was rejected. Reason: ${customer.adminRemarks}`,
        type: 'VERIFICATION',
        link: '/customer/verification'
      });
    } else if (action === 'RESUBMISSION') {
      customer.adminApprovalStatus = VERIFICATION_STATUS.RESUBMISSION_REQUESTED;
      customer.adminRemarks = remarks || 'Please upload a clearer scan of your Aadhaar document.';
      await customer.save();

      await createNotification({
        recipientId: customer.user._id,
        title: 'Re-Submission Requested',
        message: `Please re-submit your verification document. Admin note: ${customer.adminRemarks}`,
        type: 'VERIFICATION',
        link: '/customer/verification'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Allowed values: APPROVE, REJECT, RESUBMISSION.'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Customer verification updated to ${customer.adminApprovalStatus}.`,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

// Get List of Providers for Admin Review
export const getAdminProviders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) {
      query.adminApprovalStatus = status;
    }

    const providers = await ServiceProvider.find(query)
      .populate('user', 'name email mobileNumber accountStatus createdAt')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: providers.length,
      data: providers
    });
  } catch (error) {
    next(error);
  }
};

// Review & Decide Provider Verification
// Rule #17 & #18: Face registered + Documents verified + Admin approved = eligible
export const reviewProviderVerification = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const { action, remarks } = req.body; // action: 'APPROVE', 'REJECT', 'RESUBMISSION'

    const provider = await ServiceProvider.findById(providerId).populate('user');
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider record not found.'
      });
    }

    if (action === 'APPROVE') {
      provider.adminApproved = true;
      provider.documentsVerified = true;
      provider.adminApprovalStatus = VERIFICATION_STATUS.APPROVED;
      provider.approvedAt = new Date();
      provider.adminRemarks = remarks || 'Approved by platform administrator.';
      await provider.save();

      // Email and In-App notification
      await sendNotificationEmail({
        toEmail: provider.user.email,
        subject: 'Fixora Provider Approval',
        textContent: 'Congratulations! Your service provider account has been verified and approved. You are now active for customer listings.',
        htmlContent: '<h3>Congratulations!</h3><p>Your service provider account has been verified and approved. You are now active for customer listings on Fixora.</p>'
      });

      await createNotification({
        recipientId: provider.user._id,
        title: 'Account Approved',
        message: 'Your service provider profile has been approved and is now active for customer listings.',
        type: 'APPROVAL',
        link: '/provider/dashboard'
      });
    } else if (action === 'REJECT') {
      provider.adminApproved = false;
      provider.documentsVerified = false;
      provider.adminApprovalStatus = VERIFICATION_STATUS.REJECTED;
      provider.adminRemarks = remarks || 'Verification credentials could not be validated.';
      await provider.save();

      await createNotification({
        recipientId: provider.user._id,
        title: 'Verification Rejected',
        message: `Your provider verification was rejected. Reason: ${provider.adminRemarks}`,
        type: 'VERIFICATION',
        link: '/provider/verification'
      });
    } else if (action === 'RESUBMISSION') {
      provider.adminApprovalStatus = VERIFICATION_STATUS.RESUBMISSION_REQUESTED;
      provider.adminRemarks = remarks || 'Please upload updated credential documents or re-record face registration.';
      await provider.save();

      await createNotification({
        recipientId: provider.user._id,
        title: 'Re-Submission Requested',
        message: `Admin requested document re-submission: ${provider.adminRemarks}`,
        type: 'VERIFICATION',
        link: '/provider/verification'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Allowed values: APPROVE, REJECT, RESUBMISSION.'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Provider status updated to ${provider.adminApprovalStatus}.`,
      data: provider
    });
  } catch (error) {
    next(error);
  }
};
