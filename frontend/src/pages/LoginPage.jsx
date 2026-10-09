// AUTH: Elevated Frosted Glassmorphism Login Page inspired by Reference UI (Image 1)
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Wrench,
  Shield,
  AlertCircle,
  ArrowRight,
  UserCheck,
  Briefcase,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { GoogleSignInButton } from '../components/GoogleSignInButton.jsx';

export const LoginPage = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg('');
      await login(email, password);
      onNavigate('dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
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
      {/* Ambient background glow accents */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '30%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(129, 140, 248, 0.2) 0%, rgba(30, 27, 75, 0) 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Frosted Glassmorphism Card (Image 1 Style) */}
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '44px 38px',
          background: 'rgba(30, 27, 75, 0.65)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          borderRadius: '28px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          color: '#FFFFFF',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Centered Glowing Sun/Icon Glyph (Image 1 Style) */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              boxShadow: '0 0 20px rgba(165, 180, 252, 0.35)'
            }}
          >
            <Sparkles size={24} color="#C7D2FE" />
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: '800', letterSpacing: '-0.5px', color: '#FFFFFF' }}>
            Welcome back!
          </h2>
          <p style={{ fontSize: '13px', color: '#C7D2FE', marginTop: '6px', lineHeight: '1.5' }}>
            Sign in to access your appliance diagnostics, verified technicians, and service journey.
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
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#E0E7FF', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#FFFFFF',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s ease'
              }}
            />
          </div>

          {/* Password Input with show/hide eye toggle */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#E0E7FF', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '12px 44px 12px 18px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
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

          {/* Remember me & Forgot Password (Image 1 Style) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', fontSize: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#E0E7FF' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#4F46E5', borderRadius: '4px' }}
              />
              <span>Remember me</span>
            </label>
            <span style={{ color: '#C7D2FE', cursor: 'pointer', opacity: 0.85 }}>
              Forgot password?
            </span>
          </div>

          {/* Solid White Pill Log In Button (Image 1 Style) */}
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
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            {submitting ? 'Authenticating...' : 'Log In'}
          </button>
        </form>

        {/* Divider with "Or" */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', opacity: 0.6 }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.25)' }} />
          <span style={{ padding: '0 12px', fontSize: '12px', color: '#E0E7FF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.25)' }} />
        </div>

        {/* Sign in with Google Button */}
        <div style={{ marginBottom: '22px' }}>
          <GoogleSignInButton
            role="CUSTOMER"
            label="Sign in with Google"
            onSuccess={() => onNavigate('dashboard')}
            onError={(msg) => setErrorMsg(msg)}
          />
        </div>

        {/* Divider with "Or Demo Profiles" */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', opacity: 0.5 }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.2)' }} />
          <span style={{ padding: '0 12px', fontSize: '11px', color: '#C7D2FE' }}>Or Instant Demo Profiles</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.2)' }} />
        </div>

        {/* Quick Demo Credentials Buttons (Image 1 Alternative sign-in style) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '22px' }}>
          <button
            type="button"
            onClick={() => handleQuickFill('customer@fixora.com', 'CustomerPassword@123')}
            style={{
              padding: '9px 8px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <UserCheck size={13} color="#93C5FD" /> Customer
          </button>

          <button
            type="button"
            onClick={() => handleQuickFill('suresh.ac@fixora.com', 'ProviderPassword@123')}
            style={{
              padding: '9px 8px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Briefcase size={13} color="#6EE7B7" /> Provider
          </button>

          <button
            type="button"
            onClick={() => handleQuickFill('admin@fixora.com', 'AdminPassword@123')}
            style={{
              padding: '9px 8px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Shield size={13} color="#FCD34D" /> Admin
          </button>
        </div>

        {/* Footer Links */}
        <div style={{ textAlign: 'center', fontSize: '13px', color: '#C7D2FE', lineHeight: '1.6' }}>
          <div>
            Don't have an account?{' '}
            <span
              onClick={() => onNavigate('register')}
              style={{ color: '#FFFFFF', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Sign Up as Customer
            </span>
          </div>
          <div style={{ marginTop: '6px', fontSize: '12px' }}>
            Are you a technician?{' '}
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
