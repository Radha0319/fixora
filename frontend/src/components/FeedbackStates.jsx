// UI: Reusable Loading Spinner and Empty State feedback components
import React from 'react';
import { Inbox, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="state-container" style={{ padding: '40px 20px', textAlign: 'center' }}>
      <div
        style={{
          width: '38px',
          height: '38px',
          border: '3px solid #E2E8F0',
          borderTopColor: '#4F46E5',
          borderRadius: '50%',
          margin: '0 auto 14px auto',
          animation: 'spin 0.8s linear infinite'
        }}
      />
      <div style={{ fontSize: '14px', color: '#64748B', fontWeight: '600' }}>
        {message}
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There are no records matching your criteria at this time.',
  actionText,
  onAction
}) => {
  return (
    <div className="state-container" style={{ padding: '48px 24px', textAlign: 'center' }}>
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#EEF2FF',
          color: '#4F46E5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px auto'
        }}
      >
        <Icon size={26} />
      </div>
      <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>{title}</div>
      <div style={{ fontSize: '13px', color: '#64748B', maxWidth: '380px', margin: '0 auto 16px auto', lineHeight: '1.5' }}>{description}</div>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export const ErrorState = ({
  title = 'Unable to load content',
  message = 'An unexpected error occurred while communicating with the Fixora server.',
  onRetry
}) => {
  return (
    <div className="state-container" style={{ padding: '48px 24px', textAlign: 'center' }}>
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: '#FEF2F2',
          color: '#DC2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px auto'
        }}
      >
        <AlertCircle size={26} />
      </div>
      <div style={{ fontSize: '18px', fontWeight: '800', color: '#991B1B', marginBottom: '6px' }}>{title}</div>
      <div style={{ fontSize: '13px', color: '#64748B', maxWidth: '380px', margin: '0 auto 16px auto', lineHeight: '1.5' }}>{message}</div>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
          <RefreshCw size={14} /> Try Again
        </button>
      )}
    </div>
  );
};
