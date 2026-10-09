// DB: Controlled troubleshooting knowledge base schema
import mongoose from 'mongoose';

const knowledgeBaseSchema = new mongoose.Schema(
  {
    deviceCategory: {
      type: String,
      required: true,
      index: true
    },
    problem: {
      type: String,
      required: true,
      index: true
    },
    symptoms: [{ type: String }],
    possibleCauses: [{ type: String }],
    safeTroubleshootingSteps: [{ type: String }],
    escalationCondition: {
      type: String,
      default: 'If symptoms persist after basic safety checks or if electrical/internal fault is suspected.'
    },
    isHighRiskHardware: {
      type: Boolean,
      default: false
    },
    safetyWarning: {
      type: String,
      default: 'Always unplug the device before inspecting exterior surfaces. Never open the appliance chassis or touch internal electronics.'
    },
    serviceDomain: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Index for text or multi-field search
knowledgeBaseSchema.index({ deviceCategory: 1, problem: 1 });

export const KnowledgeBase = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
