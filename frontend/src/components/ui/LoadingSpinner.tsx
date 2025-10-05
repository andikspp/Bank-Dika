import React from 'react';
import '../../styles/loadingSpinner.css';

interface LoadingSpinnerProps {
    message?: string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'primary' | 'secondary' | 'white';
    fullScreen?: boolean;
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message = 'Memuat...',
    size = 'medium',
    variant = 'primary',
    fullScreen = false,
    className = ''
}) => {
    const spinnerClasses = [
        'loading-spinner',
        `spinner-${size}`,
        `spinner-${variant}`,
        className
    ].filter(Boolean).join(' ');

    const containerClasses = [
        'loading-container',
        fullScreen ? 'loading-fullscreen' : ''
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            <div className="loading-content">
                <div className={spinnerClasses}>
                    <div className="spinner-circle"></div>
                </div>
                {message && (
                    <p className="loading-message">{message}</p>
                )}
            </div>
        </div>
    );
};

export default LoadingSpinner;