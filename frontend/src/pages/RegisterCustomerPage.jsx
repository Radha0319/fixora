// AUTH: Elevated Customer Registration page with frosted glass styling
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { User, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { GoogleSignInButton } from '../components/GoogleSignInButton.jsx';

export const RegisterCustomerPage = ({ onNavigate }) => {
  const { registerCustomer } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    password: '',
    city: '',
    pincode: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobileNumber || !formData.password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      await registerCustomer({
        name: formData.name,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        address: {
          city: formData.city,
          pincode: formData.pincode
        }
      });
      onNavigate('dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
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
        position: 'relative'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '44px 38px',
          background: 'rgba(30, 27, 75, 0.7)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          borderRadius: '28px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          color: '#FFFFFF'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              boxShadow: '0 0 20px rgba(165, 180, 252, 0.35)'
            }}
          >
            <User size={24} color="#C7D2FE" />
          </div>
          <h2 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Customer Sign Up
          </h2>
          <p style={{ fontSize: '13px', color: '#C7D2FE', marginTop: '6px' }}>
            Create an account to diagnose appliances and book verified technicians
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.25)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#FEE2E2',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '18px'
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#E0E7FF', marginBottom: '6px' }}>
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#E0E7FF', marginBottom: '6px' }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
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
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#E0E7FF', marginBottom: '6px' }}>
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="10-digit number"
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
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#E0E7FF', marginBottom: '6px' }}>
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#E0E7FF', marginBottom: '6px' }}>
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Bangalore"
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
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#E0E7FF', marginBottom: '6px' }}>
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="e.g. 560038"
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

          <div
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(79, 70, 229, 0.25)',
              border: '1px solid rgba(165, 180, 252, 0.3)',
              fontSize: '12px',
              color: '#E0E7FF',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ShieldCheck size={16} color="#A5B4FC" />
            <span>Aadhaar verification is completed in your dashboard after signup.</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '9999px',
              background: '#FFFFFF',
              color: '#0F172A',
              fontWeight: '700',
              fontSize: '15px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)'
            }}
          >
            {submitting ? 'Creating account...' : 'Create Customer Account'}
          </button>
        </form>

        {/* Divider with "Or" */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', opacity: 0.6 }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.25)' }} />
          <span style={{ padding: '0 12px', fontSize: '12px', color: '#E0E7FF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.25)' }} />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <GoogleSignInButton
            role="CUSTOMER"
            label="Sign up with Google"
            onSuccess={() => onNavigate('dashboard')}
            onError={(msg) => setErrorMsg(msg)}
          />
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#C7D2FE', lineHeight: '1.6' }}>
          <div>
            Already have an account?{' '}
            <span
              onClick={() => onNavigate('login')}
              style={{ color: '#FFFFFF', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign In
            </span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px' }}>
            Are you a service technician?{' '}
            <span
              onClick={() => onNavigate('register-servicer')}
              style={{ color: '#5EEAD4', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Register as Servicer
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
