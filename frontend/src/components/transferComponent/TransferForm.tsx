import React from 'react';
import { TransferFormData, AccountInfo } from '../../types/Transfer';
import { formatCurrency } from '../../utils/formatters';

interface TransferFormProps {
    formData: TransferFormData;
    onFormDataChange: (field: keyof TransferFormData, value: string | number) => void;
    fromAccountInfo: AccountInfo | null;
    toAccountInfo: AccountInfo | null;
    loading: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

export const TransferForm: React.FC<TransferFormProps> = ({
    formData,
    onFormDataChange,
    fromAccountInfo,
    toAccountInfo,
    loading,
    onSubmit
}) => {
    return (
        <div className="transfer-form-container">
            <form className="transfer-form" onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="fromAccountNumber" className="form-label">
                        <span className="label-icon">📤</span>
                        Rekening Pengirim
                    </label>
                    <div className="input-container">
                        <input
                            id="fromAccountNumber"
                            type="text"
                            className="form-input"
                            value={formData.fromAccountNumber}
                            onChange={e => onFormDataChange('fromAccountNumber', e.target.value)}
                            required
                            placeholder="Masukkan nomor rekening pengirim"
                            disabled={loading}
                        />
                        <div className="input-border"></div>
                    </div>
                    {fromAccountInfo && (
                        <div className="account-info">
                            <span className="info-icon">👤</span>
                            <span className="info-text">
                                Atas Nama: <strong>{fromAccountInfo.customerName}</strong>
                            </span>
                        </div>
                    )}
                </div>

                {fromAccountInfo && fromAccountInfo.balance > 0 && (
                    <div className="balance-display">
                        <div className="balance-card">
                            <span className="balance-label">💰 Saldo Tersedia</span>
                            <span className="balance-amount">
                                {formatCurrency(fromAccountInfo.balance)}
                            </span>
                        </div>
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="toAccountNumber" className="form-label">
                        <span className="label-icon">📥</span>
                        Rekening Penerima
                    </label>
                    <div className="input-container">
                        <input
                            id="toAccountNumber"
                            type="text"
                            className="form-input"
                            value={formData.toAccountNumber}
                            onChange={e => onFormDataChange('toAccountNumber', e.target.value)}
                            required
                            placeholder="Masukkan nomor rekening penerima"
                            disabled={loading}
                        />
                        <div className="input-border"></div>
                    </div>
                    {toAccountInfo && (
                        <div className="account-info">
                            <span className="info-icon">👤</span>
                            <span className="info-text">
                                Atas Nama: <strong>{toAccountInfo.customerName}</strong>
                            </span>
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="amount" className="form-label">
                        <span className="label-icon">💵</span>
                        Jumlah Transfer
                    </label>
                    <div className="input-container">
                        <div className="currency-input">
                            <span className="currency-symbol">Rp</span>
                            <input
                                id="amount"
                                type="number"
                                className="form-input currency-field"
                                value={formData.amount || ""}
                                onChange={e => onFormDataChange('amount', Number(e.target.value))}
                                required
                                min={1}
                                max={fromAccountInfo?.balance || undefined}
                                placeholder="0"
                                disabled={loading}
                            />
                        </div>
                        <div className="input-border"></div>
                    </div>
                    {formData.amount > 0 && (
                        <div className="amount-preview">
                            <span className="preview-text">
                                💸 {formatCurrency(formData.amount)}
                            </span>
                            {fromAccountInfo && fromAccountInfo.balance > 0 && (
                                <span className="remaining-balance">
                                    Sisa: {formatCurrency(fromAccountInfo.balance - formData.amount)}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="transferType" className="form-label">
                        <span className="label-icon">🔄</span>
                        Tipe Transfer
                    </label>
                    <div className="input-container">
                        <select
                            id="transferType"
                            className="form-input"
                            value={formData.transferType}
                            onChange={e => onFormDataChange('transferType', e.target.value)}
                            disabled={loading}
                        >
                            <option value="internal">Internal (Antar Rekening Bank Sama)</option>
                            <option value="external">External (Ke Bank Lain)</option>
                        </select>
                        <div className="input-border"></div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="description" className="form-label">
                        <span className="label-icon">📝</span>
                        Deskripsi (Opsional)
                    </label>
                    <div className="input-container">
                        <textarea
                            id="description"
                            className="form-input"
                            value={formData.description}
                            onChange={e => onFormDataChange('description', e.target.value)}
                            placeholder="Masukkan deskripsi transfer (opsional)"
                            rows={3}
                            disabled={loading}
                        />
                        <div className="input-border"></div>
                    </div>
                </div>

                <button
                    type="submit"
                    className={`submit-btn transfer-btn ${loading ? 'loading' : ''}`}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <div className="loading-spinner"></div>
                            <span>Memproses...</span>
                        </>
                    ) : (
                        <>
                            <span className="btn-icon">🏦</span>
                            <span>Proses Transfer</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};