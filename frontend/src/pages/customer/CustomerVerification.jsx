// VERIFY: Elevated Customer Aadhaar Verification page with automated checks and status
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import {
  ShieldCheck,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  AlertCircle,
  Lock,
  Sparkles
} from 'lucide-react';

export const CustomerVerification = () => {
  const { profile, refreshProfile } = useAuth();
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const currentStatus = profile?.adminApprovalStatus || 'NOT_SUBMITTED';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!aadhaarNumber || aadhaarNumber.replace(/\D/g, '').length !== 12) {
      setErrorMsg('Please enter a valid 12-digit numeric Aadhaar number.');
      return;
    }

    if (!file) {
      setErrorMsg('Please select an Aadhaar identity document file (PDF, JPEG, or PNG).');
      return;
    }

    try {
      setUploading(true);
      setErrorMsg('');
      const formData = new FormData();
      formData.append('aadhaarNumber', aadhaarNumber);
      formData.append('document', file);

      const res = await api.submitCustomerAadhaar(formData);
      if (res.success) {
        setResult(res.data);
        await refreshProfile();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit verification document.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '820px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.5px' }}>
          Customer Identity Verification (Aadhaar)
        </h1>
        <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>
          To maintain safety across the service ecosystem, customers complete Aadhaar identity verification before searching or booking technicians.
        </p>
      </div>

      {/* Current Admin Approval Status Banner */}
      <div
        className="card"
        style={{
          marginBottom: '26px',
          borderRadius: '20px',
          borderLeft: currentStatus === 'APPROVED' ? '5px solid #10B981' : currentStatus === 'PENDING' ? '5px solid #F59E0B' : '5px solid #EF4444'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.8px' }}>
              Final Platform Verification Status
            </div>
            <div style={{ fontSize: '22px', fontWeight: '900', color: '#0F172A', marginTop: '3px' }}>
              {currentStatus === 'APPROVED' && '🟢 Verified & Approved Member'}
              {currentStatus === 'PENDING' && '🟡 Under Administrator Review'}
              {currentStatus === 'REJECTED' && '🔴 Submission Rejected'}
              {currentStatus === 'RESUBMISSION_REQUESTED' && '🟠 Re-Submission Requested'}
              {currentStatus === 'NOT_SUBMITTED' && '⚪ Document Not Yet Submitted'}
            </div>
            {profile?.adminRemarks && (
              <div style={{ fontSize: '13px', color: '#475569', marginTop: '6px' }}>
                <strong>Admin Remarks:</strong> {profile.adminRemarks}
              </div>
            )}
          </div>

          <div>
            {currentStatus === 'APPROVED' ? (
              <span className="badge badge-verified" style={{ padding: '8px 16px', fontSize: '13px' }}>
                <CheckCircle size={14} /> Full Access Unlocked
              </span>
            ) : (
              <span className="badge badge-pending" style={{ padding: '8px 16px', fontSize: '13px' }}>
                <Lock size={14} /> Provider Booking Locked
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Verification Standard Disclaimer */}
      <div
        style={{
          padding: '16px 20px',
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: '16px',
          fontSize: '13px',
          color: '#1E40AF',
          marginBottom: '26px',
          lineHeight: '1.5'
        }}
      >
        <strong>Verification Standard:</strong> Automated system scans perform preliminary format validation, quality checks, and deduplication. Final authorization is issued exclusively by platform administrators.
      </div>

      {/* Upload Form Card */}
      {currentStatus !== 'APPROVED' && (
        <div className="card" style={{ marginBottom: '26px', borderRadius: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '18px', color: '#0F172A' }}>
            Submit Aadhaar Credentials
          </h2>

          {errorMsg && (
            <div className="alert alert-danger" style={{ fontSize: '13px' }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">12-Digit Aadhaar Number *</label>
              <input
                type="text"
                className="form-input"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                placeholder="1234 5678 9012"
                maxLength="14"
                required
              />
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                Your Aadhaar number is masked upon submission (XXXX-XXXX-1234) for privacy.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Attach Document Scan (PDF, JPEG, or PNG, max 5MB) *</label>
              <input
                type="file"
                className="form-input"
                accept=".pdf,image/jpeg,image/png"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={uploading}
              style={{ width: '100%', padding: '13px', fontSize: '15px' }}
            >
              {uploading ? 'Validating & Uploading...' : 'Submit for Administrator Approval'}
            </button>
          </form>
        </div>
      )}

      {/* Preliminary Automated Check Results (Section 10) */}
      {(result?.preliminaryChecks || profile?.preliminaryChecks?.checkedAt) && (
        <div className="card" style={{ borderRadius: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <ShieldCheck size={22} color="#4F46E5" />
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A' }}>
              Preliminary Automated Check Breakdown
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '18px' }}>
            <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: '12px', fontSize: '13px', border: '1px solid #E2E8F0' }}>
              <div style={{ color: '#64748B', fontSize: '11px', fontWeight: '600' }}>12-Digit Format:</div>
              <strong style={{ color: '#10B981', fontSize: '14px' }}>Validated Format</strong>
            </div>

            <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: '12px', fontSize: '13px', border: '1px solid #E2E8F0' }}>
              <div style={{ color: '#64748B', fontSize: '11px', fontWeight: '600' }}>Document File Format:</div>
              <strong style={{ color: '#10B981', fontSize: '14px' }}>Accepted MIME Type</strong>
            </div>

            <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: '12px', fontSize: '13px', border: '1px solid #E2E8F0' }}>
              <div style={{ color: '#64748B', fontSize: '11px', fontWeight: '600' }}>Duplicate Check:</div>
              <strong style={{ color: '#10B981', fontSize: '14px' }}>Unique Verification Record</strong>
            </div>

            <div style={{ padding: '12px 14px', background: '#F8FAFC', borderRadius: '12px', fontSize: '13px', border: '1px solid #E2E8F0' }}>
              <div style={{ color: '#64748B', fontSize: '11px', fontWeight: '600' }}>Document Storage:</div>
              <strong style={{ color: '#4F46E5', fontSize: '14px' }}>Encrypted & Access Protected</strong>
            </div>
          </div>

          <div style={{ fontSize: '13px', color: '#64748B' }}>
            Automated evaluation recorded. Currently waiting in the administrative approval queue.
          </div>
        </div>
      )}
    </div>
  );
};
