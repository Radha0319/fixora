// DB: constants definition for Fixora system

export const ROLES = {
  CUSTOMER: 'CUSTOMER',
  PROVIDER: 'PROVIDER',
  ADMIN: 'ADMIN'
};

export const VERIFICATION_STATUS = {
  NOT_SUBMITTED: 'NOT_SUBMITTED',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  RESUBMISSION_REQUESTED: 'RESUBMISSION_REQUESTED'
};

export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  SUSPENDED: 'suspended'
};

export const SERVICE_REQUEST_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export const DEVICE_CATEGORIES = [
  'TV',
  'Wi-Fi / Router',
  'Laptop',
  'Phone',
  'Projector / Home Theatre / Speaker',
  'Washing Machine',
  'Refrigerator',
  'AC',
  'Computer',
  'Microwave Oven',
  'Printer'
];

// MATCH: Configurable weights for provider ranking formula
export const MATCHING_WEIGHTS = {
  EXPERTISE: 0.50,
  LOCATION_AVAILABILITY: 0.30,
  RATING: 0.20
};

// Provider NEW badge validity period in days
export const NEW_PROVIDER_DAYS_THRESHOLD = 30;

// High-risk hardware keywords that trigger safety warnings
export const DANGEROUS_HARDWARE_KEYWORDS = [
  'capacitor',
  'magnetron',
  'compressor',
  'gas leak',
  'refrigerant',
  'freon',
  'mains power',
  'high voltage',
  'sparking',
  'smoke',
  'burning smell',
  'motherboard solder',
  'internal wiring',
  'open casing',
  'shock'
];
