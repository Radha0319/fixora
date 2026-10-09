// VERIFY: Service Provider Credential and Document Upload page
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import {
  FileText,
  Upload,
  CheckCircle,
  Clock,
  ShieldCheck,
  AlertCircle,
  Award,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const DOC_TYPES = [
  { id: 'technical_certificate', name: 'Technical / Trade Certificate (ITI, Poly, HVAC, etc.)' },
  { id: 'degree_diploma', name: 'Degree or Diploma Certificate' },
  { id: 'experience_certificate', name: 'Experience Certificate / Recommendation' },
  { id: 'aadhaar', name: 'Aadhaar / National Identity Document' },
  { id: 'other', name: 'Other Professional Proof' }
];

export const ProviderDocuments = () => {
  const { profile, refreshProfile } = useAuth();
  const [docType, setDocType] = useState('technical_certificate');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const documents = profile?.documents || [];

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select a document file to upload.');
      return;
    }

    try {
      setUploading(true);
      setErrorMsg('');
      setSuccessMsg('');

      const formData = new FormData();
      formData.append('documentType', docType);
      formData.append('document', file);

      const res = await api.uploadProviderDocument(formData);
      if (res.success) {
        setSuccessMsg(`Document for '${docType}' submitted successfully.`);
        setFile(null);
        await refreshProfile();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Document upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '840px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '9999px', background: 'rgba(79, 70, 229, 0.08)', color: '#4F46E5', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>
          <Award size={14} /> Credential Verification
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
          Trade & Verification Documents
        </h1>
        <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>
          Upload recognized technical certifications, trade diplomas, and proof of experience to qualify for customer directory listings.
        </p>
      </div>

      {successMsg && <div className="alert alert-success" style={{ marginBottom: '20px' }}>{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger" style={{ marginBottom: '20px' }}>{errorMsg}</div>}

      {/* Upload Form Card */}
      <div className="card" style={{ marginBottom: '28px', padding: '28px', background: 'rgba(255, 255, 255, 0.95)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
            <Upload size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
              Upload New Credential Proof
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B' }}>
              Select a valid document category and upload high-resolution proof
            </p>
          </div>
        </div>

        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700' }}>Document Category *</label>
            <select
              className="form-select"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              style={{ borderRadius: '12px', padding: '12px 14px' }}
            >
              {DOC_TYPES.map((dt) => (
                <option key={dt.id} value={dt.id}>
                  {dt.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: '700' }}>Document File (PDF, JPEG, or PNG up to 5MB) *</label>
            <div
              style={{
                border: '2px dashed #CBD5E1',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                background: '#F8FAFC',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <FileText size={32} color="#6366F1" style={{ margin: '0 auto 8px auto' }} />
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>
                {file ? file.name : 'Click to select or drag document file'}
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                Supports certified scans or photos up to 5MB
              </div>
              <input
                type="file"
                className="form-input"
                accept=".pdf,image/jpeg,image/png"
                onChange={(e) => setFile(e.target.files[0])}
                required
                style={{ marginTop: '12px', maxWidth: '320px', margin: '12px auto 0 auto' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={uploading}
            style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
          >
            {uploading ? 'Validating & Uploading...' : 'Upload for Administrator Verification'}
          </button>
        </form>

        <div style={{ marginTop: '16px', fontSize: '12px', color: '#64748B', lineHeight: '1.5', textAlign: 'center' }}>
          All uploaded documents undergo preliminary format validation and are reviewed manually by platform administrators before provider activation.
        </div>
      </div>

      {/* Uploaded Documents List */}
      <div className="card" style={{ padding: '28px', background: 'rgba(255, 255, 255, 0.95)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
            Submitted Verification Documents ({documents.length})
          </h3>
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>
            Permanent Security Ledger
          </span>
        </div>

        {documents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 20px', color: '#94A3B8', background: '#F8FAFC', borderRadius: '16px' }}>
            <FileText size={36} color="#CBD5E1" style={{ marginBottom: '8px' }} />
            <div style={{ fontWeight: '700', color: '#0F172A', fontSize: '15px' }}>No documents uploaded yet</div>
            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
              Upload at least one recognized trade credential to initiate administrator review.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {documents.map((doc, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px 20px',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#FFFFFF',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A' }}>
                      {doc.originalName || doc.documentType}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                      Type: <strong style={{ color: '#334155' }}>{doc.documentType}</strong> · Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      <ExternalLink size={12} /> View File
                    </a>
                  )}
                  <span className="badge badge-pending">
                    <Clock size={12} /> Admin Review Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
