import React, { useState } from "react";
import axios from "axios";
import "../../../styles/withdrawalManagementPage.css";
import Swal from "sweetalert2";

const WithdrawalManagementPage: React.FC = () => {
    const [accountNumber, setAccountNumber] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [accountName, setAccountName] = useState("");
    const [currentBalance, setCurrentBalance] = useState<number>(0);
    const [statusAccount, setStatusAccount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (amount <= 0) {
            Swal.fire({
                title: 'Peringatan!',
                text: 'Jumlah penarikan harus lebih dari Rp 0',
                icon: 'warning',
                confirmButtonColor: '#f59e0b'
            });
            return;
        }

        let accountOwner = "";
        let balance = 0;
        let status = "";

        // Cari informasi rekening berdasarkan nomor rekening
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:8080/api/accounts/search`, {
                params: { accountNumber },
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.length === 0) {
                Swal.fire({
                    title: '❌ Gagal!',
                    text: 'Rekening tidak ditemukan. Silakan periksa kembali nomor rekening.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
                return;
            }

            accountOwner = response.data[0].customerName;
            balance = response.data[0].balance;
            status = response.data[0].status;

            // lakukan konversi nama status dari "ACTIVE" menjadi "Aktif", "INACTIVE" menjadi "Tidak Aktif"
            if (status === "ACTIVE") {
                status = "Aktif";
            } else if (status === "INACTIVE") {
                status = "Tidak Aktif";
            }

            setAccountName(accountOwner);
            setCurrentBalance(balance);
            setStatusAccount(status);

            // Cek apakah saldo mencukupi
            if (amount > balance) {
                Swal.fire({
                    title: '❌ Saldo Tidak Mencukupi!',
                    html: `
                        <div class="balance-warning">
                            <div class="balance-info">
                                <span class="label">Saldo Tersedia:</span>
                                <span class="value">${balance.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                            </div>
                            <div class="balance-info">
                                <span class="label">Jumlah Penarikan:</span>
                                <span class="value error">${amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                            </div>
                        </div>
                    `,
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
                return;
            }

        } catch (err) {
            Swal.fire({
                title: '❌ Gagal!',
                text: 'Terjadi kesalahan saat mencari rekening',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
            return;
        }

        // Konfirmasi sebelum melakukan penarikan
        const confirmation = await Swal.fire({
            title: '💸 Konfirmasi Penarikan Tunai',
            html: `
                <div class="confirmation-detail">
                    <div class="confirmation-item">
                        <span class="label">No. Rekening:</span>
                        <span class="value">${accountNumber}</span>
                    </div>
                    <div class="confirmation-item">
                        <span class="label">Atas Nama:</span>
                        <span class="value">${accountOwner}</span>
                    </div>
                    <div class="confirmation-item">
                        <span class="label">Status Rekening:</span>
                        <span class="value">${status}</span>
                    </div>
                    <div class="confirmation-item">
                        <span class="label">Saldo Saat Ini:</span>
                        <span class="value balance">${balance.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                    </div>
                    <div class="confirmation-item">
                        <span class="label">Jumlah Penarikan:</span>
                        <span class="value amount">${amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                    </div>
                    <div class="confirmation-item final-balance">
                        <span class="label">Saldo Setelah Penarikan:</span>
                        <span class="value">${(balance - amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                    </div>
                    <div class="confirmation-note">
                        <small>⚠️ Pastikan nasabah membawa identitas yang valid</small>
                    </div>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '✅ Ya, Tarik Sekarang',
            cancelButtonText: '❌ Batal',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            customClass: {
                popup: 'withdrawal-confirmation-popup'
            }
        });

        if (!confirmation.isConfirmed) return;

        setLoading(true);

        try {
            // Cek status rekening, hanya boleh setor jika status "Aktif"
            if (status !== "Aktif") {
                Swal.fire({
                    title: '❌ Gagal!',
                    text: 'Rekening tidak aktif. Tarik tunai hanya dapat dilakukan pada rekening yang aktif.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
                return;
            }

            const token = localStorage.getItem("token");
            await axios.post(`http://localhost:8080/api/accounts/withdraw/${accountNumber}`, {
                amount
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Success notification
            await Swal.fire({
                title: '🎉 Berhasil!',
                html: `
                    <div class="success-detail">
                        <p>Penarikan tunai telah berhasil diproses</p>
                        <div class="transaction-summary">
                            <div class="summary-item">
                                <span>Jumlah Ditarik:</span>
                                <span class="amount">${amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                            </div>
                            <div class="summary-item">
                                <span>Saldo Tersisa:</span>
                                <span>${(balance - amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                            </div>
                        </div>
                    </div>
                `,
                icon: 'success',
                confirmButtonColor: '#10b981',
                timer: 4000,
                timerProgressBar: true
            });

            // Reset form
            setAccountNumber("");
            setAmount(0);
            setAccountName("");
            setCurrentBalance(0);

        } catch (err: any) {
            Swal.fire({
                title: '❌ Gagal!',
                text: err.response?.data?.message || 'Terjadi kesalahan saat memproses penarikan',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="withdrawal-page">
            <div className="withdrawal-container">
                {/* Header Section */}
                <div className="withdrawal-header">
                    <div className="header-icon">💸</div>
                    <h1 className="header-title">Penarikan Tunai</h1>
                    <p className="header-subtitle">Proses penarikan tunai dengan verifikasi keamanan</p>
                </div>

                {/* Form Section */}
                <div className="withdrawal-form-container">
                    <form className="withdrawal-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="accountNumber" className="form-label">
                                <span className="label-icon">🏦</span>
                                Nomor Rekening
                            </label>
                            <div className="input-container">
                                <input
                                    id="accountNumber"
                                    type="text"
                                    className="form-input"
                                    value={accountNumber}
                                    onChange={e => setAccountNumber(e.target.value)}
                                    required
                                    placeholder="Masukkan nomor rekening"
                                    disabled={loading}
                                />
                                <div className="input-border"></div>
                            </div>
                            {accountName && (
                                <div className="account-info">
                                    <span className="info-icon">👤</span>
                                    <span className="info-text">Atas Nama: <strong>{accountName}</strong></span>
                                </div>
                            )}
                        </div>

                        {currentBalance > 0 && (
                            <div className="balance-display">
                                <div className="balance-card">
                                    <span className="balance-label">💰 Saldo Tersedia</span>
                                    <span className="balance-amount">
                                        {currentBalance.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="amount" className="form-label">
                                <span className="label-icon">💵</span>
                                Jumlah Penarikan
                            </label>
                            <div className="input-container">
                                <div className="currency-input">
                                    <span className="currency-symbol">Rp</span>
                                    <input
                                        id="amount"
                                        type="number"
                                        className="form-input currency-field"
                                        value={amount || ""}
                                        onChange={e => setAmount(Number(e.target.value))}
                                        required
                                        min={1}
                                        max={currentBalance || undefined}
                                        placeholder="0"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="input-border"></div>
                            </div>
                            {amount > 0 && (
                                <div className="amount-preview">
                                    <span className="preview-text">
                                        💸 {amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                    </span>
                                    {currentBalance > 0 && (
                                        <span className="remaining-balance">
                                            Sisa: {(currentBalance - amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={`submit-btn withdrawal-btn ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div className="loading-spinner"></div>
                                    <span>Memproses...</span>
                                </>
                            ) : (
                                <>
                                    <span className="btn-icon">💸</span>
                                    <span>Tarik Tunai</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Security Notice */}
                <div className="security-notice">
                    <div className="notice-header">
                        <span className="security-icon">🔐</span>
                        <h3>Protokol Keamanan</h3>
                    </div>
                    <ul className="security-list">
                        <li>✓ Verifikasi identitas nasabah (KTP/SIM)</li>
                        <li>✓ Pastikan tanda tangan sesuai</li>
                        <li>✓ Catat nomor transaksi</li>
                        <li>✓ Hitung uang di depan nasabah</li>
                    </ul>
                </div>

                {/* Quick Amount Buttons */}
                {/* <div className="quick-amounts">
                    <h4>Nominal Cepat</h4>
                    <div className="quick-buttons">
                        {[100000, 200000, 500000, 1000000].map(quickAmount => (
                            <button
                                key={quickAmount}
                                type="button"
                                className="quick-btn"
                                onClick={() => setAmount(quickAmount)}
                                disabled={loading || quickAmount > currentBalance}
                            >
                                {quickAmount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                            </button>
                        ))}
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default WithdrawalManagementPage;