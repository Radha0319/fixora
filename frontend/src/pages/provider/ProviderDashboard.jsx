// UI: Service Provider Dashboard overview with verification checklist and incoming bookings
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import {
  ShieldCheck,
  Camera,
  FileCheck,
  Star,
  CalendarCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Award,
  TrendingUp,
  MapPin,
  ChevronRight,
  Wrench,
  GraduationCap,
  Phone,
  Mail
} from 'lucide-react';

export const ProviderDashboard = ({ onNavigate }) => {
  const { user, profile } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const faceDone = Boolean(profile?.faceRegistered);
  const docsDone = Boolean(profile?.documentsVerified);
  const adminDone = Boolean(profile?.adminApproved);
  const isEligible = faceDone && docsDone && adminDone && user?.accountStatus === 'active';

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.getMyServiceRequests('PENDING');
        if (res.success) {
          setRequests(res.data.slice(0, 4));
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
      {/* Top Greeting Headline (Image 3 Style: Clean, bold typography with capsule pill) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '9999px', background: 'rgba(79, 70, 229, 0.08)', color: '#4F46E5', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>
            <Award size={14} /> Technician Operations Center
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
            Welcome, {user?.name || 'Technician'}!
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>
            Manage diagnostic bookings, track field repairs, and complete platform safety milestones.
          </p>
        </div>

        {/* Verification Status Pill */}
        <div>
          {isEligible ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', borderRadius: '9999px', background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', fontWeight: '700', fontSize: '13px' }}>
              <CheckCircle size={16} color="#10B981" /> Verified Directory Active
            </div>
          ) : (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', borderRadius: '9999px', background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A', fontWeight: '700', fontSize: '13px' }}>
              <Clock size={16} color="#F59E0B" /> Verification Incomplete
            </div>
          )}
        </div>
      </div>

      {/* Servicer Registered Credentials Card */}
      <div
        className="card"
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#EEF2FF',
              color: '#4F46E5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700'
            }}
          >
            <GraduationCap size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Higher Education & Qualification
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
              {profile?.higherEducation || 'Technical Certification'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
            <Phone size={15} color="#10B981" />
            <span>{user?.mobileNumber || 'Not specified'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
            <Mail size={15} color="#3B82F6" />
            <span>{user?.email}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
            <Award size={15} color="#EC4899" />
            <span><strong>{profile?.experienceYears || 1}</strong> Years Experience</span>
          </div>
        </div>
      </div>

      {/* Listing Eligibility Status Alert (Section 18) */}
      {!isEligible && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.6), rgba(253, 230, 138, 0.4))',
            border: '1px solid #FDE68A',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '28px'
          }}
        >
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B45309', flexShrink: 0 }}>
            <AlertCircle size={20} />
          </div>
          <div style={{ flex: 1, fontSize: '13px', color: '#92400E', lineHeight: '1.5' }}>
            <strong style={{ fontWeight: '800' }}>Listing Safeguard Active:</strong> To protect customer safety, your profile is hidden from search results until face liveness registration, trade proof, and administrator approval are all completed.
          </div>
        </div>
      )}

      {/* 3 Step Verification Milestone Cards */}
      <div className="grid-cols-3" style={{ marginBottom: '28px' }}>
        {/* Step 1: Face Registration */}
        <div
          className="card"
          onClick={() => onNavigate('face')}
          style={{
            cursor: 'pointer',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            borderTop: faceDone ? '4px solid #10B981' : '4px solid #F59E0B',
            background: 'rgba(255, 255, 255, 0.95)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: faceDone ? '#059669' : '#D97706', letterSpacing: '0.5px' }}>
              STEP 1: BIOMETRICS
            </span>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: faceDone ? '#ECFDF5' : '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={18} color={faceDone ? '#10B981' : '#F59E0B'} />
            </div>
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>
            Face Registration
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', lineHeight: '1.4' }}>
            {faceDone ? 'Liveness camera capture validated.' : 'Activate webcam to record live liveness biometric frame.'}
          </p>
          <div style={{ fontSize: '13px', fontWeight: '700', color: faceDone ? '#10B981' : '#4F46E5', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {faceDone ? '✓ Completed' : 'Record Face Frame'} <ChevronRight size={14} />
          </div>
        </div>

        {/* Step 2: Documents */}
        <div
          className="card"
          onClick={() => onNavigate('documents')}
          style={{
            cursor: 'pointer',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            borderTop: docsDone ? '4px solid #10B981' : '4px solid #F59E0B',
            background: 'rgba(255, 255, 255, 0.95)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: docsDone ? '#059669' : '#D97706', letterSpacing: '0.5px' }}>
              STEP 2: CREDENTIALS
            </span>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: docsDone ? '#ECFDF5' : '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileCheck size={18} color={docsDone ? '#10B981' : '#F59E0B'} />
            </div>
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>
            Trade Documents
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', lineHeight: '1.4' }}>
            {docsDone ? 'Technical credentials verified.' : 'Upload ITI, diploma, Aadhaar or authorized service proof.'}
          </p>
          <div style={{ fontSize: '13px', fontWeight: '700', color: docsDone ? '#10B981' : '#4F46E5', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {docsDone ? '✓ Approved' : 'Upload Documents'} <ChevronRight size={14} />
          </div>
        </div>

        {/* Step 3: Admin Approval */}
        <div
          className="card"
          style={{
            padding: '24px',
            borderTop: adminDone ? '4px solid #10B981' : '4px solid #94A3B8',
            background: 'rgba(255, 255, 255, 0.95)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: adminDone ? '#059669' : '#64748B', letterSpacing: '0.5px' }}>
              STEP 3: OVERSIGHT
            </span>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: adminDone ? '#ECFDF5' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={18} color={adminDone ? '#10B981' : '#64748B'} />
            </div>
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>
            Admin Authorization
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', lineHeight: '1.4' }}>
            {adminDone ? 'Security audit completed.' : 'Administrator manual review of biometrics and credentials.'}
          </p>
          <div style={{ fontSize: '13px', fontWeight: '700', color: adminDone ? '#10B981' : '#64748B' }}>
            {adminDone ? '✓ Verified & Active' : '🟡 In Admin Queue'}
          </div>
        </div>
      </div>

      {/* Colorful Dash Metric Cards (Reference Image 3 Style) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Metric 1 */}
        <div className="project-banner-card banner-indigo">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Completed Repairs
              </div>
              <div style={{ fontSize: '36px', fontWeight: '800', marginTop: '6px' }}>
                {profile?.completedServicesCount || 0}
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wrench size={22} color="#FFFFFF" />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.85)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TrendingUp size={14} /> Total verified on-site field visits
          </div>
        </div>

        {/* Metric 2 */}
        <div className="project-banner-card banner-purple">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Customer Rating
              </div>
              <div style={{ fontSize: '36px', fontWeight: '800', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {profile?.rating > 0 ? (
                  <>
                    <span>{profile.rating}</span>
                    <Star size={24} fill="#FDE047" color="#FDE047" />
                  </>
                ) : (
                  <span style={{ fontSize: '20px' }}>NEW PROVIDER</span>
                )}
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={22} color="#FFFFFF" />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.85)' }}>
            {profile?.reviewCount ? `${profile.reviewCount} customer reviews` : 'Informational badge for first 30 days'}
          </div>
        </div>

        {/* Metric 3: Dash-style Pink/Coral Action Card */}
        <div className="project-banner-card banner-coral">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.85)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Service Domains
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px' }}>
                {profile?.categories?.length || 1} Categories
              </div>
            </div>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={22} color="#FFFFFF" />
            </div>
          </div>
          <div
            onClick={() => onNavigate('expertise')}
            style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', background: 'rgba(255, 255, 255, 0.2)', padding: '6px 12px', borderRadius: '9999px', width: 'fit-content' }}
          >
            Manage Specializations <ArrowRight size={13} />
          </div>
        </div>
      </div>

      {/* Incoming Booking Requests Table/Card */}
      <div className="card" style={{ background: 'rgba(255, 255, 255, 0.95)', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>
              Pending Service Bookings
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
              Customer diagnostic requests awaiting your acceptance and scheduling
            </p>
          </div>
          <button onClick={() => onNavigate('requests')} className="btn btn-secondary btn-sm">
            View All Bookings <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
            Loading bookings...
          </div>
        ) : requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', color: '#4F46E5' }}>
              <CalendarCheck size={28} />
            </div>
            <div style={{ fontWeight: '800', fontSize: '16px', color: '#0F172A' }}>
              No pending service requests
            </div>
            <div style={{ fontSize: '13px', color: '#64748B', maxWidth: '400px', margin: '6px auto 0 auto', lineHeight: '1.5' }}>
              New diagnostic requests from verified customers in your coverage areas will automatically route to your dashboard.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {requests.map((r) => (
              <div
                key={r._id}
                style={{
                  padding: '18px 22px',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px',
                  background: '#FFFFFF',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5', fontWeight: '800' }}>
                    <Wrench size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '15px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{r.deviceCategory}</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '9999px', background: '#F1F5F9', color: '#475569', fontWeight: '600' }}>
                        {r.serviceDomain}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span>Customer: <strong style={{ color: '#0F172A' }}>{r.customer?.name}</strong></span>
                      <span>·</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} color="#94A3B8" /> {r.serviceAddress?.street}
                      </span>
                    </div>
                  </div>
                </div>

                <button onClick={() => onNavigate('requests')} className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
                  Review & Respond
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
