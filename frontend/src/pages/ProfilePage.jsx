// UI: Universal Profile Page for all Fixora users (Customer, Service Provider, Admin)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Award,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Shield,
  ShieldCheck,
  Clock,
  Wrench,
  Camera,
  FileCheck,
  Calendar,
  Save,
  Check,
  Sparkles,
  ArrowRight,
  Activity,
  Layers,
  Key,
  RefreshCw,
  Send
} from 'lucide-react';

const HIGHER_EDUCATION_OPTIONS = [
  'ITI Diploma - Refrigeration & Air Conditioning (RAC)',
  'ITI Diploma - Electrical & Electronics',
  'Polytechnic Diploma in Electrical / Electronics Engineering',
  'Diploma in Consumer Electronics & Appliance Repair',
  'B.Tech / B.E. (Electrical / Electronics / Mechanical)',
  'B.Sc in Electronics / Computer Science / IT',
  'Certified Consumer Electronics Technician (NSDC / Skill India)',
  'Vocational Appliance Repair Certificate',
  'Higher Secondary (12th Pass) with Trade Apprenticeship',
  'Secondary School (10th Pass) with Trade Experience',
  'Other Technical Qualification'
];

const AVAILABLE_CATEGORIES = [
  'AC',
  'Refrigerator',
  'Washing Machine',
  'TV',
  'Microwave Oven',
  'Laptop',
  'Computer',
  'Phone',
  'Wi-Fi / Router',
  'Projector / Home Theatre / Speaker',
  'Printer'
];

