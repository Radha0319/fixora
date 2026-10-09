// UI: Administrator Platform Overview and System Metrics
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import {
  Users,
  Briefcase,
  ShieldCheck,
  CalendarCheck,
  Clock,
  ArrowRight,
  Cpu,
  Sparkles,
  Lock,
  Layers,
  ChevronRight,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const AdminDashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.getAdminStats();
        if (res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="page-container">
      {/* Top Banner (Dash Style) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '9999px', background: 'rgba(79, 70, 229, 0.08)', color: '#4F46E5', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>
            <ShieldCheck size={14} /> System Governance & Oversight
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
            Administrator Command Center
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>
            Enforce safety compliance, audit customer Aadhaar submissions, and authorize certified service technicians.
          </p>
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', borderRadius: '9999px', background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', fontWeight: '700', fontSize: '13px' }}>
          <CheckCircle size={15} color="#10B981" /> Strict Verification Mode Enforced
        </div>
      </div>

      {/* Primary KPI Grid (Dash Colorful Metric Banners) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {/* KPI 1: Customers */}
        <div className="project-banner-card banner-indigo">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Customers
              </div>
              <div style={{ fontSize: '34px', fontWeight: '800', marginTop: '4px' }}>
                {loading ? '...' : stats?.totalCustomers || 0}
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color="#FFFFFF" />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.85)' }}>
            Registered platform service consumers
          </div>
        </div>

        {/* KPI 2: Providers */}
        <div className="project-banner-card banner-teal">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Service Providers
              </div>
              <div style={{ fontSize: '34px', fontWeight: '800', marginTop: '4px' }}>
                {loading ? '...' : stats?.totalProviders || 0}
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={20} color="#FFFFFF" />
            </div>
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.85)' }}>
            Certified technicians & repair workshops
          </div>
        </div>

        {/* KPI 3: Customer Verifications Pending */}
        <div className="project-banner-card banner-coral">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Customer Aadhaar Queue
              </div>
              <div style={{ fontSize: '34px', fontWeight: '800', marginTop: '4px' }}>
                {loading ? '...' : stats?.pendingCustomerVerifications || 0}
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} color="#FFFFFF" />
            </div>
          </div>
          <div
            onClick={() => onNavigate('customer-reviews')}
            style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', background: 'rgba(255, 255, 255, 0.2)', padding: '5px 12px', borderRadius: '9999px', width: 'fit-content' }}
          >
            Review Queue <ArrowRight size={12} />
          </div>
        </div>

        {/* KPI 4: Provider Verifications Pending */}
        <div className="project-banner-card banner-purple">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'rgba(255, 255, 255, 0.8)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Provider Credential Queue
              </div>
              <div style={{ fontSize: '34px', fontWeight: '800', marginTop: '4px' }}>
                {loading ? '...' : stats?.pendingProviderVerifications || 0}
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} color="#FFFFFF" />
            </div>
          </div>
          <div
            onClick={() => onNavigate('provider-reviews')}
            style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', background: 'rgba(255, 255, 255, 0.2)', padding: '5px 12px', borderRadius: '9999px', width: 'fit-content' }}
          >
            Inspect Proof <ArrowRight size={12} />
          </div>
        </div>
      </div>

      {/* Review Queue Actions Cards (Notch & Dash layout) */}
      <div className="grid-cols-2" style={{ gap: '24px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '28px', background: 'rgba(255, 255, 255, 0.95)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
                Customer Aadhaar Verifications
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B' }}>
                Inspect uploaded IDs and automated preliminary validation flags
              </p>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#475569', marginBottom: '20px', lineHeight: '1.5' }}>
            Under Fixora safety rules, customers cannot browse verified technicians or book repairs until an administrator reviews and approves their Aadhaar submission.
          </p>
          <button
            onClick={() => onNavigate('customer-reviews')}
            className="btn btn-primary btn-sm"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
          >
            Review Customer Submissions <ArrowRight size={14} />
          </button>
        </div>

        <div className="card" style={{ padding: '28px', background: 'rgba(255, 255, 255, 0.95)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
            <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#F0FDFA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0D9488' }}>
              <Briefcase size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
                Provider Biometric & Trade Credentials
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B' }}>
                Inspect camera liveness captures and technical trade diplomas
              </p>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#475569', marginBottom: '20px', lineHeight: '1.5' }}>
            Providers are strictly hidden from search listings until Face Registration + Credentials + Admin Approval are fully cleared.
          </p>
          <button
            onClick={() => onNavigate('provider-reviews')}
            className="btn btn-primary btn-sm"
            style={{ background: 'linear-gradient(135deg, #0D9488, #059669)', borderColor: '#0D9488' }}
          >
            Review Provider Credentials <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
