// DB: Customer Service Requests list with lifecycle tracking and rating review modal
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import {
  CalendarCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  MapPin,
  Calendar,
  X,
  Wrench,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export const ServiceRequestsList = ({ onNavigate }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [filterTab, setFilterTab] = useState('ALL');

  // Rating Modal state
  const [activeRateRequest, setActiveRateRequest] = useState(null);
  const [ratingScore, setRatingScore] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.getMyServiceRequests();
      if (res.success) {
        setRequests(res.data || []);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load service requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await api.updateServiceRequestStatus(requestId, {
        newStatus: 'CANCELLED',
        remarks: 'Cancelled by customer.'
      });
      if (res.success) {
        fetchRequests();
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel request.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!activeRateRequest) return;

    try {
      setRatingLoading(true);
      const res = await api.submitRating({
        serviceRequestId: activeRateRequest._id,
        rating: ratingScore,
        review: reviewText
      });
      if (res.success) {
        alert('Thank you! Your verified review has been published.');
        setActiveRateRequest(null);
        setReviewText('');
        fetchRequests();
      }
    } catch (err) {
      alert(err.message || 'Failed to submit rating.');
    } finally {
      setRatingLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="badge badge-pending">
            <Clock size={12} /> Pending Acceptance
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="badge badge-info">
            <CheckCircle size={12} /> Confirmed & Scheduled
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="badge badge-info" style={{ background: '#EDE9FE', color: '#6D28D9', borderColor: '#DDD6FE' }}>
            <Wrench size={12} /> Technician On-Site
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="badge badge-verified">
            <CheckCircle size={12} /> Service Completed
          </span>
        );
      case 'REJECTED':
        return (
          <span className="badge badge-danger">
            <XCircle size={12} /> Declined
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="badge badge-danger">
            <XCircle size={12} /> Cancelled
          </span>
        );
      default:
        return <span className="badge badge-pending">{status}</span>;
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (filterTab === 'ALL') return true;
    if (filterTab === 'ACTIVE') return ['PENDING', 'ACCEPTED', 'IN_PROGRESS'].includes(r.status);
    if (filterTab === 'COMPLETED') return r.status === 'COMPLETED';
    return true;
  });

  const activeCount = requests.filter((r) => ['PENDING', 'ACCEPTED', 'IN_PROGRESS'].includes(r.status)).length;
  const completedCount = requests.filter((r) => r.status === 'COMPLETED').length;

  return (
    <div className="page-container">
      {/* Header with Notch/Dash styled layout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '9999px', background: 'rgba(79, 70, 229, 0.08)', color: '#4F46E5', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>
            <Sparkles size={14} /> Service History & Active Jobs
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
            My Service Bookings
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>
            Track technician dispatch status, inspect diagnostic logs, and publish verified reviews.
          </p>
        </div>

        {/* Tab Filters */}
        <div style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: '9999px', gap: '4px' }}>
          {[
            { id: 'ALL', label: `All (${requests.length})` },
            { id: 'ACTIVE', label: `Active (${activeCount})` },
            { id: 'COMPLETED', label: `Completed (${completedCount})` }
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
          Loading your service bookings...
        </div>
      ) : errorMsg ? (
        <div className="alert alert-danger">{errorMsg}</div>
      ) : filteredRequests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px', background: 'rgba(255, 255, 255, 0.95)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#4F46E5' }}>
            <CalendarCheck size={32} />
          </div>
          <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#0F172A' }}>
            No service requests found
          </h3>
          <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '440px', margin: '8px auto 20px auto', lineHeight: '1.5' }}>
            When an electronics issue cannot be solved via self-guided AI troubleshooting, book a verified technician for on-site assistance.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button onClick={() => onNavigate('chat')} className="btn btn-primary btn-sm">
              <Sparkles size={14} /> AI Diagnostic Assistant
            </button>
            <button onClick={() => onNavigate('providers')} className="btn btn-secondary btn-sm">
              Browse Verified Providers
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {filteredRequests.map((item) => (
            <div
              key={item._id}
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
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
                    }}
                  >
                    <Wrench size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <span style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A' }}>
                        {item.deviceCategory}
                      </span>
                      <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '9999px', background: '#F1F5F9', color: '#475569', fontWeight: '600' }}>
                        {item.serviceDomain}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: '#4F46E5', background: '#EEF2FF', padding: '3px 10px', borderRadius: '9999px' }}>
                        #{item.requestNumber}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B' }}>
                      <strong>Brand / Model:</strong> {item.brand || 'Standard Unit'} {item.modelNumber && `(${item.modelNumber})`}
                    </div>
                  </div>
                </div>

                <div>{getStatusBadge(item.status)}</div>
              </div>

              {/* Problem statement panel */}
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
                <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                  Problem Description
                </div>
                {item.problemDescription}
              </div>

              {/* Footer Details & Action bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', paddingTop: '14px', borderTop: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', fontSize: '13px', color: '#64748B' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UserCheck size={15} color="#4F46E5" />
                    <span>Technician: <strong style={{ color: '#0F172A' }}>{item.provider?.name || 'Assigned Expert'}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={15} color="#0D9488" />
                    <span>{item.serviceAddress?.street || 'Customer Location'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={15} color="#6366F1" />
                    <span>{new Date(item.scheduledDate || item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {item.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancelRequest(item._id)}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#DC2626', borderColor: '#FECACA' }}
                    >
                      Cancel Booking
                    </button>
                  )}

                  {item.status === 'COMPLETED' && !item.isRated && (
                    <button
                      onClick={() => setActiveRateRequest(item)}
                      className="btn btn-primary btn-sm"
                      style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
                    >
                      <Star size={14} fill="#F59E0B" color="#F59E0B" /> Rate & Review Service
                    </button>
                  )}

                  {item.status === 'COMPLETED' && item.isRated && (
                    <span className="badge badge-verified" style={{ padding: '6px 14px' }}>
                      <CheckCircle size={13} /> Verified Review Submitted
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rating & Review Modal (Rule #27) */}
      {activeRateRequest && (
        <div className="modal-overlay" onClick={() => setActiveRateRequest(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              maxWidth: '520px',
              padding: '32px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                  <Star size={22} fill="#F59E0B" />
                </div>
                <div>
                  <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#0F172A' }}>
                    Rate Verified Service
                  </h3>
                  <div style={{ fontSize: '13px', color: '#64748B' }}>
                    Technician: <strong>{activeRateRequest.provider?.name}</strong>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveRateRequest(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview}>
              <div style={{ textAlign: 'center', margin: '24px 0', padding: '20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#475569', marginBottom: '12px' }}>
                  Select Service Rating
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingScore(star)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        transform: star <= ratingScore ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      <Star
                        size={34}
                        color={star <= ratingScore ? '#F59E0B' : '#CBD5E1'}
                        fill={star <= ratingScore ? '#F59E0B' : 'none'}
                      />
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', marginTop: '10px' }}>
                  {ratingScore} out of 5 Stars · {ratingScore === 5 ? 'Exceptional' : ratingScore === 4 ? 'Very Good' : ratingScore === 3 ? 'Average' : 'Needs Improvement'}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: '700' }}>
                  Written Feedback / Service Review
                </label>
                <textarea
                  className="form-textarea"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share details regarding punctuality, diagnostic accuracy, professional demeanor and safety precautions..."
                  rows={4}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setActiveRateRequest(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={ratingLoading}
                  style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
                >
                  {ratingLoading ? 'Publishing...' : 'Publish Verified Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
