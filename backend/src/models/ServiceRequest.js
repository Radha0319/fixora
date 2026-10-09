// DB: Service request lifecycle schema
import mongoose from 'mongoose';
import { SERVICE_REQUEST_STATUS } from '../config/constants.js';

const statusHistorySchema = new mongoose.Schema({
  fromStatus: { type: String },
  toStatus: { type: String, required: true },
  changedAt: { type: Date, default: Date.now },
  remarks: { type: String, default: '' },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const serviceRequestSchema = new mongoose.Schema(
  {
    requestNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    deviceCategory: {
      type: String,
      required: true,
      index: true
    },
    brand: {
      type: String,
      default: ''
    },
    modelNumber: {
      type: String,
      default: ''
    },
    problemDescription: {
      type: String,
      required: true
    },
    problemImageUrl: {
      type: String,
      default: ''
    },
    serviceDomain: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(SERVICE_REQUEST_STATUS),
      default: SERVICE_REQUEST_STATUS.PENDING,
      index: true
    },
    scheduledDate: {
      type: Date
    },
    serviceAddress: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      contactNumber: { type: String, default: '' }
    },
    estimatedCost: {
      type: Number,
      default: 0
    },
    finalCost: {
      type: Number,
      default: 0
    },
    isRated: {
      type: Boolean,
      default: false
    },
    statusHistory: [statusHistorySchema]
  },
  {
    timestamps: true
  }
);

export const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
