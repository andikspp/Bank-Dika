import React from "react";
import { Customer } from "../../types/Customer";
import { Account } from "../../types/Account";
import "../../styles/customerDetailCard.css";

interface CustomerDetailCardProps {
    customer: Customer;
    onAddAccount?: () => void;
    showAddAccountButton?: boolean;
    onDeleteAccount?: (accountId: number) => void;
    onToggleAccountStatus?: (accountId: number, currentStatus: string) => void;
    onShowAccountDetail?: (account: Account) => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(amount);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const CustomerDetailCard: React.FC<CustomerDetailCardProps> = ({
    customer,
    onAddAccount,
    showAddAccountButton = false,
    onDeleteAccount,
    onToggleAccountStatus,
    onShowAccountDetail,
}) => {
    return (
        <>
            {/* Customer Info Card */}
            <div className="info-card full-width">
                <div className="card-header">
                    <h3>👨‍💼 Data Customer</h3>
                </div>
                <div className="card-content">
                    <div className="info-item">
                        <span className="label">Nama Lengkap</span>
                        <span className="value">{customer.fullName}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Email</span>
                        <span className="value">{customer.email}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">No. Telepon</span>
                        <span className="value">{customer.phone || "-"}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">No. KTP</span>
                        <span className="value">{customer.ktpNumber}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Alamat</span>
                        <span className="value">{customer.address || "-"}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Tanggal Registrasi</span>
                        <span className="value">{formatDate(customer.registrationDate!)}</span>
                    </div>
                </div>
            </div>

            {/* Accounts Card */}
            <div className="info-card full-width">
                <div className="card-header">
                    <h3>💳 Rekening ({customer?.accounts?.length || 0})</h3>
                    {showAddAccountButton && onAddAccount && (
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={onAddAccount}
                        >
                            ➕ Tambah Rekening
                        </button>
                    )}
                </div>
                <div className="card-content">
                    {customer?.accounts && customer.accounts.length > 0 ? (
                        <div className="accounts-grid">
                            {customer.accounts.map((account) => (
                                <div key={account.id} className="account-card">
                                    <div className="account-header">
                                        <div className="account-type-wrapper">
                                            <span className="account-type">
                                                <span className="account-icon">
                                                    {account.accountType === 'SAVINGS' ? '💰' : '🏦'}
                                                </span>
                                                <span className="account-type-text">
                                                    {account.accountType === 'SAVINGS' ? 'Tabungan' : 'Giro'}
                                                </span>
                                            </span>
                                        </div>
                                        <span className={`status-badge ${account.status.toLowerCase()}`}>
                                            <span className="status-dot"></span>
                                            {account.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </div>

                                    <div className="account-details">
                                        <div className="account-number">
                                            <span className="account-number-label">No. Rekening</span>
                                            <span className="account-number-value">{account.accountNumber}</span>
                                        </div>
                                        <div className="account-balance">
                                            <span className="balance-label">Saldo</span>
                                            <span className="balance-value">{formatCurrency(account.balance)}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="account-actions">
                                        {/* Toggle Status Button */}
                                        {onToggleAccountStatus && (
                                            <button
                                                className={`btn btn-sm ${account.status === 'ACTIVE' ? 'btn-warning-outline' : 'btn-success-outline'}`}
                                                onClick={() => onToggleAccountStatus(account.id, account.status)}
                                                title={account.status === 'ACTIVE' ? 'Nonaktifkan Rekening' : 'Aktifkan Rekening'}
                                            >
                                                <span className="btn-icon">
                                                    {account.status === 'ACTIVE' ? '⏸️' : '▶️'}
                                                </span>
                                                <span className="btn-text">
                                                    {account.status === 'ACTIVE' ? 'Nonaktifkan' : 'Aktifkan'}
                                                </span>
                                            </button>
                                        )}

                                        {/* Detail Button */}
                                        {onShowAccountDetail && (
                                            <button
                                                className="btn btn-sm btn-info-outline"
                                                onClick={() => onShowAccountDetail(account)}
                                                title="Lihat Detail Rekening"
                                            >
                                                <span className="btn-icon">🔍</span>
                                                <span className="btn-text">Detail</span>
                                            </button>
                                        )}

                                        {/* Delete Button */}
                                        {onDeleteAccount && (
                                            <button
                                                className="btn btn-sm btn-danger-outline"
                                                onClick={() => onDeleteAccount(account.id)}
                                                title="Hapus Rekening"
                                            >
                                                <span className="btn-icon">🗑️</span>
                                                <span className="btn-text">Hapus</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-accounts">
                            <div className="empty-icon">💳</div>
                            <p>Belum ada rekening</p>
                            <small>Customer ini belum memiliki rekening bank</small>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CustomerDetailCard;