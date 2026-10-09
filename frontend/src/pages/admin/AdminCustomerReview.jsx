// VERIFY: Administrator Customer Aadhaar Verification Review panel
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText,
  Clock,
  ExternalLink,
  AlertCircle,
  User,
  Sparkles
} from 'lucide-react';

export const AdminCustomerReview = () => {
  const [customers, setCustomers] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [remarksInput, setRemarksInput] = useState({});

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminCustomers(statusFilter);
      if (res.success) {
        setCustomers(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [statusFilter]);

  const handleReview = async (customerId, action) => {
    const remarks = remarksInput[customerId] || '';
    try {
      setProcessingId(customerId);
      const res = await api.reviewCustomer(customerId, action, remarks);
      if (res.success) {
        alert(`Customer verification updated to ${action}. Notification dispatched.`);
        fetchCustomers();
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
            <ShieldCheck size={14} /> Identity Compliance
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
            Customer Identity Approvals (Aadhaar)
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>
            Inspect uploaded identification files, review automated sanity checks, and authorize platform search privileges.
          </p>
        </div>

        {/* Status Filter Pills */}
        <div style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: '9999px', gap: '4px', flexWrap: 'wrap' }}>
          {[
            { id: '', label: 'All Submissions' },
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
          Loading customer verification submissions...
        </div>
      ) : customers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255, 255, 255, 0.95)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#4F46E5' }}>
            <ShieldCheck size={32} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
            No customer verification submissions found
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Submissions matching the selected filter status will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {customers.map((c) => (
            <div
              key={c._id}
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
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: '700' }}>
                    {c.user?.name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A' }}>
                        {c.user?.name}
                      </h3>
                      <span className={`badge badge-${c.adminApprovalStatus === 'APPROVED' ? 'verified' : c.adminApprovalStatus === 'PENDING' ? 'pending' : 'danger'}`}>
                        {c.adminApprovalStatus}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                      {c.user?.email} · {c.user?.mobileNumber} · {c.address?.city || 'Bangalore'}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748B' }}>
                  Submitted: {c.aadhaarDocument?.uploadedAt ? new Date(c.aadhaarDocument.uploadedAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              {/* Document & Preliminary Evaluation Section */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', background: '#F8FAFC', padding: '16px 20px', borderRadius: '14px', marginBottom: '18px', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                    Document Evidence
                  </div>
                  <div style={{ fontSize: '13px', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <FileText size={16} color="#4F46E5" />
                    <span>Aadhaar: <strong style={{ letterSpacing: '1px' }}>{c.aadhaarNumber ? `XXXX-XXXX-${c.aadhaarNumber.slice(-4)}` : 'Not provided'}</strong></span>
                  </div>
                  {c.aadhaarDocument?.fileUrl && (
                    <a
                      href={c.aadhaarDocument.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px' }}
                    >
                      <ExternalLink size={12} /> Inspect Uploaded File
                    </a>
                  )}
                </div>

                <div>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                    Preliminary Automated Check Results
                  </div>
                  <div style={{ fontSize: '12px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={14} color={c.preliminaryChecks?.formatMatches ? '#10B981' : '#EF4444'} />
                      <span>Format Verification: <strong>{c.preliminaryChecks?.formatMatches ? 'Valid 12-Digits' : 'Non-standard'}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={14} color={c.preliminaryChecks?.duplicateChecked ? '#10B981' : '#F59E0B'} />
                      <span>Duplicate Check: <strong>{c.preliminaryChecks?.duplicateChecked ? 'Unique Record' : 'Duplicate Detected'}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={14} color={c.preliminaryChecks?.fileValid ? '#10B981' : '#EF4444'} />
                      <span>File Format: <strong>{c.preliminaryChecks?.fileValid ? 'Valid Document' : 'Invalid'}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decision and Remarks Bar */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ flex: 1, minWidth: '240px', padding: '9px 14px', fontSize: '13px', borderRadius: '9999px' }}
                  placeholder="Optional decision remarks (visible to customer)..."
                  value={remarksInput[c._id] || ''}
                  onChange={(e) => setRemarksInput({ ...remarksInput, [c._id]: e.target.value })}
                />

                <button
                  onClick={() => handleReview(c._id, 'APPROVE')}
                  disabled={processingId === c._id}
                  className="btn btn-sm btn-primary"
                  style={{ background: '#10B981', borderColor: '#10B981', padding: '8px 18px' }}
                >
                  <CheckCircle size={14} /> Approve
                </button>

                <button
                  onClick={() => handleReview(c._id, 'RESUBMISSION')}
                  disabled={processingId === c._id}
                  className="btn btn-sm btn-secondary"
                  style={{ padding: '8px 16px' }}
                >
                  <RefreshCw size={14} /> Re-Submit
                </button>

                <button
                  onClick={() => handleReview(c._id, 'REJECT')}
                  disabled={processingId === c._id}
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
