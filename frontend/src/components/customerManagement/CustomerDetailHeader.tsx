import React from 'react';

interface CustomerDetailHeaderProps {
    customerName?: string;
    onBack: () => void;
    onRefresh: () => void;
}

const CustomerDetailHeader: React.FC<CustomerDetailHeaderProps> = ({
    customerName,
    onBack,
    onRefresh
}) => (
    <div className="page-header">
        <button className="back-btn" onClick={onBack}>
            ← Kembali
        </button>
        <div className="header-content">
            <h1>👤 Detail Nasabah</h1>
            <p>
                {customerName
                    ? `Informasi lengkap data nasabah - ${customerName}`
                    : "Informasi lengkap data nasabah"
                }
            </p>
        </div>
        <div className="header-actions">
            <button className="btn btn-secondary" onClick={onRefresh}>
                <span className="btn-icon">🔄</span>
                Refresh
            </button>
        </div>
    </div>
);

export default CustomerDetailHeader;