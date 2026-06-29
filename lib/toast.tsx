'use client';

import { createRoot } from 'react-dom/client';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  const colors = {
    success: { bg: '#e8f5e9', border: '#2e7d32', text: '#2e7d32' },
    error: { bg: '#ffebee', border: '#c62828', text: '#c62828' },
    info: { bg: '#e3f2fd', border: '#1976d2', text: '#1976d2' },
  };

  const style = colors[type];

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        padding: '16px 24px',
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: '8px',
        color: style.text,
        fontSize: '14px',
        fontWeight: 500,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        maxWidth: '400px',
        animation: 'slideIn 0.3s ease',
      }}
    >
      <span>{type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: style.text,
          cursor: 'pointer',
          fontSize: '18px',
          padding: '0 0 0 8px',
          opacity: 0.6,
        }}
      >
        ×
      </button>
    </div>
  );
}

let toastContainer: HTMLDivElement | null = null;

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    document.body.appendChild(toastContainer);
  }

  const root = createRoot(toastContainer);
  
  root.render(
    <Toast
      message={message}
      type={type}
      onClose={() => {
        setTimeout(() => {
          root.unmount();
          if (toastContainer && document.body.contains(toastContainer)) {
            document.body.removeChild(toastContainer);
          }
          toastContainer = null;
        }, 300);
      }}
    />
  );

  // Автозакрытие через 3 секунды
  setTimeout(() => {
    if (toastContainer) {
      root.unmount();
      if (document.body.contains(toastContainer)) {
        document.body.removeChild(toastContainer);
      }
      toastContainer = null;
    }
  }, 3000);
}