// DB: Service Provider request management with action transitions
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import {
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
  Wrench,
  MapPin,
  Phone,
  User,
  AlertCircle,
  Sparkles,
  Inbox
} from 'lucide-react';

export const ProviderRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [filterTab, setFilterTab] = useState('ALL');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.getMyServiceRequests();
      if (res.success) {
        setRequests(res.data || []);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load service bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (requestId, newStatus, remarks = '') => {
    try {
      const res = await api.updateServiceRequestStatus(requestId, {
        newStatus,
        remarks: remarks || `Status transitioned to ${newStatus}`
      });
      if (res.success) {
        fetchRequests();
      }
    } catch (err) {
      alert(err.message || 'Failed to update request state.');
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filterTab === 'ALL') return true;
    if (filterTab === 'PENDING') return r.status === 'PENDING';
    if (filterTab === 'ACTIVE') return ['ACCEPTED', 'IN_PROGRESS'].includes(r.status);
    if (filterTab === 'COMPLETED') return r.status === 'COMPLETED';
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge badge-pending"><Clock size={12} /> Pending Response</span>;
      case 'ACCEPTED':
        return <span className="badge badge-info"><CheckCircle size={12} /> Confirmed</span>;
      case 'IN_PROGRESS':
        return <span className="badge badge-info" style={{ background: '#EDE9FE', color: '#6D28D9', borderColor: '#DDD6FE' }}><Wrench size={12} /> On-Site Repair</span>;
      case 'COMPLETED':
        return <span className="badge badge-verified"><CheckCircle size={12} /> Completed</span>;
      case 'REJECTED':
      case 'CANCELLED':
        return <span className="badge badge-danger"><XCircle size={12} /> {status}</span>;
      default:
        return <span className="badge badge-pending">{status}</span>;
    }
  };

  return (
    <div className="page-container">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '9999px', background: 'rgba(79, 70, 229, 0.08)', color: '#4F46E5', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>
            <Inbox size={14} /> Service Orders Queue
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
            Customer Repair Bookings
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>
            Accept incoming customer diagnostic requests, record on-site repair progress, and confirm job completion.
          </p>
        </div>

        {/* Tab Filters */}
        <div style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: '9999px', gap: '4px' }}>
          {[
            { id: 'ALL', label: `All (${requests.length})` },
            { id: 'PENDING', label: `Pending (${requests.filter((r) => r.status === 'PENDING').length})` },
            { id: 'ACTIVE', label: `In Progress (${requests.filter((r) => ['ACCEPTED', 'IN_PROGRESS'].includes(r.status)).length})` },
            { id: 'COMPLETED', label: `Completed (${requests.filter((r) => r.status === 'COMPLETED').length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              style={{
                border: 'none',
                background: filterTab === tab.id ? '#FFFFFF' : 'transparent',
                color: filterTab === tab.id ? '#0F172A' : '#64748B',
                padding: '7px 16px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: filterTab === tab.id ? '700' : '500',
                cursor: 'pointer',
                boxShadow: filterTab === tab.id ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: '#4F46E5', borderRadius: '50%', margin: '0 auto 16px auto', animation: 'spin 0.8s linear infinite' }} />
          Loading incoming requests...
        </div>
      ) : errorMsg ? (
        <div className="alert alert-danger">{errorMsg}</div>
      ) : filteredRequests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255, 255, 255, 0.95)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#4F46E5' }}>
            <CalendarCheck size={32} />
          </div>
          <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#0F172A' }}>
            No service requests found in this view
          </h3>
          <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '420px', margin: '8px auto 0 auto' }}>
            Incoming diagnostic requests matching your coverage areas and approved domains will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {filteredRequests.map((r) => (
            <div
              key={r._id}
              className="card"
              style={{
                padding: '24px',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #E2E8F0',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      flexShrink: 0
                    }}
                  >
                    <Wrench size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <span style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A' }}>
                        {r.deviceCategory}
                      </span>
                      <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '9999px', background: '#F1F5F9', color: '#475569', fontWeight: '600' }}>
                        {r.serviceDomain}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: '#4F46E5', background: '#EEF2FF', padding: '3px 10px', borderRadius: '9999px' }}>
                        #{r.requestNumber}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span>Customer: <strong style={{ color: '#0F172A' }}>{r.customer?.name}</strong></span>
                      <span>·</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={13} color="#94A3B8" /> {r.customer?.mobileNumber || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>{getStatusBadge(r.status)}</div>
              </div>

              {/* Problem detail panel */}
              <div
                style={{
                  background: '#F8FAFC',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  fontSize: '13px',
                  color: '#334155',
                  marginBottom: '16px',
                  lineHeight: '1.5'
                }}
              >
                <div><strong>Reported Problem:</strong> {r.problemDescription}</div>
                {r.brand && <div style={{ marginTop: '4px' }}><strong>Brand / Model:</strong> {r.brand} {r.modelNumber}</div>}
                <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                  <MapPin size={14} color="#0D9488" />
                  <strong>Service Address:</strong> {r.serviceAddress?.street || 'Customer address on record'}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', paddingTop: '14px', borderTop: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                  Received: {new Date(r.createdAt).toLocaleString()}
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {r.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(r._id, 'ACCEPTED', 'Technician confirmed appointment.')}
                        className="btn btn-primary btn-sm"
                        style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
                      >
                        <CheckCircle size={14} /> Accept Booking
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(r._id, 'REJECTED', 'Technician unavailable for scheduled slot.')}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#DC2626', borderColor: '#FECACA' }}
                      >
                        <XCircle size={14} /> Decline
                      </button>
                    </>
                  )}

                  {r.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleUpdateStatus(r._id, 'IN_PROGRESS', 'Technician arrived on-site and started diagnosis.')}
                      className="btn btn-primary btn-sm"
                      style={{ background: '#7C3AED', borderColor: '#7C3AED' }}
                    >
                      <Wrench size={14} /> Mark On-Site / In Progress
                    </button>
                  )}

                  {r.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => handleUpdateStatus(r._id, 'COMPLETED', 'Hardware repaired and inspected successfully.')}
                      className="btn btn-primary btn-sm"
                      style={{ background: '#10B981', borderColor: '#10B981' }}
                    >
                      <CheckCircle size={14} /> Complete Service & Handover
                    </button>
                  )}

                  {r.status === 'COMPLETED' && (
                    <span style={{ fontSize: '13px', color: '#047857', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={15} color="#10B981" /> Job Completed & Ready for Review
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
