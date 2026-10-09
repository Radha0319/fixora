// AUTH: Servicer & Service Provider Registration Page
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Briefcase,
  AlertCircle,
  GraduationCap,
  Phone,
  Mail,
  User,
  Award,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Wrench
} from 'lucide-react';
import { GoogleSignInButton } from '../components/GoogleSignInButton.jsx';

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

const EXPERIENCE_PRESETS = [
  { label: '1 Year', value: 1 },
  { label: '2-3 Yrs', value: 3 },
  { label: '4-5 Yrs', value: 5 },
  { label: '6-9 Yrs', value: 7 },
  { label: '10+ Yrs', value: 10 }
];

export const RegisterProviderPage = ({ onNavigate }) => {
  const { registerProvider } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    higherEducation: 'ITI Diploma - Refrigeration & Air Conditioning (RAC)',
    customEducation: '',
    experienceYears: 3,
    password: '',
    city: '',
    serviceArea: '',
    bio: ''
  });
  const [selectedCategories, setSelectedCategories] = useState(['AC', 'Refrigerator']);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Field Validations
    if (!formData.name.trim()) {
      setErrorMsg('Full name is required.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg('Email address is required.');
      return;
    }
    if (!formData.mobileNumber.trim()) {
      setErrorMsg('Phone number is required.');
      return;
    }

    const cleanPhone = formData.mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (!formData.city.trim()) {
      setErrorMsg('Primary city / location is required.');
      return;
    }

    const resolvedEducation =
      formData.higherEducation === 'Other Technical Qualification'
        ? formData.customEducation.trim() || 'Other Technical Qualification'
        : formData.higherEducation;

    try {
      setSubmitting(true);
      setErrorMsg('');

      await registerProvider({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        mobileNumber: cleanPhone,
        password: formData.password,
        higherEducation: resolvedEducation,
        experienceYears: Number(formData.experienceYears) || 1,
        location: {
          city: formData.city.trim()
        },
        serviceArea: formData.serviceArea
          ? formData.serviceArea.split(',').map((s) => s.trim()).filter(Boolean)
          : [formData.city.trim()],
        categories: selectedCategories,
        bio: formData.bio.trim() || `${resolvedEducation} with ${formData.experienceYears} years experience.`
      });

      onNavigate('dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Servicer registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        background: 'linear-gradient(180deg, #1E1B4B 0%, #2E2875 50%, #4338CA 85%, #F8FAFC 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative ambient background glows */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '20%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(30, 27, 75, 0) 70%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '15%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(45, 212, 191, 0.15) 0%, rgba(30, 27, 75, 0) 70%)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          padding: '44px 38px',
          background: 'rgba(30, 27, 75, 0.75)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderRadius: '30px',
          border: '1px solid rgba(255, 255, 255, 0.22)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          color: '#FFFFFF',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(45, 212, 191, 0.2)',
              border: '1px solid rgba(45, 212, 191, 0.45)',
              color: '#5EEAD4',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              boxShadow: '0 0 25px rgba(45, 212, 191, 0.35)'
            }}
          >
            <Wrench size={26} />
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.12)',
              padding: '4px 14px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: '700',
              color: '#A7F3D0',
              marginBottom: '10px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}
          >
            <Sparkles size={12} /> Servicer Portal Registration
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px', color: '#FFFFFF', margin: 0 }}>
            Join Fixora as a Servicer
          </h2>
          <p style={{ fontSize: '13px', color: '#C7D2FE', marginTop: '8px', lineHeight: '1.5' }}>
            Provide home appliance diagnostics and repairs. Get connected directly with verified clients in your city.
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '14px',
              background: 'rgba(239, 68, 68, 0.25)',
              border: '1px solid rgba(239, 68, 68, 0.45)',
              color: '#FEE2E2',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick Google Sign-In Option */}
        <div style={{ marginBottom: '22px' }}>
          <GoogleSignInButton
            role="PROVIDER"
            label="Register as Servicer with Google"
            onSuccess={() => onNavigate('dashboard')}
            onError={(msg) => setErrorMsg(msg)}
          />

          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', opacity: 0.55 }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.25)' }} />
            <span style={{ padding: '0 12px', fontSize: '11px', color: '#E0E7FF', letterSpacing: '0.5px' }}>
              OR REGISTER WITH DETAILS
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.25)' }} />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* FIELD 1: Full Name */}
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#E0E7FF',
                marginBottom: '6px'
              }}
            >
              <User size={14} color="#A5B4FC" />
              <span>Full Name or Agency Name *</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ramesh Patel / Precision Appliance Care"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#FFFFFF',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
          </div>

          {/* GRID: Phone Number & Email */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '14px',
              marginBottom: '16px'
            }}
          >
            {/* FIELD 2: Phone Number */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#E0E7FF',
                  marginBottom: '6px'
                }}
              >
                <Phone size={14} color="#34D399" />
                <span>Phone Number *</span>
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                required
                maxLength={12}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            {/* FIELD 4: Email */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#E0E7FF',
                  marginBottom: '6px'
                }}
              >
                <Mail size={14} color="#60A5FA" />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="servicer@example.com"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* FIELD 3: Higher Education */}
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#E0E7FF',
                marginBottom: '6px'
              }}
            >
              <GraduationCap size={15} color="#FBBF24" />
              <span>Higher Education / Technical Qualification *</span>
            </label>
            <select
              name="higherEducation"
              value={formData.higherEducation}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: '#242055',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                color: '#FFFFFF',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {HIGHER_EDUCATION_OPTIONS.map((opt) => (
                <option key={opt} value={opt} style={{ background: '#1E1B4B', color: '#FFFFFF' }}>
                  {opt}
                </option>
              ))}
            </select>

            {formData.higherEducation === 'Other Technical Qualification' && (
              <input
                type="text"
                name="customEducation"
                value={formData.customEducation}
                onChange={handleChange}
                placeholder="Specify your degree / diploma / certification"
                style={{
                  width: '100%',
                  marginTop: '8px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            )}
          </div>

          {/* FIELD 5: Experience */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#E0E7FF'
                }}
              >
                <Award size={14} color="#F472B6" />
                <span>Hands-on Experience (Years) *</span>
              </label>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#5EEAD4' }}>
                {formData.experienceYears} {Number(formData.experienceYears) === 1 ? 'Year' : 'Years'}
              </span>
            </div>

            {/* Quick Experience Preset Badges */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
              {EXPERIENCE_PRESETS.map((preset) => {
                const isActive = Number(formData.experienceYears) === preset.value;
                return (
                  <button
                    type="button"
                    key={preset.label}
                    onClick={() => setFormData({ ...formData, experienceYears: preset.value })}
                    style={{
                      background: isActive ? '#4F46E5' : 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid',
                      borderColor: isActive ? '#818CF8' : 'rgba(255, 255, 255, 0.15)',
                      color: isActive ? '#FFFFFF' : '#C7D2FE',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: isActive ? '700' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <input
              type="number"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              min="0"
              max="50"
              style={{
                width: '100%',
                padding: '11px 16px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#FFFFFF',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Password with Eye Toggle */}
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#E0E7FF',
                marginBottom: '6px'
              }}
            >
              <Lock size={14} color="#C084FC" />
              <span>Password *</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
                style={{
                  width: '100%',
                  padding: '12px 44px 12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#C7D2FE',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Location & Coverage */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '14px',
              marginBottom: '16px'
            }}
          >
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#E0E7FF',
                  marginBottom: '6px'
                }}
              >
                <MapPin size={14} color="#F87171" />
                <span>Primary City / Base *</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Bangalore"
                required
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#E0E7FF',
                  marginBottom: '6px'
                }}
              >
                Service Area Localities
              </label>
              <input
                type="text"
                name="serviceArea"
                value={formData.serviceArea}
                onChange={handleChange}
                placeholder="Indiranagar, Koramangala, Whitefield"
                style={{
                  width: '100%',
                  padding: '11px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Appliance Categories Multi-Select */}
          <div style={{ marginBottom: '18px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#E0E7FF',
                marginBottom: '8px'
              }}
            >
              <CheckCircle2 size={14} color="#34D399" />
              <span>Supported Appliance Categories (Select at least 1) *</span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {AVAILABLE_CATEGORIES.map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    style={{
                      background: isSelected ? 'rgba(79, 70, 229, 0.95)' : 'rgba(255, 255, 255, 0.08)',
                      color: isSelected ? '#FFFFFF' : '#CBD5E1',
                      border: '1px solid',
                      borderColor: isSelected ? '#818CF8' : 'rgba(255, 255, 255, 0.15)',
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: isSelected ? '700' : '500',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 2px 8px rgba(79, 70, 229, 0.4)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected ? `✓ ${cat}` : cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verification Protocol Notice */}
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '14px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              fontSize: '12px',
              color: '#FEF3C7',
              marginBottom: '22px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              lineHeight: '1.5'
            }}
          >
            <ShieldAlert size={18} color="#FBBF24" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong>Platform Safety Milestone:</strong> After registering, you will complete webcam face
              registration and trade document submission to activate public client bookings.
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '9999px',
              background: '#FFFFFF',
              color: '#0F172A',
              fontWeight: '700',
              fontSize: '15px',
              border: 'none',
              cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.35)',
              transition: 'all 0.2s ease',
              opacity: submitting ? 0.75 : 1
            }}
          >
            {submitting ? 'Registering Servicer Profile...' : 'Complete Servicer Registration'}
          </button>
        </form>

        {/* Footer Navigation */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#C7D2FE' }}>
          Already registered as a servicer?{' '}
          <span
            onClick={() => onNavigate('login')}
            style={{ color: '#FFFFFF', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Sign In Here
          </span>
        </div>

        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#94A3B8' }}>
          Looking for appliance repair instead?{' '}
          <span
            onClick={() => onNavigate('register')}
            style={{ color: '#C7D2FE', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Register as Customer
          </span>
        </div>
      </div>
    </div>
  );
};
