// DB: Device categories and problem domains schema
import mongoose from 'mongoose';

const problemDomainSchema = new mongoose.Schema({
  problemName: { type: String, required: true },
  serviceDomain: { type: String, required: true },
  description: { type: String, default: '' },
  isHighRisk: { type: Boolean, default: false }
});

const deviceCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    icon: {
      type: String,
      default: 'Wrench'
    },
    description: {
      type: String,
      default: ''
    },
    commonProblems: [problemDomainSchema],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const DeviceCategory = mongoose.model('DeviceCategory', deviceCategorySchema);
