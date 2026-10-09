// AUTH: Token generator and system utility functions
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { MATCHING_WEIGHTS, NEW_PROVIDER_DAYS_THRESHOLD } from '../config/constants.js';

// Generate JWT authentication token
export const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN
  });
};

// Mask sensitive document numbers (e.g. Aadhaar: XXXX-XXXX-1234)
export const maskDocumentNumber = (docNum) => {
  if (!docNum || typeof docNum !== 'string') return '';
  const cleaned = docNum.replace(/\s+/g, '');
  if (cleaned.length <= 4) return cleaned;
  const lastFour = cleaned.slice(-4);
  return `XXXX-XXXX-${lastFour}`;
};

// Check if a provider qualifies for the NEW badge (within 30 days of admin approval)
export const isProviderNew = (approvedAt) => {
  if (!approvedAt) return false;
  const diffDays = (new Date() - new Date(approvedAt)) / (1000 * 60 * 60 * 24);
  return diffDays <= NEW_PROVIDER_DAYS_THRESHOLD && diffDays >= 0;
};

// MATCH: Calculate provider match score based on Formula:
// Score = (Expertise * 0.50) + (LocationAvailability * 0.30) + (Rating * 0.20)
export const calculateProviderScore = ({
  categoryMatch = false,
  expertiseMatch = false,
  locationMatch = false,
  isAvailable = true,
  rating = 0
}) => {
  // 1. Expertise score (0 to 1)
  let expertiseScore = 0;
  if (categoryMatch && expertiseMatch) {
    expertiseScore = 1.0;
  } else if (categoryMatch) {
    expertiseScore = 0.7;
  }

  // 2. Location & Availability score (0 to 1)
  let locAvailScore = 0;
  if (locationMatch && isAvailable) {
    locAvailScore = 1.0;
  } else if (locationMatch || isAvailable) {
    locAvailScore = 0.5;
  } else {
    locAvailScore = 0.2;
  }

  // 3. Rating score (0 to 1, normalized from 5-star scale)
  // For new providers without reviews, rating is 0 -> normalized score is 0.6 to avoid penalizing new quality experts
  const ratingScore = rating > 0 ? rating / 5.0 : 0.6;

  // Weighted total (normalized to 0-100%)
  const totalScore =
    expertiseScore * MATCHING_WEIGHTS.EXPERTISE +
    locAvailScore * MATCHING_WEIGHTS.LOCATION_AVAILABILITY +
    ratingScore * MATCHING_WEIGHTS.RATING;

  return Math.round(totalScore * 100);
};

// Sanitize user object to remove password and sensitive internals
export const sanitizeUser = (userDoc) => {
  if (!userDoc) return null;
  const obj = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete obj.password;
  delete obj.__v;
  return obj;
};
