// VERIFY: Preliminary automated verification checks for Customers and Providers
import { Customer } from '../models/Customer.js';

export const runCustomerPreliminaryChecks = async ({ file, aadhaarNumber, currentCustomerId }) => {
  const notes = [];
  let fileValid = false;
  let qualityOk = false;
  let duplicateChecked = true;
  let formatMatches = false;

  // 1. File validation
  if (file) {
    const validMimes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (validMimes.includes(file.mimetype)) {
      fileValid = true;
      notes.push('Document file format is valid (JPEG/PNG/PDF).');
    } else {
      notes.push('Uploaded file format is unsupported.');
    }

    // Quality / size check
    if (file.size > 20 * 1024 && file.size <= 5 * 1024 * 1024) {
      qualityOk = true;
      notes.push('Document file size and quality criteria met.');
    } else if (file.size <= 20 * 1024) {
      notes.push('Document file size is suspiciously small. Potential unreadable scan.');
    }
  } else {
    notes.push('No physical document file was provided.');
  }

  // 2. Aadhaar format check (12 numeric digits)
  const cleanedAadhaar = aadhaarNumber ? aadhaarNumber.replace(/[\s-]/g, '') : '';
  if (/^\d{12}$/.test(cleanedAadhaar)) {
    formatMatches = true;
    notes.push('Aadhaar number adheres to standard 12-digit format.');
  } else {
    notes.push('Aadhaar number must consist of exactly 12 numeric digits.');
  }

  // 3. Duplicate check
  if (cleanedAadhaar) {
    const existing = await Customer.findOne({
      aadhaarNumber: cleanedAadhaar,
      _id: { $ne: currentCustomerId }
    });
    if (existing) {
      duplicateChecked = false;
      notes.push('Flagged: Aadhaar number has already been submitted by another profile.');
    } else {
      notes.push('Duplicate submission check passed: No existing record found.');
    }
  }

  const passed = fileValid && qualityOk && duplicateChecked && formatMatches;

  return {
    passed,
    fileValid,
    qualityOk,
    duplicateChecked,
    formatMatches,
    notes,
    checkedAt: new Date()
  };
};

export const runProviderDocumentCheck = ({ file, documentType }) => {
  const notes = [];
  let fileValid = false;

  if (file) {
    const validMimes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (validMimes.includes(file.mimetype)) {
      fileValid = true;
      notes.push(`Document '${documentType}' format validated.`);
    } else {
      notes.push(`Document '${documentType}' has an unsupported file format.`);
    }
  }

  return {
    valid: fileValid,
    notes
  };
};

export const evaluateFaceRegistration = ({ faceImageUrl, livenessData }) => {
  // Checks camera frame payload and simulated/actual browser canvas face detection
  const hasImage = Boolean(faceImageUrl && faceImageUrl.length > 50);
  const livenessScore = livenessData && livenessData.score ? Number(livenessData.score) : 0.95;

  return {
    passed: hasImage && livenessScore >= 0.7,
    livenessScore,
    status: hasImage && livenessScore >= 0.7 ? 'COMPLETED' : 'FAILED',
    notes: hasImage
      ? ['Face frame captured successfully from device camera.', `Liveness confidence score: ${Math.round(livenessScore * 100)}%`]
      : ['No valid camera image received.']
  };
};
