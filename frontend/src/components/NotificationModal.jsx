// NOTIFY: In-app Notification Drawer modal component
import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Bell, X, Check, Clock, ExternalLink, Sparkles, CheckCheck } from 'lucide-react';

export const NotificationModal = ({ isOpen, onClose, onNavigate }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.getNotifications();
      if (res.success) {
        setNotifications(res.data || []);
      }
    } catch (e) {
      console.warn('Failed to load notifications', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          maxWidth: '520px',
          padding: '28px'
        }}
      >
        <div className="modal-header" style={{ paddingBottom: '16px', borderBottom: '1px solid #F1F5F9', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
              <Bell size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A' }}>
                Notifications
              </h3>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Real-time verification & booking alerts</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleMarkAllRead}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '9999px' }}
            >
              <CheckCheck size={13} /> Mark read
            </button>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
              <div style={{ width: '30px', height: '30px', border: '3px solid #E2E8F0', borderTopColor: '#4F46E5', borderRadius: '50%', margin: '0 auto 12px auto', animation: 'spin 0.8s linear infinite' }} />
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="state-container" style={{ padding: '36px 20px', textAlign: 'center' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', color: '#94A3B8' }}>
                <Bell size={24} />
              </div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>No notifications yet</div>
              <div style={{ fontSize: '13px', color: '#64748B', maxWidth: '320px', margin: '4px auto 0 auto' }}>
                You'll receive live updates regarding verification approvals and service bookings here.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
              {notifications.map((item) => (
                <div
                  key={item._id}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '14px',
                    border: '1px solid',
                    borderColor: item.read ? '#E2E8F0' : '#C7D2FE',
                    background: item.read ? '#FFFFFF' : '#EEF2FF',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#0F172A', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {!item.read && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4F46E5' }} />}
                      {item.title}
                    </div>
                    <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.4' }}>
                      {item.message}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} /> {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {!item.read && (
                    <button
                      onClick={() => handleMarkRead(item._id)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '6px 10px', fontSize: '11px', borderRadius: '9999px', flexShrink: 0 }}
                      title="Mark as read"
                    >
                      <Check size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