export const ProfilePage = ({ onNavigate }) => {
  const { user, profile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('general');

  // Form states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobileNumber: user?.mobileNumber || '',
    // Customer address
    street: profile?.address?.street || '',
    city: profile?.address?.city || profile?.location?.city || '',
    state: profile?.address?.state || profile?.location?.state || '',
    pincode: profile?.address?.pincode || profile?.location?.pincode || '',
    // Provider specific
    higherEducation: profile?.higherEducation || 'ITI Diploma - Refrigeration & Air Conditioning (RAC)',
    experienceYears: profile?.experienceYears || 1,
    serviceArea: Array.isArray(profile?.serviceArea) ? profile.serviceArea.join(', ') : '',
    bio: profile?.bio || '',
    isAvailable: profile?.isAvailable !== undefined ? profile.isAvailable : true,
    // Password change
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [selectedCategories, setSelectedCategories] = useState(
    profile?.categories && profile.categories.length > 0 ? profile.categories : ['AC', 'Refrigerator']
  );

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Password verification method state ('current' = remembered password, 'otp' = 4-digit email code)
  const [passwordMethod, setPasswordMethod] = useState('current');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [devOtpNote, setDevOtpNote] = useState('');
  const [otpCooldown, setOtpCooldown] = useState(0);

  // OTP resend cooldown timer
  useEffect(() => {
    let timer;
    if (otpCooldown > 0) {
      timer = setTimeout(() => setOtpCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCooldown]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        mobileNumber: user.mobileNumber || '',
        street: profile?.address?.street || '',
        city: profile?.address?.city || profile?.location?.city || '',
        state: profile?.address?.state || profile?.location?.state || '',
        pincode: profile?.address?.pincode || profile?.location?.pincode || '',
        higherEducation: profile?.higherEducation || prev.higherEducation,
        experienceYears: profile?.experienceYears || prev.experienceYears,
        serviceArea: Array.isArray(profile?.serviceArea) ? profile.serviceArea.join(', ') : '',
        bio: profile?.bio || '',
        isAvailable: profile?.isAvailable !== undefined ? profile.isAvailable : true
      }));
      if (profile?.categories) {
        setSelectedCategories(profile.categories);
      }
    }
  }, [user, profile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Full name cannot be empty.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        mobileNumber: formData.mobileNumber.trim()
      };

      if (user.role === 'CUSTOMER') {
        payload.address = {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim()
        };
      } else if (user.role === 'PROVIDER') {
        payload.higherEducation = formData.higherEducation;
        payload.experienceYears = Number(formData.experienceYears) || 0;
        payload.bio = formData.bio.trim();
        payload.location = {
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          address: formData.street.trim()
        };
        payload.serviceArea = formData.serviceArea
          ? formData.serviceArea.split(',').map((s) => s.trim()).filter(Boolean)
          : [];
        payload.categories = selectedCategories;
        payload.isAvailable = formData.isAvailable;
      }

      await updateProfile(payload);
      setSuccessMsg('Profile details updated successfully!');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  // 1. Change password using current/last remembered password
  const handleSavePasswordCurrent = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.currentPassword) {
      setErrorMsg('Please enter your current / last remembered password.');
      return;
    }

    if (!formData.newPassword) {
      setErrorMsg('Please enter a new password.');
      return;
    }

    if (formData.newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setSuccessMsg(res.message || 'Password changed successfully!');
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setErrorMsg(err.message || 'Current password is incorrect. If you forgot your password, please use the 4-digit email code option.');
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Request 4-digit verification code to registered email
  const handleSendOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setDevOtpNote('');

    try {
      setSendingOtp(true);
      const res = await api.sendPasswordOtp();
      setOtpSent(true);
      setSuccessMsg(res.message || `A 4-digit verification code has been sent to ${user?.email}.`);
      if (res.devOtp) {
        setDevOtpNote(res.devOtp);
      }
      setOtpCooldown(60);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send verification code to email.');
    } finally {
      setSendingOtp(false);
    }
  };

  // 3. Verify 4-digit code and change password
  const handleSavePasswordOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!otpCode.trim() || otpCode.trim().length !== 4) {
      setErrorMsg('Please enter the 4-digit verification code sent to your email.');
      return;
    }

    if (!formData.newPassword) {
      setErrorMsg('Please enter a new password.');
      return;
    }

    if (formData.newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.resetPasswordWithOtp({
        otpCode: otpCode.trim(),
        newPassword: formData.newPassword
      });
      setSuccessMsg(res.message || 'Password changed successfully with verification code!');
      setOtpCode('');
      setOtpSent(false);
      setDevOtpNote('');
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setErrorMsg(err.message || 'Verification failed. Please check the 4-digit code and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadge = () => {
    if (user?.role === 'ADMIN') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#DC2626',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '700'
          }}
        >
          <Shield size={13} /> Administrator
        </span>
      );
    }

    if (user?.role === 'PROVIDER') {
      const isVerified = profile?.adminApproved && profile?.faceRegistered && profile?.documentsVerified;
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: isVerified ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            color: isVerified ? '#059669' : '#D97706',
            border: `1px solid ${isVerified ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '700'
          }}
        >
          <Wrench size={13} /> {isVerified ? 'Verified Servicer' : 'Servicer (Verification Pending)'}
        </span>
      );
    }

    const isCustomerApproved = profile?.adminApprovalStatus === 'APPROVED';
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: isCustomerApproved ? 'rgba(16, 185, 129, 0.1)' : 'rgba(79, 70, 229, 0.1)',
          color: isCustomerApproved ? '#059669' : '#4F46E5',
          border: `1px solid ${isCustomerApproved ? 'rgba(16, 185, 129, 0.25)' : 'rgba(79, 70, 229, 0.25)'}`,
          padding: '4px 12px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: '700'
        }}
      >
        <User size={13} /> {isCustomerApproved ? 'Verified Customer' : 'Customer Account'}
      </span>
    );
  };

  return (
    <div className="page-container" style={{ maxWidth: '960px' }}>
      {/* Top Banner / Hero Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #2E2875 55%, #4338CA 100%)',
          borderRadius: '24px',
          padding: '32px 36px',
          color: '#FFFFFF',
          marginBottom: '28px',
          boxShadow: '0 20px 40px -15px rgba(30, 27, 75, 0.35)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
          {/* Avatar Circle */}
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: '#FFFFFF',
              color: '#312E81',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: '800',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
              border: '3px solid rgba(255, 255, 255, 0.8)',
              flexShrink: 0
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
                {user?.name || 'User Profile'}
              </h1>
              {getRoleBadge()}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', fontSize: '13px', color: '#C7D2FE' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} color="#93C5FD" /> {user?.email}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} color="#6EE7B7" /> {user?.mobileNumber || 'Phone not set'}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={14} color="#FCD34D" /> Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Messages */}
      {successMsg && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '14px',
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '22px'
          }}
        >
          <CheckCircle size={18} color="#10B981" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '14px',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#991B1B',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '22px'
          }}
        >
          <AlertCircle size={18} color="#EF4444" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('general')}
          style={{
            padding: '8px 18px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'general' ? '#4F46E5' : 'transparent',
            color: activeTab === 'general' ? '#FFFFFF' : '#64748B',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          General & Contact Details
        </button>

        {user?.role === 'PROVIDER' && (
          <button
            onClick={() => setActiveTab('professional')}
            style={{
              padding: '8px 18px',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'professional' ? '#4F46E5' : 'transparent',
              color: activeTab === 'professional' ? '#FFFFFF' : '#64748B',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Servicer Specializations & Trade
          </button>
        )}

        <button
          onClick={() => setActiveTab('security')}
          style={{
            padding: '8px 18px',
            borderRadius: '12px',
            border: 'none',
            background: activeTab === 'security' ? '#4F46E5' : 'transparent',
            color: activeTab === 'security' ? '#FFFFFF' : '#64748B',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Security & Password
        </button>
      </div>

      {/* TAB 1: General & Contact Details */}
      {activeTab === 'general' && (
        <div className="card" style={{ padding: '28px', background: '#FFFFFF' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
            Personal & Contact Information
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '22px' }}>
            Update your primary display name, email, and mobile phone number for notifications and service bookings.
          </p>

          <form onSubmit={handleSaveGeneral}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '11px 16px 11px 40px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Email Address (Primary Account)
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    style={{
                      width: '100%',
                      padding: '11px 16px 11px 40px',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      background: '#F8FAFC',
                      color: '#64748B',
                      fontSize: '14px',
                      cursor: 'not-allowed'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Mobile Number *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 16px 11px 40px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  City / Base Location
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Bangalore"
                    style={{
                      width: '100%',
                      padding: '11px 16px 11px 40px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Address fields for Customers */}
            {user?.role === 'CUSTOMER' && (
              <div style={{ marginTop: '14px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1E293B', marginBottom: '12px' }}>
                  Service Delivery Address
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>
                      Street / Flat / House No
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="12th Main, 4th Cross"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Karnataka"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="560038"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 24px',
                fontWeight: '700',
                borderRadius: '12px'
              }}
            >
              <Save size={16} />
              {submitting ? 'Saving Changes...' : 'Save Profile Details'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: Servicer Trade & Qualifications (Providers Only) */}
      {activeTab === 'professional' && user?.role === 'PROVIDER' && (
        <div className="card" style={{ padding: '28px', background: '#FFFFFF' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
            Servicer Trade & Qualifications
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '22px' }}>
            Manage your higher education, years of field experience, appliance categories, and active availability.
          </p>

          <form onSubmit={handleSaveGeneral}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Higher Education & Trade Qualification *
                </label>
                <div style={{ position: 'relative' }}>
                  <GraduationCap size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <select
                    name="higherEducation"
                    value={formData.higherEducation}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '11px 16px 11px 40px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      outline: 'none',
                      background: '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    {HIGHER_EDUCATION_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Hands-on Experience (Years) *
                </label>
                <div style={{ position: 'relative' }}>
                  <Award size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="number"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    min="0"
                    max="50"
                    style={{
                      width: '100%',
                      padding: '11px 16px 11px 40px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Service Area Localities
                </label>
                <input
                  type="text"
                  name="serviceArea"
                  value={formData.serviceArea}
                  onChange={handleChange}
                  placeholder="e.g. Indiranagar, Koramangala, Whitefield"
                  style={{
                    width: '100%',
                    padding: '11px 16px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Job Booking Availability
                </label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '11px 16px',
                    borderRadius: '12px',
                    background: formData.isAvailable ? '#ECFDF5' : '#FEF2F2',
                    border: `1px solid ${formData.isAvailable ? '#A7F3D0' : '#FECACA'}`,
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    style={{ accentColor: '#10B981', width: '16px', height: '16px' }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: '700', color: formData.isAvailable ? '#065F46' : '#991B1B' }}>
                    {formData.isAvailable ? '✓ Available for New Client Bookings' : '⏸ Currently Busy / Paused'}
                  </span>
                </label>
              </div>
            </div>

            {/* Supported Categories Chips */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>
                Supported Appliance Categories
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {AVAILABLE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '999px',
                        border: '1px solid',
                        borderColor: isSelected ? '#4F46E5' : '#CBD5E1',
                        background: isSelected ? '#4F46E5' : '#F8FAFC',
                        color: isSelected ? '#FFFFFF' : '#475569',
                        fontSize: '12px',
                        fontWeight: isSelected ? '700' : '500',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isSelected ? `✓ ${cat}` : cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bio Textarea */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Professional Introduction & Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Describe your trade expertise, special diagnostic tools, and years of experience..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 24px',
                fontWeight: '700',
                borderRadius: '12px'
              }}
            >
              <Save size={16} />
              {submitting ? 'Updating...' : 'Update Servicer Qualifications'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: Security & Password */}
      {activeTab === 'security' && (
        <div className="card" style={{ padding: '28px', background: '#FFFFFF' }}>
          <div style={{ marginBottom: '22px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '4px' }}>
              Account Security & Password
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
              Change your password using your last remembered password, or verify your identity with a 4-digit code sent to your email.
            </p>
          </div>

          {/* Mode Switcher Pills */}
          <div
            style={{
              display: 'inline-flex',
              padding: '4px',
              background: '#F1F5F9',
              borderRadius: '12px',
              marginBottom: '24px',
              gap: '4px',
              maxWidth: '100%',
              overflowX: 'auto'
            }}
          >
            <button
              type="button"
              onClick={() => {
                setPasswordMethod('current');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '9px',
                border: 'none',
                background: passwordMethod === 'current' ? '#FFFFFF' : 'transparent',
                color: passwordMethod === 'current' ? '#4F46E5' : '#64748B',
                fontWeight: passwordMethod === 'current' ? '700' : '500',
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: passwordMethod === 'current' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Key size={15} />
              <span>I Remember Current Password</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPasswordMethod('otp');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '9px',
                border: 'none',
                background: passwordMethod === 'otp' ? '#FFFFFF' : 'transparent',
                color: passwordMethod === 'otp' ? '#4F46E5' : '#64748B',
                fontWeight: passwordMethod === 'otp' ? '700' : '500',
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: passwordMethod === 'otp' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Mail size={15} />
              <span>Forgot Password? (4-Digit Email Code)</span>
            </button>
          </div>

          {/* OPTION A: Current Password Verification */}
          {passwordMethod === 'current' && (
            <form onSubmit={handleSavePasswordCurrent} style={{ maxWidth: '460px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Current / Last Remembered Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 40px 11px 16px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748B',
                      cursor: 'pointer'
                    }}
                  >
                    {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  New Password (minimum 6 characters) *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 40px 11px 16px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#64748B',
                      cursor: 'pointer'
                    }}
                  >
                    {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat new password"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 16px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '18px' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '11px 24px',
                    fontWeight: '700',
                    borderRadius: '12px'
                  }}
                >
                  <Lock size={16} />
                  {submitting ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>

              {/* Forgot current password helper link */}
              <div
                style={{
                  padding: '12px 14px',
                  background: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  fontSize: '12px',
                  color: '#64748B'
                }}
              >
                <span>Don't remember your current password? </span>
                <button
                  type="button"
                  onClick={() => {
                    setPasswordMethod('otp');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4F46E5',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  Send 4-digit code to email
                </button>
              </div>
            </form>
          )}

          {/* OPTION B: 4-Digit Email Code Verification */}
          {passwordMethod === 'otp' && (
            <div style={{ maxWidth: '480px' }}>
              {/* Step 1: Send OTP Card */}
              <div
                style={{
                  padding: '18px 20px',
                  background: '#F8FAFC',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  marginBottom: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '2px' }}>
                      Registered Security Email
                    </div>
                    <div style={{ fontSize: '14px', color: '#4F46E5', fontWeight: '600' }}>
                      {user?.email}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={sendingOtp || otpCooldown > 0}
                    className="btn btn-secondary btn-sm"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      padding: '8px 14px'
                    }}
                  >
                    {sendingOtp ? (
                      <>
                        <RefreshCw size={13} className="spin" /> Sending Code...
                      </>
                    ) : otpCooldown > 0 ? (
                      `Resend Code (${otpCooldown}s)`
                    ) : otpSent ? (
                      <>
                        <RefreshCw size={13} /> Resend 4-Digit Code
                      </>
                    ) : (
                      <>
                        <Send size={13} /> Send 4-Digit Code
                      </>
                    )}
                  </button>
                </div>

                {devOtpNote && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '8px 12px',
                      background: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#065F46',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <CheckCircle size={14} color="#059669" />
                    <span>
                      <strong>Development Code:</strong> Your 4-digit code is <strong>{devOtpNote}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Step 2: Form with 4-Digit Code and New Password */}
              <form onSubmit={handleSavePasswordOtp}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Enter 4-Digit Verification Code *
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    required
                    style={{
                      width: '180px',
                      padding: '11px 16px',
                      borderRadius: '12px',
                      border: '2px solid #CBD5E1',
                      fontSize: '22px',
                      fontWeight: '800',
                      letterSpacing: '10px',
                      textAlign: 'center',
                      color: '#4F46E5',
                      outline: 'none',
                      background: '#FFFFFF'
                    }}
                  />
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                    Enter the 4-digit number sent to {user?.email}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    New Password (minimum 6 characters) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      required
                      style={{
                        width: '100%',
                        padding: '11px 40px 11px 16px',
                        borderRadius: '12px',
                        border: '1px solid #CBD5E1',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#64748B',
                        cursor: 'pointer'
                      }}
                    >
                      {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat new password"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '18px' }}>
                  <button
                    type="submit"
                    disabled={submitting || !otpCode.trim()}
                    className="btn btn-primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '11px 24px',
                      fontWeight: '700',
                      borderRadius: '12px'
                    }}
                  >
                    <CheckCircle size={16} />
                    {submitting ? 'Verifying & Updating...' : 'Verify Code & Set Password'}
                  </button>
                </div>

                {/* Back to current password link */}
                <div
                  style={{
                    padding: '12px 14px',
                    background: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                    color: '#64748B'
                  }}
                >
                  <span>Remembered your current password? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordMethod('current');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4F46E5',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: 0
                    }}
                  >
                    Use current password instead
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
