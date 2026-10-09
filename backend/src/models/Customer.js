// DB: Customer profile and verification schema
import mongoose from 'mongoose';
import { VERIFICATION_STATUS } from '../config/constants.js';

const customerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    aadhaarNumber: {
      type: String,
      default: '',
      trim: true
    },
    aadhaarDocument: {
      fileUrl: { type: String, default: '' },
      originalName: { type: String, default: '' },
      fileType: { type: String, default: '' },
      fileSize: { type: Number, default: 0 },
      uploadedAt: { type: Date }
    },
    preliminaryChecks: {
      passed: { type: Boolean, default: false },
      fileValid: { type: Boolean, default: false },
      qualityOk: { type: Boolean, default: false },
      duplicateChecked: { type: Boolean, default: true },
      formatMatches: { type: Boolean, default: false },
      notes: [{ type: String }],
      checkedAt: { type: Date }
    },
    // VERIFY: Distinguish preliminary automated check from final admin approval
    adminApprovalStatus: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.NOT_SUBMITTED,
      index: true
    },
    approvedAt: {
      type: Date
    },
    adminRemarks: {
      type: String,
      default: ''
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' }
    }
  },
  {
    timestamps: true
  }
);

export const Customer = mongoose.model('Customer', customerSchema);
