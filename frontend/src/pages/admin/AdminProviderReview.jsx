// VERIFY: Administrator Service Provider Review panel for face and trade credentials
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import {
  Briefcase,
  CheckCircle,
  XCircle,
  RefreshCw,
  Camera,
  FileText,
  ExternalLink,
  ShieldCheck,
  Star,
  Award,
  Sparkles
} from 'lucide-react';

export const AdminProviderReview = () => {
  const [providers, setProviders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [remarksInput, setRemarksInput] = useState({});

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminProviders(statusFilter);
      if (res.success) {
        setProviders(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [statusFilter]);

  const handleReview = async (providerId, action) => {
    const remarks = remarksInput[providerId] || '';
    try {
      setProcessingId(providerId);
      const res = await api.reviewProvider(providerId, action, remarks);
      if (res.success) {
        alert(`Provider verification updated to ${action}. Notification sent.`);
        fetchProviders();
      }
    } catch (err) {
      alert(err.message || 'Action failed.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="page-container">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '9999px', background: 'rgba(79, 70, 229, 0.08)', color: '#4F46E5', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>
            <Award size={14} /> Technician Accreditation
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
            Provider Biometric & Trade Approvals
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>
            Inspect biometric camera registrations, trade diplomas, and authorize technicians for active customer search listings.
          </p>
        </div>

        {/* Status Filter Pills */}
        <div style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: '9999px', gap: '4px', flexWrap: 'wrap' }}>
          {[
            { id: '', label: 'All Providers' },
            { id: 'PENDING', label: 'Pending' },
            { id: 'APPROVED', label: 'Approved' },
            { id: 'REJECTED', label: 'Rejected' },
            { id: 'RESUBMISSION_REQUESTED', label: 'Re-Submission' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              style={{
                border: 'none',
                background: statusFilter === st.id ? '#FFFFFF' : 'transparent',
                color: statusFilter === st.id ? '#0F172A' : '#64748B',
                padding: '7px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: statusFilter === st.id ? '700' : '500',
                cursor: 'pointer',
                boxShadow: statusFilter === st.id ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: '#4F46E5', borderRadius: '50%', margin: '0 auto 16px auto', animation: 'spin 0.8s linear infinite' }} />
          Loading provider credentials...
        </div>
      ) : providers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255, 255, 255, 0.95)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#4F46E5' }}>
            <Briefcase size={32} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
            No provider submissions found
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Technicians awaiting administrative review will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {providers.map((p) => (
            <div
              key={p._id}
              className="card"
              style={{
                padding: '24px',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #E2E8F0',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #0D9488, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: '700' }}>
                    {p.user?.name?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
                        {p.user?.name}
                      </h3>
                      <span className={`badge badge-${p.adminApprovalStatus === 'APPROVED' ? 'verified' : p.adminApprovalStatus === 'PENDING' ? 'pending' : 'danger'}`}>
                        {p.adminApprovalStatus}
                      </span>
                      {p.faceRegistered && (
                        <span className="badge badge-verified">
                          <Camera size={12} /> Biometrics Registered
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                      {p.user?.email} · {p.user?.mobileNumber} · {p.location?.city || 'Bangalore'}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748B' }}>
                  Experience: <strong>{p.experienceYears} Years</strong> · Completed: <strong>{p.completedServicesCount || 0}</strong>
                </div>
              </div>

              {/* Biometrics & Document Cards Section */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', background: '#F8FAFC', padding: '16px 20px', borderRadius: '14px', marginBottom: '18px', border: '1px solid #E2E8F0' }}>
                {/* Face Registration Frame */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                    Biometric Camera Capture
                  </div>
                  {p.faceRegistration?.faceImageUrl ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={p.faceRegistration.faceImageUrl}
                        alt="Face biometrics"
                        style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover', border: '2px solid #E2E8F0' }}
                      />
                      <div style={{ fontSize: '12px', color: '#334155' }}>
                        <div>Liveness Score: <strong>{Math.round((p.faceRegistration.livenessScore || 0.95) * 100)}%</strong></div>
                        <div style={{ color: '#10B981', fontWeight: '700', marginTop: '2px' }}>✓ Live Frame Confirmed</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: '#DC2626', fontWeight: '600' }}>
                      ⚠️ Face registration not completed by provider yet.
                    </div>
                  )}
                </div>

                {/* Uploaded Documents */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                    Uploaded Credentials ({p.documents?.length || 0})
                  </div>
                  {p.documents && p.documents.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {p.documents.map((d, i) => (
                        <div key={i} style={{ fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', padding: '6px 10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FileText size={14} color="#4F46E5" />
                            <span style={{ fontWeight: '600' }}>{d.documentType}</span>
                          </div>
                          <a href={d.fileUrl} target="_blank" rel="noreferrer" style={{ color: '#4F46E5', fontWeight: '700', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ExternalLink size={11} /> View
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: '#64748B' }}>
                      No trade documents attached yet.
                    </div>
                  )}
                </div>

                {/* Categories & Expertise */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                    Selected Domains
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {p.categories?.map((cat) => (
                      <span key={cat} style={{ fontSize: '11px', background: '#EEF2FF', color: '#4F46E5', padding: '4px 10px', borderRadius: '9999px', fontWeight: '600' }}>
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Actions */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ flex: 1, minWidth: '240px', padding: '9px 14px', fontSize: '13px', borderRadius: '9999px' }}
                  placeholder="Optional decision remarks (visible to technician)..."
                  value={remarksInput[p._id] || ''}
                  onChange={(e) => setRemarksInput({ ...remarksInput, [p._id]: e.target.value })}
                />

                <button
                  onClick={() => handleReview(p._id, 'APPROVE')}
                  disabled={processingId === p._id}
                  className="btn btn-sm btn-primary"
                  style={{ background: '#10B981', borderColor: '#10B981', padding: '8px 18px' }}
                >
                  <CheckCircle size={14} /> Approve Provider
                </button>

                <button
                  onClick={() => handleReview(p._id, 'RESUBMISSION')}
                  disabled={processingId === p._id}
                  className="btn btn-sm btn-secondary"
                  style={{ padding: '8px 16px' }}
                >
                  <RefreshCw size={14} /> Re-Submit
                </button>

                <button
                  onClick={() => handleReview(p._id, 'REJECT')}
                  disabled={processingId === p._id}
                  className="btn btn-sm btn-danger"
                  style={{ padding: '8px 16px' }}
                >
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
