// VERIFY: Customer profile and Aadhaar document verification controller
import { Customer } from '../models/Customer.js';
import { runCustomerPreliminaryChecks } from '../services/verificationService.js';
import { createNotification } from '../services/notificationService.js';
import { maskDocumentNumber } from '../utils/index.js';
import { VERIFICATION_STATUS } from '../config/constants.js';

// Get Customer Profile & Status
export const getCustomerProfile = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({ user: req.user._id }).populate(
      'user',
      'name email mobileNumber profileImage accountStatus'
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile not found.'
      });
    }

    const responseData = customer.toObject();
    if (responseData.aadhaarNumber) {
      responseData.maskedAadhaar = maskDocumentNumber(responseData.aadhaarNumber);
    }

    return res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    next(error);
  }
};

// Submit Aadhaar document for verification
export const submitAadhaarVerification = async (req, res, next) => {
  try {
    const { aadhaarNumber } = req.body;
    const file = req.file;

    if (!file && !req.body.fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please attach an Aadhaar document file (PDF, JPEG, or PNG).'
      });
    }

    if (!aadhaarNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the 12-digit Aadhaar number.'
      });
    }

    const customer = await Customer.findOne({ user: req.user._id });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer profile record not found.'
      });
    }

    // 1. Run preliminary automated checks
    const preliminaryResults = await runCustomerPreliminaryChecks({
      file,
      aadhaarNumber,
      currentCustomerId: customer._id
    });

    const fileUrl = file ? `/uploads/${file.filename}` : req.body.fileUrl;

    customer.aadhaarNumber = aadhaarNumber.replace(/[\s-]/g, '');
    customer.aadhaarDocument = {
      fileUrl,
      originalName: file ? file.originalname : 'aadhaar_doc',
      fileType: file ? file.mimetype : 'image/jpeg',
      fileSize: file ? file.size : 1024,
      uploadedAt: new Date()
    };
    customer.preliminaryChecks = preliminaryResults;
    customer.adminApprovalStatus = VERIFICATION_STATUS.PENDING;
    customer.adminRemarks = '';
    await customer.save();

    // NOTIFY: Notify user in-app
    await createNotification({
      recipientId: req.user._id,
      title: 'Verification Submitted',
      message: 'Your Aadhaar document has been received and preliminary checks passed. Awaiting final administrator approval.',
      type: 'VERIFICATION',
      link: '/customer/verification'
    });

    return res.status(200).json({
      success: true,
      message: 'Aadhaar document submitted successfully. Preliminary automated check completed.',
      data: {
        adminApprovalStatus: customer.adminApprovalStatus,
        preliminaryChecks: customer.preliminaryChecks,
        maskedAadhaar: maskDocumentNumber(customer.aadhaarNumber)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update Customer Contact/Address Info
export const updateCustomerAddress = async (req, res, next) => {
  try {
    const { street, city, state, pincode } = req.body;

    const customer = await Customer.findOneAndUpdate(
      { user: req.user._id },
      {
        $set: {
          address: { street, city, state, pincode }
        }
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Address details updated successfully.',
      data: customer
    });
  } catch (error) {
    next(error);
  }
};
