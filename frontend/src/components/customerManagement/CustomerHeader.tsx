import React from 'react';

interface CustomerHeaderProps {
    onRefresh: () => void;
    isLoading: boolean;
}

const CustomerHeader: React.FC<CustomerHeaderProps> = ({ onRefresh, isLoading }) => (
    <div className="page-header">
        <div className="header-content">
            <div className="header-title">
                <span className="header-icon">👤</span>
                <h1>Manajemen Nasabah</h1>
            </div>
            <p className="header-subtitle">
                Kelola data nasabah Bank Dika untuk keperluan layanan perbankan.
            </p>
        </div>
        <div className="header-actions">
            <button
                className="btn btn-secondary"
                onClick={onRefresh}
                disabled={isLoading}
            >
                <span className={`btn-icon ${isLoading ? 'spinning' : ''}`}>🔄</span>
                {isLoading ? "Memuat..." : "Refresh"}
            </button>
        </div>
    </div>
);

export default CustomerHeader;