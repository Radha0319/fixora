// DB: Administrator Service Requests audit panel
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { CalendarCheck, Search, CheckCircle, Clock, FileSpreadsheet, Sparkles, Filter } from 'lucide-react';

export const AdminRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await api.getMyServiceRequests();
        if (res.success) {
          setRequests(res.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const filtered = requests.filter((r) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (r.requestNumber && r.requestNumber.toLowerCase().includes(term)) ||
      (r.deviceCategory && r.deviceCategory.toLowerCase().includes(term)) ||
      (r.customer?.name && r.customer.name.toLowerCase().includes(term)) ||
      (r.provider?.name && r.provider.name.toLowerCase().includes(term)) ||
      (r.status && r.status.toLowerCase().includes(term))
    );
  });

  return (
    <div className="page-container">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '9999px', background: 'rgba(79, 70, 229, 0.08)', color: '#4F46E5', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>
            <FileSpreadsheet size={14} /> Platform Transaction Ledger
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
            Service Bookings & Platform Audit
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>
            Real-time end-to-end ledger of all customer repair requests, provider assignments, and lifecycle transitions.
          </p>
        </div>

        {/* Capsule Search Bar */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter requests..."
            style={{ paddingLeft: '38px', borderRadius: '9999px', fontSize: '13px', background: '#FFFFFF' }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #E2E8F0', borderTopColor: '#4F46E5', borderRadius: '50%', margin: '0 auto 16px auto', animation: 'spin 0.8s linear infinite' }} />
          Loading platform booking ledger...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255, 255, 255, 0.95)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#4F46E5' }}>
            <CalendarCheck size={32} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
            No service requests found
          </h3>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
            Active customer repair requests will automatically appear in this audit ledger.
          </p>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden', background: 'rgba(255, 255, 255, 0.95)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
              <tr>
                <th style={{ padding: '14px 18px', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ref #</th>
                <th style={{ padding: '14px 18px', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer</th>
                <th style={{ padding: '14px 18px', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Technician</th>
                <th style={{ padding: '14px 18px', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Device / Domain</th>
                <th style={{ padding: '14px 18px', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                <th style={{ padding: '14px 18px', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r._id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.15s ease' }}>
                  <td style={{ padding: '14px 18px', fontWeight: '800', color: '#4F46E5' }}>
                    #{r.requestNumber}
                  </td>
                  <td style={{ padding: '14px 18px', fontWeight: '700', color: '#0F172A' }}>
                    {r.customer?.name || 'Customer'}
                  </td>
                  <td style={{ padding: '14px 18px', color: '#334155' }}>
                    {r.provider?.name || 'Assigned Expert'}
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ fontWeight: '600', color: '#0F172A' }}>{r.deviceCategory}</span>
                    <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>{r.serviceDomain}</span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span className={`badge badge-${r.status === 'COMPLETED' ? 'verified' : r.status === 'PENDING' ? 'pending' : r.status === 'REJECTED' || r.status === 'CANCELLED' ? 'danger' : 'info'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', color: '#64748B', fontSize: '12px' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
