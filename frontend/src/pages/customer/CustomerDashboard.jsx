// UI: Enhanced Customer Dashboard inspired by Reference UI (Image 1 & 3)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import {
  MessageSquareCode,
  Users,
  CalendarCheck,
  ShieldCheck,
  Clock,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Lock,
  Wrench,
  Sparkles,
  TrendingUp,
  MapPin
} from 'lucide-react';

export const CustomerDashboard = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const isApproved = profile?.adminApprovalStatus === 'APPROVED';
  const isPending = profile?.adminApprovalStatus === 'PENDING';
  const isNotSubmitted = !profile?.adminApprovalStatus || profile?.adminApprovalStatus === 'NOT_SUBMITTED';

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.getMyServiceRequests();
        if (res.success) {
          setRecentRequests(res.data.slice(0, 3));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="page-container">
      {/* Top Greeting Card (Image 3 Style) */}
      <div
        className="card"
        style={{
          padding: '30px 32px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          border: '1px solid #E2E8F0',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#4F46E5', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
            <Sparkles size={14} /> AI-Assisted Service Hub
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.8px' }}>
            Welcome back, {user?.name || 'Customer'}!
          </h1>
          <p style={{ color: '#64748B', fontSize: '15px', marginTop: '4px' }}>
            The ultimate portal for home appliance diagnostics, safe troubleshooting, and certified technicians.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => onNavigate('chat')}
            className="btn btn-primary"
            style={{ padding: '12px 24px', fontSize: '14px' }}
          >
            Diagnose Issue with AI <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Verification Status Alert Banner */}
      {isApproved && (
        <div className="alert alert-success" style={{ borderRadius: '16px' }}>
          <CheckCircle size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong>Verified Member Status Active:</strong> Your Aadhaar identity has been approved by the platform administrator. You can search our directory of certified technicians and request on-site bookings.
          </div>
        </div>
      )}

      {isPending && (
        <div className="alert alert-warning" style={{ borderRadius: '16px' }}>
          <Clock size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong>Verification In Review:</strong> Your Aadhaar submission has passed automated checks and is in the administrative approval queue. You can continue using the AI Troubleshooter freely.
          </div>
        </div>
      )}

      {isNotSubmitted && (
        <div
          className="alert alert-danger"
          style={{
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <div>
              <strong>Aadhaar Verification Required:</strong> Provider search and technician booking are locked until your identity is verified.
            </div>
          </div>
          <button
            onClick={() => onNavigate('verification')}
            className="btn btn-sm btn-primary"
            style={{ flexShrink: 0, padding: '8px 18px' }}
          >
            Submit Aadhaar <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* 3 Quick Action Project Cards (Directly matching Image 1 & 3 styles) */}
      <div className="grid-cols-3" style={{ marginBottom: '36px' }}>
        <div
          className="project-banner-card banner-indigo"
          onClick={() => onNavigate('chat')}
          style={{ cursor: 'pointer' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', opacity: 0.9 }}>
                AI DIAGNOSTICS
              </span>
              <MessageSquareCode size={22} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginTop: '10px' }}>
              Troubleshoot Device
            </h3>
            <p style={{ fontSize: '13px', opacity: 0.85, marginTop: '4px' }}>
              11 device categories with safe exterior checks
            </p>
          </div>
          <div style={{ fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Launch Assistant <ArrowRight size={13} />
          </div>
        </div>

        <div
          className="project-banner-card banner-purple"
          onClick={() => onNavigate('providers')}
          style={{ cursor: 'pointer' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', opacity: 0.9 }}>
                VERIFIED TECHNICIANS
              </span>
              {isApproved ? <Users size={22} /> : <Lock size={22} />}
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginTop: '10px' }}>
              Find Certified Experts
            </h3>
            <p style={{ fontSize: '13px', opacity: 0.85, marginTop: '4px' }}>
              {isApproved ? 'Ranked by domain expertise & availability' : 'Locked until Aadhaar verification'}
            </p>
          </div>
          <div style={{ fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {isApproved ? 'Browse Experts' : 'Unlock Directory'} <ArrowRight size={13} />
          </div>
        </div>

        <div
          className="project-banner-card banner-coral"
          onClick={() => onNavigate('requests')}
          style={{ cursor: 'pointer' }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', opacity: 0.9 }}>
                SERVICE LIFECYCLE
              </span>
              <CalendarCheck size={22} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginTop: '10px' }}>
              Track Bookings
            </h3>
            <p style={{ fontSize: '13px', opacity: 0.85, marginTop: '4px' }}>
              Monitor technician visits & provide ratings
            </p>
          </div>
          <div style={{ fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View History <ArrowRight size={13} />
          </div>
        </div>
      </div>

      {/* Recent Service Bookings Section */}
      <div className="card" style={{ borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <div>
            <h2 style={{ fontSize: '19px', fontWeight: '800', color: '#0F172A' }}>
              Recent Service Bookings
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B' }}>
              Live lifecycle tracking for on-site diagnostic appointments
            </p>
          </div>
          <button
            onClick={() => onNavigate('requests')}
            className="btn btn-secondary btn-sm"
          >
            View All Bookings
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>
            Loading bookings...
          </div>
        ) : recentRequests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '42px 16px', background: '#F8FAFC', borderRadius: '16px' }}>
            <Wrench size={34} color="#94A3B8" style={{ marginBottom: '10px' }} />
            <div style={{ fontWeight: '700', fontSize: '16px', color: '#1E293B' }}>
              No active service bookings
            </div>
            <div style={{ fontSize: '13px', color: '#64748B', maxWidth: '380px', margin: '6px auto 16px auto' }}>
              When an issue cannot be resolved via AI troubleshooting, book a verified technician here.
            </div>
            <button
              onClick={() => onNavigate('chat')}
              className="btn btn-primary btn-sm"
            >
              Start AI Diagnosis
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {recentRequests.map((req) => (
              <div
                key={req._id}
                style={{
                  padding: '18px 22px',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#FFFFFF',
                  flexWrap: 'wrap',
                  gap: '14px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '800', fontSize: '16px', color: '#0F172A' }}>
                      {req.deviceCategory} · {req.serviceDomain}
                    </span>
                    <span className={`badge badge-${req.status === 'COMPLETED' ? 'verified' : req.status === 'ACCEPTED' || req.status === 'IN_PROGRESS' ? 'info' : 'pending'}`}>
                      {req.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B' }}>
                    Assigned Provider: <strong>{req.provider?.name || 'Technician'}</strong> · Ref: #{req.requestNumber}
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('requests')}
                  className="btn btn-secondary btn-sm"
                >
                  Manage Request
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
