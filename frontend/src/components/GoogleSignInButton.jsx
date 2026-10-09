// AUTH: Google Sign-In button with Google Identity Services (GIS) & quick developer simulation
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Sparkles, User, AlertCircle, X, ExternalLink, Check, ChevronDown, ChevronUp } from 'lucide-react';

export const GoogleSignInButton = ({
  role = 'CUSTOMER',
  label = 'Sign in with Google',
  onSuccess,
  onError,
  style = {}
}) => {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSimModal, setShowSimModal] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const gisLoaded = useRef(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  // Attempt to load Google Identity Services if client ID is configured
  useEffect(() => {
    if (!googleClientId || gisLoaded.current) return;

    const loadGis = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        gisLoaded.current = true;
        try {
          if (window.google?.accounts?.id) {
            window.google.accounts.id.initialize({
              client_id: googleClientId,
              callback: handleGisResponse,
              auto_select: false
            });
          }
        } catch (e) {
          console.warn('[GIS INIT FAILED]', e);
        }
      };
      document.body.appendChild(script);
    };

    loadGis();
  }, [googleClientId]);

  const handleGisResponse = async (response) => {
    if (!response?.credential) {
      if (onError) onError('Google authentication token was not received.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      await loginWithGoogle({
        credential: response.credential,
        role
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Google authentication failed.');
      if (onError) onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    // If real Google Client ID is configured and GIS is available, trigger native Google prompt
    if (googleClientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback to simulation modal if popup was suppressed
            setShowSimModal(true);
          }
        });
        return;
      } catch (err) {
        console.warn('[GIS PROMPT ERROR]', err);
      }
    }

    // Default or fallback: open the interactive Google Account selector modal
    setShowSimModal(true);
  };

  const handleSimulateLogin = async (account) => {
    try {
      setLoading(true);
      setErrorMsg('');
      await loginWithGoogle({
        profileData: {
          email: account.email,
          name: account.name,
          picture: account.picture || '',
          googleId: account.googleId || `google_${Date.now()}`
        },
        role
      });
      setShowSimModal(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Google simulation sign-in failed.');
      if (onError) onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail) {
      setErrorMsg('Please enter a valid Google email address.');
      return;
    }
    handleSimulateLogin({
      email: customEmail,
      name: customName || customEmail.split('@')[0],
      googleId: `google_custom_${Date.now()}`
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '12px 18px',
          borderRadius: '9999px',
          background: '#FFFFFF',
          color: '#1F2937',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          fontSize: '14px',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.2s ease',
          opacity: loading ? 0.7 : 1,
          ...style
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.22)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.15)';
        }}
      >
        {/* Official Multi-colored Google "G" Icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>

        <span>{loading ? 'Connecting with Google...' : label}</span>
      </button>

      {/* Interactive Google Sign-In Selector Modal (When no client ID or during preview) */}
      {showSimModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px'
          }}
          onClick={() => setShowSimModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '28px 24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              color: '#1F2937',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>
                  Choose an account
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSimModal(false)}
                style={{
                  background: '#F3F4F6',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#6B7280'
                }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '18px', lineHeight: '1.4' }}>
              to continue to <strong style={{ color: '#4F46E5' }}>Fixora</strong> as a {role.toLowerCase()}
            </p>

            {errorMsg && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  color: '#991B1B',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '14px'
                }}
              >
                <AlertCircle size={15} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick Demo Google Accounts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
              <button
                type="button"
                onClick={() =>
                  handleSimulateLogin({
                    email: 'alex.customer@gmail.com',
                    name: 'Alex Morgan',
                    picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                    googleId: 'google_alex_1001'
                  })
                }
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#EEF2FF')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#F9FAFB')}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#4F46E5',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '15px'
                  }}
                >
                  A
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>
                    Alex Morgan
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    alex.customer@gmail.com
                  </div>
                </div>
                <span style={{ fontSize: '11px', background: '#E0E7FF', color: '#3730A3', padding: '3px 8px', borderRadius: '999px', fontWeight: '600' }}>
                  Customer
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSimulateLogin({
                    email: 'priya.technician@gmail.com',
                    name: 'Priya Sharma',
                    picture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
                    googleId: 'google_priya_1002'
                  })
                }
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#ECFDF5')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#F9FAFB')}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#059669',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '15px'
                  }}
                >
                  P
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>
                    Priya Sharma
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    priya.technician@gmail.com
                  </div>
                </div>
                <span style={{ fontSize: '11px', background: '#D1FAE5', color: '#065F46', padding: '3px 8px', borderRadius: '999px', fontWeight: '600' }}>
                  Technician
                </span>
              </button>
            </div>

            {/* Custom Google Account Input */}
            <form onSubmit={handleCustomSubmit} style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#4B5563', marginBottom: '8px' }}>
                Or use another Google email:
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="Your Name (e.g. Rahul)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #D1D5DB',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  required
                  style={{
                    flex: 1.2,
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #D1D5DB',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '9px',
                  borderRadius: '10px',
                  background: '#1F2937',
                  color: '#FFFFFF',
                  fontWeight: '600',
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {loading ? 'Signing In...' : 'Continue with this Google Email'}
              </button>
            </form>

            {/* Production OAuth Setup Instructions Accordion */}
            <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '12px' }}>
              <button
                type="button"
                onClick={() => setShowDocs(!showDocs)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'none',
                  border: 'none',
                  color: '#6366F1',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <span>Production Google Cloud Client ID Setup</span>
                {showDocs ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>

              {showDocs && (
                <div
                  style={{
                    marginTop: '10px',
                    padding: '12px',
                    background: '#F8FAFC',
                    borderRadius: '10px',
                    fontSize: '11px',
                    color: '#475569',
                    lineHeight: '1.5'
                  }}
                >
                  <p style={{ margin: '0 0 6px 0' }}>
                    To enable the native Google OAuth popup window in production:
                  </p>
                  <ol style={{ paddingLeft: '16px', margin: 0 }}>
                    <li>Create OAuth credentials in <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" style={{ color: '#4F46E5', textDecoration: 'underline' }}>Google Cloud Console</a>.</li>
                    <li>Add authorized JavaScript origin: <code>http://localhost:5173</code>.</li>
                    <li>In <code>frontend/.env</code> add: <code>VITE_GOOGLE_CLIENT_ID=&lt;your_client_id&gt;</code></li>
                    <li>In <code>backend/.env</code> add: <code>GOOGLE_CLIENT_ID=&lt;your_client_id&gt;</code></li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
