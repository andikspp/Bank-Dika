import React from 'react';
import '../../styles/errorMessage.css';

interface ErrorMessageProps {
    message: string;
    title?: string;
    variant?: 'danger' | 'warning' | 'info';
    showIcon?: boolean;
    onRetry?: () => void;
    onDismiss?: () => void;
    retryText?: string;
    secondaryActionText?: string;
    onSecondaryAction?: () => void;
    className?: string;
    fullWidth?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
    message,
    title,
    variant = 'danger',
    showIcon = true,
    onRetry,
    onDismiss,
    retryText = 'Coba Lagi',
    className = '',
    fullWidth = false
}) => {
    const getIcon = () => {
        switch (variant) {
            case 'danger':
                return '⚠️';
            case 'warning':
                return '⚡';
            case 'info':
                return 'ℹ️';
            default:
                return '⚠️';
        }
    };

    const containerClasses = [
        'error-message',
        `error-${variant}`,
        fullWidth ? 'error-full-width' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClasses} role="alert">
            <div className="error-content">
                {showIcon && (
                    <div className="error-icon">
                        {getIcon()}
                    </div>
                )}

                <div className="error-text">
                    {title && (
                        <h4 className="error-title">{title}</h4>
                    )}
                    <p className="error-description">{message}</p>
                </div>

                {onDismiss && (
                    <button
                        className="error-dismiss"
                        onClick={onDismiss}
                        aria-label="Tutup pesan error"
                    >
                        ✕
                    </button>
                )}
            </div>

            {onRetry && (
                <div className="error-actions">
                    <button
                        className="error-retry-btn"
                        onClick={onRetry}
                    >
                        🔄 {retryText}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ErrorMessage;