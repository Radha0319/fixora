// DB: Administrator 11 Device Categories and Safety Knowledge Base viewer
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { Cpu, AlertTriangle, ShieldCheck, CheckCircle, Sparkles, Layers, Tv, Wifi, Laptop, Smartphone, Speaker, Disc, Wind, Printer } from 'lucide-react';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.getCategories();
        if (res.success) {
          setCategories(res.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="page-container">
      {/* Top Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '9999px', background: 'rgba(79, 70, 229, 0.08)', color: '#4F46E5', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>
          <Layers size={14} /> Appliance Taxonomy
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
          Configured Device Categories & Safety Rules
        </h1>
        <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>
          The platform explicitly supports 11 standardized appliance and consumer electronics categories with safety-first diagnostic boundaries.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: '#4F46E5', borderRadius: '50%', margin: '0 auto 16px auto', animation: 'spin 0.8s linear infinite' }} />
          Loading category definitions...
        </div>
      ) : (
        <div className="grid-cols-2" style={{ gap: '20px' }}>
          {categories.map((c, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                padding: '24px',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #E2E8F0',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', flexShrink: 0 }}>
                  <Cpu size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A' }}>
                    {c.name}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={12} /> Active in Safety Knowledge Base
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', lineHeight: '1.4' }}>
                {c.description || 'Configured consumer device category with dedicated troubleshooting and technician mapping.'}
              </p>

              {c.commonProblems && c.commonProblems.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                    Standard Problem Classifications ({c.commonProblems.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {c.commonProblems.map((p, pIdx) => (
                      <div
                        key={pIdx}
                        style={{
                          fontSize: '12px',
                          color: '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: '#F8FAFC',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid #E2E8F0'
                        }}
                      >
                        <span style={{ fontWeight: '600' }}>{p.problemName}</span>
                        {p.isHighRisk ? (
                          <span style={{ fontSize: '11px', color: '#B91C1C', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', background: '#FEE2E2', padding: '2px 8px', borderRadius: '9999px' }}>
                            <AlertTriangle size={11} /> High Risk · Mandatory Escalation
                          </span>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#047857', fontWeight: '600', background: '#ECFDF5', padding: '2px 8px', borderRadius: '9999px' }}>
                            Self-Troubleshootable
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
