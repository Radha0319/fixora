// API: Centralized HTTP client service for Fixora backend
const BASE_URL = '/api';

const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('fixora_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const api = {
  // AUTH:
  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  googleAuth: async (payload) => {
    const res = await fetch(`${BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  registerCustomer: async (customerData) => {
    const res = await fetch(`${BASE_URL}/auth/register/customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });
    return handleResponse(res);
  },

  registerProvider: async (providerData) => {
    const res = await fetch(`${BASE_URL}/auth/register/provider`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(providerData)
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  updateProfile: async (profileData) => {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    return handleResponse(res);
  },

  changePassword: async (passwordData) => {
    const res = await fetch(`${BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwordData)
    });
    return handleResponse(res);
  },

  sendPasswordOtp: async () => {
    const res = await fetch(`${BASE_URL}/auth/send-password-otp`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  resetPasswordWithOtp: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/reset-password-with-otp`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // CUSTOMER:
  getCustomerProfile: async () => {
    const res = await fetch(`${BASE_URL}/customers/profile`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  submitCustomerAadhaar: async (formData) => {
    const res = await fetch(`${BASE_URL}/customers/verification`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: formData
    });
    return handleResponse(res);
  },

  updateCustomerAddress: async (addressData) => {
    const res = await fetch(`${BASE_URL}/customers/address`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(addressData)
    });
    return handleResponse(res);
  },

  // PROVIDER:
  getMyProviderProfile: async () => {
    const res = await fetch(`${BASE_URL}/providers/profile`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  registerFace: async (payload) => {
    // If payload is FormData, use true; if json, use regular
    const isForm = payload instanceof FormData;
    const res = await fetch(`${BASE_URL}/providers/face-registration`, {
      method: 'POST',
      headers: getAuthHeaders(isForm),
      body: isForm ? payload : JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  uploadProviderDocument: async (formData) => {
    const res = await fetch(`${BASE_URL}/providers/documents`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: formData
    });
    return handleResponse(res);
  },

  updateProviderExpertise: async (expertiseData) => {
    const res = await fetch(`${BASE_URL}/providers/expertise`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(expertiseData)
    });
    return handleResponse(res);
  },

  searchProviders: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/providers/search?${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getPublicProviderProfile: async (id) => {
    const res = await fetch(`${BASE_URL}/providers/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // ADMIN:
  getAdminStats: async () => {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getAdminCustomers: async (status = '') => {
    const url = status ? `${BASE_URL}/admin/customers?status=${status}` : `${BASE_URL}/admin/customers`;
    const res = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  reviewCustomer: async (customerId, action, remarks) => {
    const res = await fetch(`${BASE_URL}/admin/customers/${customerId}/review`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ action, remarks })
    });
    return handleResponse(res);
  },

  getAdminProviders: async (status = '') => {
    const url = status ? `${BASE_URL}/admin/providers?status=${status}` : `${BASE_URL}/admin/providers`;
    const res = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  reviewProvider: async (providerId, action, remarks) => {
    const res = await fetch(`${BASE_URL}/admin/providers/${providerId}/review`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ action, remarks })
    });
    return handleResponse(res);
  },

  // CHAT:
  diagnoseChat: async (payload) => {
    const isForm = payload instanceof FormData;
    const res = await fetch(`${BASE_URL}/chat`, {
      method: 'POST',
      headers: isForm ? {} : { 'Content-Type': 'application/json' },
      body: isForm ? payload : JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  getCategories: async () => {
    const res = await fetch(`${BASE_URL}/chat/categories`);
    return handleResponse(res);
  },

  // SERVICE REQUESTS:
  createServiceRequest: async (formDataOrObj) => {
    const isForm = formDataOrObj instanceof FormData;
    const res = await fetch(`${BASE_URL}/service-requests`, {
      method: 'POST',
      headers: getAuthHeaders(isForm),
      body: isForm ? formDataOrObj : JSON.stringify(formDataOrObj)
    });
    return handleResponse(res);
  },

  getMyServiceRequests: async (status = '') => {
    const url = status ? `${BASE_URL}/service-requests?status=${status}` : `${BASE_URL}/service-requests`;
    const res = await fetch(url, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getServiceRequestById: async (id) => {
    const res = await fetch(`${BASE_URL}/service-requests/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  updateServiceRequestStatus: async (id, statusData) => {
    const res = await fetch(`${BASE_URL}/service-requests/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(statusData)
    });
    return handleResponse(res);
  },

  // RATINGS:
  submitRating: async (ratingData) => {
    const res = await fetch(`${BASE_URL}/ratings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(ratingData)
    });
    return handleResponse(res);
  },

  getProviderReviews: async (providerId) => {
    const res = await fetch(`${BASE_URL}/ratings/provider/${providerId}`);
    return handleResponse(res);
  },

  // NOTIFICATIONS:
  getNotifications: async () => {
    const res = await fetch(`${BASE_URL}/notifications`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  markNotificationRead: async (id) => {
    const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  markAllNotificationsRead: async () => {
    const res = await fetch(`${BASE_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  }
};
