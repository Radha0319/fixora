// MATCH: Elevated Verified Provider Search and Booking interface
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import {
  Search,
  Filter,
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Lock,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles,
  X
} from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'TV',
  'Wi-Fi / Router',
  'Laptop',
  'Phone',
  'Projector / Home Theatre / Speaker',
  'Washing Machine',
  'Refrigerator',
  'AC',
  'Computer',
  'Microwave Oven',
  'Printer'
];

export const ProviderSearch = ({ onNavigate, searchParams = {} }) => {
  const { user, profile } = useAuth();
  const [providers, setProviders] = useState([]);
  const [category, setCategory] = useState(searchParams.category || 'All Categories');
  const [city, setCity] = useState(searchParams.city || '');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  // Booking Modal State
  const [bookingProvider, setBookingProvider] = useState(null);
  const [brand, setBrand] = useState('');
  const [problemDescription, setProblemDescription] = useState(searchParams.expertise || '');
  const [serviceAddress, setServiceAddress] = useState(profile?.address?.street || '');
  const [scheduledDate, setScheduledDate] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');

  const isCustomerApproved = profile?.adminApprovalStatus === 'APPROVED';

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      setIsLocked(false);

      const params = {};
      if (category && category !== 'All Categories') params.deviceCategory = category;
      if (searchParams.expertise) params.expertise = searchParams.expertise;
      if (city) params.city = city;

      const res = await api.searchProviders(params);
      if (res.success) {
        setProviders(res.data || []);
      }
    } catch (err) {
      if (err.status === 403 || err.data?.isVerificationRequired) {
        setIsLocked(true);
      } else {
        setErrorMsg(err.message || 'Unable to retrieve verified provider directory.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [category, city]);

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!problemDescription) {
      alert('Please enter a brief description of the problem.');
      return;
    }

    try {
      setBookingLoading(true);
      const reqPayload = {
        providerId: bookingProvider._id,
        deviceCategory: category !== 'All Categories' ? category : bookingProvider.categories[0] || 'Appliance',
        brand,
        problemDescription,
        serviceDomain: bookingProvider.expertise[0] || 'General Repair',
        scheduledDate: scheduledDate || new Date(Date.now() + 86400000).toISOString(),
        serviceAddress: {
          street: serviceAddress,
          city: bookingProvider.location?.city || 'Bangalore'
        },
        estimatedCost: 500
      };

      const res = await api.createServiceRequest(reqPayload);
      if (res.success) {
        setBookingSuccess(`Service request #${res.data.requestNumber} booked successfully!`);
        setTimeout(() => {
          setBookingProvider(null);
          setBookingSuccess('');
          onNavigate('requests');
        }, 1500);
      }
    } catch (err) {
      alert(err.message || 'Failed to create service booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Rule #12: Locked state if unapproved
  if (isLocked || !isCustomerApproved) {
    return (
      <div className="page-container" style={{ maxWidth: '700px', textAlign: 'center', padding: '60px 20px' }}>
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: '#FEF2F2',
            color: '#DC2626',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px',
            boxShadow: '0 4px 14px rgba(220, 38, 38, 0.2)'
          }}
        >
          <Lock size={32} />
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', marginBottom: '8px' }}>
          Provider Directory & Booking Locked
        </h2>
        <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.6', marginBottom: '26px' }}>
          In accordance with Fixora's safety architecture, customers must complete Aadhaar identity verification and receive administrator approval before gaining access to the verified technician directory.
        </p>

        <div style={{ padding: '18px 22px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '26px', textAlign: 'left', fontSize: '14px' }}>
          <div style={{ fontWeight: '700', color: '#0F172A', marginBottom: '4px' }}>
            Current Status: {profile?.adminApprovalStatus || 'NOT_SUBMITTED'}
          </div>
          <div style={{ color: '#64748B', fontSize: '13px' }}>
            {profile?.adminApprovalStatus === 'PENDING'
              ? 'Your Aadhaar document is in the admin review queue. You will receive an in-app notification and email once approved.'
              : 'Please upload your Aadhaar credentials from the verification tab.'}
          </div>
        </div>

        <button
          onClick={() => onNavigate('verification')}
          className="btn btn-primary"
          style={{ padding: '12px 26px', fontSize: '15px' }}
        >
          Go to Aadhaar Verification <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header and Filter Controls */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <ShieldCheck size={20} color="#10B981" />
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#047857', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Verified & Background Checked Directory
          </span>
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.8px' }}>
          Find Verified Service Experts
        </h1>
        <p style={{ color: '#64748B', fontSize: '14px' }}>
          Ranked by Domain Expertise (50%), Nearby Availability (30%), and Customer Ratings (20%).
        </p>
      </div>

      {/* Filter Bar */}
      <div
        className="card"
        style={{
          padding: '18px 22px',
          borderRadius: '18px',
          marginBottom: '26px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ flex: '1', minWidth: '220px' }}>
          <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
            Appliance Category
          </label>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1', minWidth: '180px' }}>
          <label className="form-label" style={{ fontSize: '11px', textTransform: 'uppercase' }}>
            City / Area
          </label>
          <input
            type="text"
            className="form-input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Bangalore"
          />
        </div>

        <div style={{ alignSelf: 'flex-end' }}>
          <button onClick={fetchProviders} className="btn btn-secondary btn-sm" style={{ padding: '11px 18px' }}>
            <Search size={14} /> Refresh Search
          </button>
        </div>
      </div>

      {/* Provider Results List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
          Matching certified providers...
        </div>
      ) : errorMsg ? (
        <div className="alert alert-danger">{errorMsg}</div>
      ) : providers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px', borderRadius: '20px' }}>
          <ShieldCheck size={42} color="#94A3B8" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
            No verified service providers found
          </h3>
          <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '420px', margin: '6px auto 16px auto' }}>
            No technicians matching this category or location have passed administrative biometric & document verification yet.
          </p>
          <button onClick={() => { setCategory('All Categories'); setCity(''); }} className="btn btn-secondary btn-sm">
            Clear Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {providers.map((p) => (
            <div
              key={p._id}
              className="card"
              style={{
                borderRadius: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '24px',
                flexWrap: 'wrap',
                padding: '24px 28px'
              }}
            >
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #4F46E5, #3730A3)',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: '900',
                    flexShrink: 0,
                    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)'
                  }}
                >
                  {p.name.charAt(0)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#0F172A' }}>
                      {p.name}
                    </h3>
                    <span className="badge badge-verified">
                      <CheckCircle size={11} /> Verified
                    </span>
                    {p.isNew && (
                      <span className="badge badge-new">
                        🆕 NEW
                      </span>
                    )}
                    <span className="badge badge-info" style={{ fontWeight: '700' }}>
                      Match Score: {p.matchScore}%
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: '#475569', marginBottom: '10px', maxWidth: '620px', lineHeight: '1.4' }}>
                    {p.bio || 'Certified appliance and electronics technician.'}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', fontSize: '13px', color: '#64748B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={14} color="#64748B" />
                      <span>{p.location?.city || 'Local Hub'} ({p.serviceArea?.join(', ') || 'Metropolitan'})</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} color="#64748B" />
                      <span>{p.experienceYears} Years Exp · {p.completedServicesCount} Jobs Completed</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Star size={14} color={p.rating > 0 ? '#F59E0B' : '#94A3B8'} fill={p.rating > 0 ? '#F59E0B' : 'none'} />
                      <span style={{ fontWeight: '700', color: '#0F172A' }}>
                        {p.rating > 0 ? `${p.rating} / 5 (${p.reviewCount} reviews)` : 'NEW · No reviews yet'}
                      </span>
                    </div>
                  </div>

                  {/* Expertise Tags */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>
                    {p.categories?.map((c) => (
                      <span
                        key={c}
                        style={{
                          fontSize: '11px',
                          background: '#EEF2FF',
                          color: '#4338CA',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontWeight: '700'
                        }}
                      >
                        {c}
                      </span>
                    ))}
                    {p.expertise?.map((e) => (
                      <span
                        key={e}
                        style={{
                          fontSize: '11px',
                          background: '#F1F5F9',
                          color: '#475569',
                          padding: '4px 10px',
                          borderRadius: '8px'
                        }}
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <button
                  onClick={() => setBookingProvider(p)}
                  className="btn btn-primary"
                  style={{ padding: '12px 22px', fontSize: '14px' }}
                >
                  Book Service Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Request Booking Modal */}
      {bookingProvider && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#0F172A' }}>
                  Request Service with {bookingProvider.name}
                </h3>
                <span style={{ fontSize: '13px', color: '#64748B' }}>
                  Verified Specialist · {bookingProvider.location?.city}
                </span>
              </div>
              <button
                onClick={() => setBookingProvider(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="alert alert-success">{bookingSuccess}</div>
            ) : (
              <form onSubmit={handleCreateBooking}>
                <div className="form-group">
                  <label className="form-label">Device Brand / Make</label>
                  <input
                    type="text"
                    className="form-input"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Voltas 1.5 Ton, Sony Bravia, Dell"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Problem Summary *</label>
                  <textarea
                    className="form-textarea"
                    style={{ minHeight: '80px' }}
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="Describe issue (e.g. AC leaking water from indoor casing onto wall)..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Service Visit Address *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={serviceAddress}
                    onChange={(e) => setServiceAddress(e.target.value)}
                    placeholder="Flat/House number, Street name, Locality"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                  <button
                    type="button"
                    onClick={() => setBookingProvider(null)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? 'Confirming...' : 'Confirm Service Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
