// UI: Enhanced Modern Sidebar inspired by Reference UI (Image 3 - Dash Style)
import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LayoutDashboard,
  MessageSquareCode,
  Users,
  FileCheck,
  CalendarCheck,
  Camera,
  Layers,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Lock,
  Cpu,
  LogOut,
  Sparkles,
  User
} from 'lucide-react';

export const Sidebar = ({ currentTab, onSelectTab }) => {
  const { user, profile, logout } = useAuth();
  if (!user) return null;

  const isCustomerApproved = profile?.adminApprovalStatus === 'APPROVED';

  return (
    <aside className="sidebar">
      {/* Sidebar Navigation */}
      <nav className="sidebar-nav">
        {/* CUSTOMER TABS */}
        {user.role === 'CUSTOMER' && (
          <>
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`sidebar-link ${currentTab === 'dashboard' ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => onSelectTab('profile')}
              className={`sidebar-link ${currentTab === 'profile' ? 'active' : ''}`}
            >
              <User size={18} />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => onSelectTab('chat')}
              className={`sidebar-link ${currentTab === 'chat' ? 'active' : ''}`}
            >
              <MessageSquareCode size={18} />
              <span>AI Assistant</span>
            </button>

            <button
              onClick={() => onSelectTab('providers')}
              className={`sidebar-link ${currentTab === 'providers' ? 'active' : ''}`}
              title={!isCustomerApproved ? 'Locked until Aadhaar approval' : 'Find Verified Experts'}
            >
              <Users size={18} />
              <span>Find Experts</span>
              {!isCustomerApproved && (
                <Lock size={13} style={{ marginLeft: 'auto', opacity: 0.6 }} />
              )}
            </button>

            <button
              onClick={() => onSelectTab('requests')}
              className={`sidebar-link ${currentTab === 'requests' ? 'active' : ''}`}
            >
              <CalendarCheck size={18} />
              <span>Bookings</span>
            </button>

            <button
              onClick={() => onSelectTab('verification')}
              className={`sidebar-link ${currentTab === 'verification' ? 'active' : ''}`}
            >
              <FileCheck size={18} />
              <span>Aadhaar Identity</span>
              {isCustomerApproved && (
                <CheckCircle size={13} style={{ marginLeft: 'auto', color: '#10B981' }} />
              )}
            </button>
          </>
        )}

        {/* SERVICE PROVIDER TABS */}
        {user.role === 'PROVIDER' && (
          <>
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`sidebar-link ${currentTab === 'dashboard' ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Overview</span>
            </button>

            <button
              onClick={() => onSelectTab('profile')}
              className={`sidebar-link ${currentTab === 'profile' ? 'active' : ''}`}
            >
              <User size={18} />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => onSelectTab('requests')}
              className={`sidebar-link ${currentTab === 'requests' ? 'active' : ''}`}
            >
              <CalendarCheck size={18} />
              <span>Job Requests</span>
            </button>

            <button
              onClick={() => onSelectTab('face')}
              className={`sidebar-link ${currentTab === 'face' ? 'active' : ''}`}
            >
              <Camera size={18} />
              <span>Face Biometrics</span>
              {profile?.faceRegistered && (
                <CheckCircle size={13} style={{ marginLeft: 'auto', color: '#10B981' }} />
              )}
            </button>

            <button
              onClick={() => onSelectTab('documents')}
              className={`sidebar-link ${currentTab === 'documents' ? 'active' : ''}`}
            >
              <FileCheck size={18} />
              <span>Certificates & Proof</span>
              {profile?.documentsVerified && (
                <CheckCircle size={13} style={{ marginLeft: 'auto', color: '#10B981' }} />
              )}
            </button>

            <button
              onClick={() => onSelectTab('expertise')}
              className={`sidebar-link ${currentTab === 'expertise' ? 'active' : ''}`}
            >
              <Layers size={18} />
              <span>Domains & Cities</span>
            </button>
          </>
        )}

        {/* ADMIN TABS */}
        {user.role === 'ADMIN' && (
          <>
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`sidebar-link ${currentTab === 'dashboard' ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Platform Health</span>
            </button>

            <button
              onClick={() => onSelectTab('profile')}
              className={`sidebar-link ${currentTab === 'profile' ? 'active' : ''}`}
            >
              <User size={18} />
              <span>Admin Profile</span>
            </button>

            <button
              onClick={() => onSelectTab('customer-reviews')}
              className={`sidebar-link ${currentTab === 'customer-reviews' ? 'active' : ''}`}
            >
              <ShieldCheck size={18} />
              <span>Customer Queue</span>
            </button>

            <button
              onClick={() => onSelectTab('provider-reviews')}
              className={`sidebar-link ${currentTab === 'provider-reviews' ? 'active' : ''}`}
            >
              <Users size={18} />
              <span>Provider Queue</span>
            </button>

            <button
              onClick={() => onSelectTab('categories')}
              className={`sidebar-link ${currentTab === 'categories' ? 'active' : ''}`}
            >
              <Cpu size={18} />
              <span>11 Device Configs</span>
            </button>

            <button
              onClick={() => onSelectTab('requests')}
              className={`sidebar-link ${currentTab === 'requests' ? 'active' : ''}`}
            >
              <CalendarCheck size={18} />
              <span>Audit Bookings</span>
            </button>
          </>
        )}
      </nav>

      {/* Sidebar Footer with Leave/Logout Button (Image 3 Style) */}
      <div className="sidebar-footer">
        <button
          onClick={logout}
          className="sidebar-link"
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            color: '#FCA5A5',
            marginTop: '8px',
            border: '1px solid rgba(239, 68, 68, 0.25)'
          }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
