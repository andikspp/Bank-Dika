import React from 'react';
import '../../styles/emptyState.css';

interface EmptyStateProps {
    icon?: string | React.ReactNode;
    title: string;
    description?: string;
    actionText?: string;
    onAction?: () => void;
    secondaryActionText?: string;
    onSecondaryAction?: () => void;
    variant?: 'default' | 'search' | 'error' | 'info';
    size?: 'small' | 'medium' | 'large';
    className?: string;
    children?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    actionText,
    onAction,
    secondaryActionText,
    onSecondaryAction,
    variant = 'default',
    size = 'medium',
    className = '',
    children
}) => {
    const getDefaultIcon = () => {
        switch (variant) {
            case 'search':
                return '🔍';
            case 'error':
                return '⚠️';
            case 'info':
                return 'ℹ️';
            default:
                return '📋';
        }
    };

    const containerClasses = [
        'empty-state',
        `empty-state-${variant}`,
        `empty-state-${size}`,
        className
    ].filter(Boolean).join(' ');

    const displayIcon = icon || getDefaultIcon();

    return (
        <div className={containerClasses}>
            <div className="empty-state-content">
                {displayIcon && (
                    <div className="empty-state-icon">
                        {typeof displayIcon === 'string' ? (
                            <span className="empty-state-emoji">{displayIcon}</span>
                        ) : (
                            displayIcon
                        )}
                    </div>
                )}

                <div className="empty-state-text">
                    <h3 className="empty-state-title">{title}</h3>
                    {description && (
                        <p className="empty-state-description">{description}</p>
                    )}
                </div>

                {children && (
                    <div className="empty-state-custom">
                        {children}
                    </div>
                )}

                {(onAction || onSecondaryAction) && (
                    <div className="empty-state-actions">
                        {onAction && actionText && (
                            <button
                                className="empty-state-primary-btn"
                                onClick={onAction}
                            >
                                {actionText}
                            </button>
                        )}
                        {onSecondaryAction && secondaryActionText && (
                            <button
                                className="empty-state-secondary-btn"
                                onClick={onSecondaryAction}
                            >
                                {secondaryActionText}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmptyState;