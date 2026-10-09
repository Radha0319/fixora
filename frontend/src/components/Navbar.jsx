// UI: Elevated Navbar with Capsule Search Bar and Profile Badges
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { Bell, Wrench, Shield, Search, LogOut, CheckCircle, Clock } from 'lucide-react';

export const Navbar = ({ onOpenNotifications, onNavigate, currentTab }) => {
  const { user, profile, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = async () => {
    if (!user) return;
    try {
      const res = await api.getNotifications();
      if (res.success) {
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (e) {
      // quiet fail
    }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const getVerificationBadge = () => {
    if (!user) return null;

    if (user.role === 'ADMIN') {
      return (
        <span className="badge badge-info" style={{ padding: '6px 14px' }}>
          <Shield size={12} /> Admin
        </span>
      );
    }

    if (user.role === 'CUSTOMER') {
      const status = profile?.adminApprovalStatus || 'NOT_SUBMITTED';
      if (status === 'APPROVED') {
        return (
          <span className="badge badge-verified" style={{ padding: '6px 14px' }}>
            <CheckCircle size={12} /> Verified Member
          </span>
        );
      }
      if (status === 'PENDING') {
        return (
          <span className="badge badge-pending" style={{ padding: '6px 14px' }}>
            <Clock size={12} /> Pending Approval
          </span>
        );
      }
      return (
        <span className="badge badge-danger" style={{ padding: '6px 14px' }}>
          Verification Required
        </span>
      );
    }

    if (user.role === 'PROVIDER') {
      const isApproved = profile?.adminApproved && profile?.faceRegistered && profile?.documentsVerified;
      if (isApproved) {
        return (
          <span className="badge badge-verified" style={{ padding: '6px 14px' }}>
            <CheckCircle size={12} /> Verified Provider
          </span>
        );
      }
      return (
        <span className="badge badge-pending" style={{ padding: '6px 14px' }}>
          <Clock size={12} /> Verification Incomplete
        </span>
      );
    }

    return null;
  };

  return (
    <header className="top-header">
      {/* Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div
          onClick={() => onNavigate('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4F46E5, #3730A3)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)'
            }}
          >
            <Wrench size={22} />
          </div>
          <div>
            <div style={{ fontWeight: '900', fontSize: '20px', color: '#0F172A', letterSpacing: '-0.8px' }}>
              FIXORA
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', lineHeight: '1', fontWeight: '500' }}>
              Diagnose · Troubleshoot · Verified Experts
            </div>
          </div>
        </div>

        {/* Capsule Search Pill (Image 3 Style) */}
        {user && (
          <div className="header-search">
            <Search size={16} color="#64748B" />
            <input
              type="text"
              placeholder="Search appliances, error codes, service domains..."
              onClick={() => {
                if (user.role === 'CUSTOMER') onNavigate('chat');
              }}
              readOnly={user.role !== 'CUSTOMER'}
            />
          </div>
        )}
      </div>

      {/* Right User Controls */}
      <div className="header-right">
        {user ? (
          <>
            {getVerificationBadge()}

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              style={{
                position: 'relative',
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
                transition: 'all 0.15s ease'
              }}
              title="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    background: '#EF4444',
                    color: '#FFF',
                    fontSize: '10px',
                    fontWeight: '800',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #FFF'
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Capsule (Image 3 Style) */}
            <div
              className="user-profile-badge"
              onClick={() => onNavigate('profile')}
              title="View and Edit Profile"
              style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
            >
              <div className="user-avatar-circle">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>
                  {user.role}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              className="btn btn-secondary btn-sm"
              title="Sign Out"
              style={{ color: '#DC2626', borderRadius: '50%', width: '38px', height: '38px', padding: 0 }}
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => onNavigate('register-servicer')}
              className="btn btn-secondary btn-sm"
              style={{
                color: '#4F46E5',
                borderColor: '#C7D2FE',
                background: 'rgba(238, 242, 255, 0.8)',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Wrench size={13} /> Join as Servicer
            </button>
            <button onClick={() => onNavigate('login')} className="btn btn-secondary btn-sm">
              Sign In
            </button>
            <button onClick={() => onNavigate('register')} className="btn btn-primary btn-sm">
              Get Started
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
