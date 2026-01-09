import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ toast, removeToast }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            removeToast(toast.id);
        }, 4000);

        return () => clearTimeout(timer);
    }, [toast.id, removeToast]);

    const icons = {
        success: <CheckCircle size={20} color="#22c55e" />,
        error: <AlertCircle size={20} color="#ef4444" />,
        info: <Info size={20} color="#3b82f6" />,
    };

    const borderColors = {
        success: '#22c55e',
        error: '#ef4444',
        info: '#3b82f6',
    };

    return (
        <div
            className="animate-slide-up"
            style={{
                background: 'white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '300px',
                maxWidth: '400px',
                borderLeft: `4px solid ${borderColors[toast.type] || borderColors.info}`,
                pointerEvents: 'auto',
            }}
        >
            <div style={{ flexShrink: 0 }}>{icons[toast.type] || icons.info}</div>
            <div style={{ flex: 1, fontSize: '0.9rem', color: '#1f2937' }}>{toast.message}</div>
            <button
                onClick={() => removeToast(toast.id)}
                style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default Toast;
