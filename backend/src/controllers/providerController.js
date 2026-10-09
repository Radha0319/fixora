// VERIFY: Service Provider controller for Face Registration, Documents, and Profile
import { ServiceProvider } from '../models/ServiceProvider.js';
import { Customer } from '../models/Customer.js';
import { Rating } from '../models/Rating.js';
import { evaluateFaceRegistration, runProviderDocumentCheck } from '../services/verificationService.js';
import { searchEligibleProviders } from '../services/matchingService.js';
import { createNotification } from '../services/notificationService.js';
import { isProviderNew } from '../utils/index.js';
import { ROLES, VERIFICATION_STATUS } from '../config/constants.js';

// Get Current Provider's Private Profile
export const getMyProviderProfile = async (req, res, next) => {
  try {
    const provider = await ServiceProvider.findOne({ user: req.user._id }).populate(
      'user',
      'name email mobileNumber profileImage accountStatus'
    );

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found.'
      });
    }

    const providerObj = provider.toObject();
    providerObj.isNew = isProviderNew(provider.approvedAt);
    providerObj.isEligibleForListing =
      provider.faceRegistered &&
      provider.documentsVerified &&
      provider.adminApproved &&
      req.user.accountStatus === 'active';

    return res.status(200).json({
      success: true,
      data: providerObj
    });
  } catch (error) {
    next(error);
  }
};

// Provider Face Registration via Device Camera
export const registerFace = async (req, res, next) => {
  try {
    const { faceImage, livenessData } = req.body;
    const file = req.file;

    const imageUrl = file ? `/uploads/${file.filename}` : faceImage;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Face camera capture image is required.'
      });
    }

    const provider = await ServiceProvider.findOne({ user: req.user._id });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile record not found.'
      });
    }

    const evaluation = evaluateFaceRegistration({
      faceImageUrl: imageUrl,
      livenessData
    });

    if (!evaluation.passed) {
      return res.status(400).json({
        success: false,
        message: 'Face registration criteria failed. Ensure adequate lighting and camera center alignment.',
        details: evaluation.notes
      });
    }

    provider.faceRegistration = {
      registered: true,
      faceImageUrl: imageUrl,
      capturedAt: new Date(),
      livenessScore: evaluation.livenessScore,
      status: 'COMPLETED'
    };
    provider.faceRegistered = true;
    await provider.save();

    await createNotification({
      recipientId: req.user._id,
      title: 'Face Biometric Capture Successful',
      message: 'Your facial biometric frame was successfully captured and verified with high liveness confidence.',
      type: 'VERIFICATION',
      link: '/provider/verification'
    });

    return res.status(200).json({
      success: true,
      message: 'Face biometric captured and registered successfully.',
      data: {
        faceRegistered: true,
        livenessScore: evaluation.livenessScore
      }
    });
  } catch (error) {
    next(error);
  }
};

// Upload Verification Documents
export const uploadProviderDocuments = async (req, res, next) => {
  try {
    const { documentType } = req.body;
    const file = req.file;

    if (!file && !req.body.fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please select a document file to upload.'
      });
    }

    if (!documentType) {
      return res.status(400).json({
        success: false,
        message: 'Document type (Aadhaar, Degree/Diploma, Technical Certificate, or Experience) is required.'
      });
    }

    const provider = await ServiceProvider.findOne({ user: req.user._id });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile record not found.'
      });
    }

    const fileUrl = file ? `/uploads/${file.filename}` : req.body.fileUrl;
    const check = runProviderDocumentCheck({ file, documentType });

    provider.documents.push({
      documentType,
      fileUrl,
      originalName: file ? file.originalname : `${documentType}_doc`,
      fileSize: file ? file.size : 1024,
      uploadedAt: new Date(),
      preliminaryValid: check.valid,
      notes: check.notes
    });

    // When documents are submitted, mark preliminary document state
    provider.adminApprovalStatus = VERIFICATION_STATUS.PENDING;
    await provider.save();

    await createNotification({
      recipientId: req.user._id,
      title: 'Document Submitted',
      message: `Document '${documentType}' uploaded successfully. Awaiting admin review.`,
      type: 'VERIFICATION',
      link: '/provider/verification'
    });

    return res.status(200).json({
      success: true,
      message: 'Document submitted for review.',
      data: provider.documents
    });
  } catch (error) {
    next(error);
  }
};

