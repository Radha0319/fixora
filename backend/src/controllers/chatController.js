// CHAT: AI Troubleshooting chat controller
import { analyzeTroubleshootingQuery } from '../services/chatService.js';
import { DEVICE_CATEGORIES } from '../config/constants.js';
import { DeviceCategory } from '../models/DeviceCategory.js';

// Send message to AI troubleshooter
export const handleChatDiagnosis = async (req, res, next) => {
  try {
    const { deviceCategory, brand, model, userDescription, history } = req.body;
    const file = req.file;

    if (!deviceCategory) {
      return res.status(400).json({
        success: false,
        message: 'Device category is required. Supported categories: ' + DEVICE_CATEGORIES.join(', ')
      });
    }

    if (!DEVICE_CATEGORIES.includes(deviceCategory)) {
      return res.status(400).json({
        success: false,
        message: `Invalid device category '${deviceCategory}'. Please select from supported categories.`
      });
    }

    if (!userDescription || userDescription.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a description of the problem or follow-up question.'
      });
    }

    let parsedHistory = [];
    if (typeof history === 'string') {
      try {
        parsedHistory = JSON.parse(history);
      } catch (e) {
        parsedHistory = [];
      }
    } else if (Array.isArray(history)) {
      parsedHistory = history;
    }

    const uploadedImageUrl = file ? `/uploads/${file.filename}` : (req.body.imageUrl || null);

    const diagnosisResult = await analyzeTroubleshootingQuery({
      deviceCategory,
      brand,
      model,
      userDescription,
      imageUploaded: Boolean(file || req.body.imageUrl),
      imageUrl: uploadedImageUrl,
      history: parsedHistory
    });

    return res.status(200).json({
      ...diagnosisResult,
      imageUrl: uploadedImageUrl
    });
  } catch (error) {
    next(error);
  }
};

// Get supported device categories list and common domains
export const getSupportedCategories = async (req, res, next) => {
  try {
    const categoriesFromDb = await DeviceCategory.find({ isActive: true });
    
    // Fallback or ensure all 11 defined categories are represented
    if (categoriesFromDb.length > 0) {
      return res.status(200).json({
        success: true,
        data: categoriesFromDb
      });
    }

    const staticList = DEVICE_CATEGORIES.map((cat) => ({
      name: cat,
      icon: 'Tool'
    }));

    return res.status(200).json({
      success: true,
      data: staticList
    });
  } catch (error) {
    next(error);
  }
};
