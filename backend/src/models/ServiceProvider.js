// DB: Service Provider schema with face verification, documents, expertise and metrics
import mongoose from 'mongoose';
import { VERIFICATION_STATUS } from '../config/constants.js';

const documentItemSchema = new mongoose.Schema({
  documentType: {
    type: String,
    required: true,
    enum: ['aadhaar', 'degree_diploma', 'technical_certificate', 'experience_certificate', 'other']
  },
  fileUrl: { type: String, required: true },
  originalName: { type: String, required: true },
  fileSize: { type: Number, default: 0 },
  uploadedAt: { type: Date, default: Date.now },
  preliminaryValid: { type: Boolean, default: true },
  notes: [String]
});

const serviceProviderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    higherEducation: {
      type: String,
      default: '',
      trim: true
    },
    location: {
      city: { type: String, default: '', index: true },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      address: { type: String, default: '' }
    },
    serviceArea: [{ type: String }], // list of cities or localities
    categories: [{ type: String, index: true }], // 11 supported device categories
    expertise: [{ type: String, index: true }], // specific domains: Display, Power, Cooling, etc.
    experienceYears: { type: Number, default: 1, min: 0 },
    
    // VERIFY: Face Registration via device camera
    faceRegistration: {
      registered: { type: Boolean, default: false },
      faceImageUrl: { type: String, default: '' },
      capturedAt: { type: Date },
      livenessScore: { type: Number, default: 0 },
      status: {
        type: String,
        enum: ['NOT_STARTED', 'PENDING', 'COMPLETED', 'FAILED'],
        default: 'NOT_STARTED'
      }
    },
    faceRegistered: { type: Boolean, default: false, index: true },

    // VERIFY: Submitted professional documents
    documents: [documentItemSchema],
    documentsVerified: { type: Boolean, default: false, index: true },

    // VERIFY: Admin approval status
    adminApprovalStatus: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.PENDING,
      index: true
    },
    adminApproved: { type: Boolean, default: false, index: true },
    approvedAt: { type: Date, index: true },
    adminRemarks: { type: String, default: '' },

    // Metrics for ranking and customer display
    rating: { type: Number, default: 0, min: 0, max: 5, index: true },
    reviewCount: { type: Number, default: 0, min: 0 },
    completedServicesCount: { type: Number, default: 0, min: 0 },
    isAvailable: { type: Boolean, default: true, index: true },
    bio: { type: String, default: '' }
  },
  {
    timestamps: true
  }
);

// VERIFY: Virtual helper to check listing eligibility
serviceProviderSchema.virtual('isEligibleForListing').get(function () {
  return (
    this.faceRegistered === true &&
    this.documentsVerified === true &&
    this.adminApproved === true
  );
});

export const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);