// Update Expertise, Categories and Location
export const updateProviderExpertise = async (req, res, next) => {
  try {
    const { categories, expertise, experienceYears, location, serviceArea, bio } = req.body;

    const provider = await ServiceProvider.findOne({ user: req.user._id });
    if (!provider) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile record not found.'
      });
    }

    if (categories && Array.isArray(categories)) provider.categories = categories;
    if (expertise && Array.isArray(expertise)) provider.expertise = expertise;
    if (experienceYears !== undefined) provider.experienceYears = Number(experienceYears);
    if (location) provider.location = { ...provider.location, ...location };
    if (serviceArea && Array.isArray(serviceArea)) provider.serviceArea = serviceArea;
    if (bio !== undefined) provider.bio = bio;

    await provider.save();

    return res.status(200).json({
      success: true,
      message: 'Provider service expertise updated successfully.',
      data: provider
    });
  } catch (error) {
    next(error);
  }
};

// MATCH: Customer search for verified providers
// Rule #12: Customer must be admin approved to search providers!
export const searchProviders = async (req, res, next) => {
  try {
    // 1. ACCESS CONTROL: Check Customer verification state
    if (req.user.role === ROLES.CUSTOMER) {
      const customer = await Customer.findOne({ user: req.user._id });
      if (!customer || customer.adminApprovalStatus !== VERIFICATION_STATUS.APPROVED) {
        return res.status(403).json({
          success: false,
          isVerificationRequired: true,
          message: 'Provider search is locked until your account verification is approved by the admin. Please submit Aadhaar verification from your dashboard.'
        });
      }
    }

    const { deviceCategory, expertise, city } = req.query;

    const providers = await searchEligibleProviders({
      deviceCategory,
      expertise,
      city
    });

    return res.status(200).json({
      success: true,
      count: providers.length,
      data: providers
    });
  } catch (error) {
    next(error);
  }
};

// Get Public Provider Profile for Customers
export const getPublicProviderProfile = async (req, res, next) => {
  try {
    const { id } = req.params;

    const provider = await ServiceProvider.findById(id).populate(
      'user',
      'name email mobileNumber profileImage accountStatus'
    );

    if (!provider || !provider.user) {
      return res.status(404).json({
        success: false,
        message: 'Provider not found.'
      });
    }

    // Must be verified and approved to view publicly
    if (!provider.adminApproved || !provider.faceRegistered || !provider.documentsVerified) {
      return res.status(404).json({
        success: false,
        message: 'Provider is not currently listed on the active platform.'
      });
    }

    // Fetch verified customer reviews for this provider
    const reviews = await Rating.find({ provider: provider.user._id })
      .populate('customer', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(10);

    const isNew = isProviderNew(provider.approvedAt);

    // Filter out private documents and face biometrics from public output (Section 26)
    const publicProfile = {
      _id: provider._id,
      userId: provider.user._id,
      name: provider.user.name,
      email: provider.user.email,
      mobileNumber: provider.user.mobileNumber,
      profileImage: provider.user.profileImage,
      categories: provider.categories,
      expertise: provider.expertise,
      experienceYears: provider.experienceYears,
      location: provider.location,
      serviceArea: provider.serviceArea,
      rating: provider.rating,
      reviewCount: provider.reviewCount,
      completedServicesCount: provider.completedServicesCount,
      isAvailable: provider.isAvailable,
      bio: provider.bio,
      approvedAt: provider.approvedAt,
      isNew,
      reviews
    };

    return res.status(200).json({
      success: true,
      data: publicProfile
    });
  } catch (error) {
    next(error);
  }
};
