import React from "react";
import { Account } from "../../../types/Account";
import "../../../styles/modal.css";

interface AccountDetailModalProps {
    open: boolean;
    account: Account | null;
    onClose: () => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(amount);
};

const AccountDetailModal: React.FC<AccountDetailModalProps> = ({ open, account, onClose }) => {
    if (!open || !account) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>💳 Detail Rekening</h3>
                    <button className="close-btn" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="modal-body" style={{ padding: "24px" }}>
                    <div className="detail-grid">
                        <div className="detail-item">
                            <label className="detail-label">Nomor Rekening</label>
                            <div className="detail-value account-number">
                                {account.accountNumber}
                            </div>
                        </div>

                        <div className="detail-item">
                            <label className="detail-label">Jenis Rekening</label>
                            <div className="detail-value">
                                <span className="account-type-badge">
                                    {account.accountType === "SAVINGS" ? "💰 Tabungan" : "🏦 Giro"}
                                </span>
                            </div>
                        </div>

                        <div className="detail-item">
                            <label className="detail-label">Saldo</label>
                            <div className="detail-value balance-amount">
                                {formatCurrency(account.balance)}
                            </div>
                        </div>

                        <div className="detail-item">
                            <label className="detail-label">Status</label>
                            <div className="detail-value">
                                <span className={`status-badge ${account.status.toLowerCase()}`}>
                                    <span className="status-dot"></span>
                                    {account.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
                                </span>
                            </div>
                        </div>

                        <div className="detail-item">
                            <label className="detail-label">Tanggal Dibuat</label>
                            <div className="detail-value">
                                {new Date(account.openedDate).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button className="btn btn-secondary btn-close-modal" onClick={onClose}>
                        <span className="btn-icon">🚪</span>
                        <span className="btn-text">Tutup</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountDetailModal;