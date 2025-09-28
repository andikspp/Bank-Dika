import React, { useState } from "react";
import axios from "axios";
import "../../../styles/depositManagementPage.css";
import Swal from "sweetalert2";

const DepositManagementPage: React.FC = () => {
    const [accountNumber, setAccountNumber] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (amount <= 0) {
            Swal.fire({
                title: 'Peringatan!',
                text: 'Jumlah setoran harus lebih dari Rp 0',
                icon: 'warning',
                confirmButtonColor: '#f59e0b'
            });
            return;
        }

        // Konfirmasi sebelum melakukan transaksi
        const confirmation = await Swal.fire({
            title: '💰 Konfirmasi Setor Tunai',
            html: `
                <div class="confirmation-detail">
                    <div class="confirmation-item">
                        <span class="label">No. Rekening:</span>
                        <span class="value">${accountNumber}</span>
                    </div>
                    <div class="confirmation-item">
                        <span class="label">Jumlah Setoran:</span>
                        <span class="value amount">Rp ${amount.toLocaleString('id-ID')}</span>
                    </div>
                    <div class="confirmation-note">
                        <small>⚠️ Pastikan data sudah benar sebelum melanjutkan</small>
                    </div>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '✅ Ya, Setor Sekarang',
            cancelButtonText: '❌ Batal',
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            customClass: {
                popup: 'deposit-confirmation-popup'
            }
        });

        if (!confirmation.isConfirmed) return;

        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            await axios.post(`http://localhost:8080/api/accounts/deposit/${accountNumber}`, {
                amount
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Success notification
            await Swal.fire({
                title: '🎉 Berhasil!',
                text: 'Setor tunai telah berhasil diproses',
                icon: 'success',
                confirmButtonColor: '#10b981',
                timer: 3000,
                timerProgressBar: true
            });

            // Reset form
            setAccountNumber("");
            setAmount(0);

        } catch (err: any) {
            Swal.fire({
                title: '❌ Gagal!',
                text: err.response?.data?.message || 'Terjadi kesalahan saat memproses setoran',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="deposit-page">
            <div className="deposit-container">
                {/* Header Section */}
                <div className="deposit-header">
                    <div className="header-icon">💰</div>
                    <h1 className="header-title">Setor Tunai</h1>
                    <p className="header-subtitle">Lakukan penyetoran tunai dengan mudah dan aman</p>
                </div>

                {/* Form Section */}
                <div className="deposit-form-container">
                    <form className="deposit-form" onSubmit={handleSubmit}>
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
                        </div>

                        <div className="form-group">
                            <label htmlFor="amount" className="form-label">
                                <span className="label-icon">💵</span>
                                Jumlah Setoran
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
                                        placeholder="0"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="input-border"></div>
                            </div>
                            {amount > 0 && (
                                <div className="amount-preview">
                                    <span className="preview-text">
                                        💰 {amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                                    </span>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={`submit-btn ${loading ? 'loading' : ''}`}
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
                                    <span>Setor Sekarang</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DepositManagementPage;