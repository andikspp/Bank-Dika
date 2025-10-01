import React, { useState, useEffect } from 'react';
import axios from "axios";
import "../../../styles/transferManagementPage.css";
import Swal from "sweetalert2";
import {
    ArrowRightLeft,
    Search,
    Filter,
    Download,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Send,
    Wallet,
    CreditCard,
    Building,
    User,
    Calendar,
    DollarSign
} from 'lucide-react';

interface Transfer {
    id: string;
    fromAccount: string;
    toAccount: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
    date: string;
    type: 'internal' | 'external';
    reference: string;
    description: string;
}

const TransferManagementPage: React.FC = () => {
    const [fromAccountNumber, setFromAccountNumber] = useState("");
    const [toAccountNumber, setToAccountNumber] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [description, setDescription] = useState("");
    const [transferType, setTransferType] = useState("internal");

    const [fromAccountName, setFromAccountName] = useState("");
    const [toAccountName, setToAccountName] = useState("");
    const [fromAccountBalance, setFromAccountBalance] = useState<number>(0);
    const [fromAccountStatus, setFromAccountStatus] = useState("");
    const [toAccountStatus, setToAccountStatus] = useState("");

    const [transfers, setTransfers] = useState<Transfer[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Mock data for transfer history
    useEffect(() => {
        const mockTransfers: Transfer[] = [
            {
                id: '1',
                fromAccount: '1234567890',
                toAccount: '0987654321',
                amount: 50000,
                currency: 'IDR',
                status: 'completed',
                date: '2025-10-01T10:30:00',
                type: 'internal',
                reference: 'TRF001',
                description: 'Transfer ke rekening tabungan'
            },
            {
                id: '2',
                fromAccount: '1111222233',
                toAccount: '4444555566',
                amount: 25000,
                currency: 'IDR',
                status: 'pending',
                date: '2025-10-01T14:15:00',
                type: 'external',
                reference: 'TRF002',
                description: 'Pembayaran tagihan'
            },
            {
                id: '3',
                fromAccount: '7777888899',
                toAccount: '1010202030',
                amount: 100000,
                currency: 'IDR',
                status: 'failed',
                date: '2025-09-30T16:45:00',
                type: 'internal',
                reference: 'TRF003',
                description: 'Transfer gagal - saldo tidak mencukupi'
            }
        ];
        setTransfers(mockTransfers);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (amount <= 0) {
            Swal.fire({
                title: 'Peringatan!',
                text: 'Jumlah transfer harus lebih dari Rp 0',
                icon: 'warning',
                confirmButtonColor: '#f59e0b'
            });
            return;
        }

        if (fromAccountNumber === toAccountNumber) {
            Swal.fire({
                title: 'Peringatan!',
                text: 'Rekening pengirim dan penerima tidak boleh sama',
                icon: 'warning',
                confirmButtonColor: '#f59e0b'
            });
            return;
        }

        let fromAccountOwner = "";
        let toAccountOwner = "";
        let fromBalance = 0;
        let fromStatus = "";
        let toStatus = "";

        // Cari informasi rekening pengirim
        try {
            const token = localStorage.getItem("token");
            const fromResponse = await axios.get(`http://localhost:8080/api/accounts/search`, {
                params: { accountNumber: fromAccountNumber },
                headers: { Authorization: `Bearer ${token}` }
            });

            if (fromResponse.data.length === 0) {
                Swal.fire({
                    title: '❌ Gagal!',
                    text: 'Rekening pengirim tidak ditemukan. Silakan periksa kembali nomor rekening.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
                return;
            }

            fromAccountOwner = fromResponse.data[0].customerName;
            fromBalance = fromResponse.data[0].balance;
            fromStatus = fromResponse.data[0].status === "ACTIVE" ? "Aktif" : "Tidak Aktif";

            setFromAccountName(fromAccountOwner);
            setFromAccountBalance(fromBalance);
            setFromAccountStatus(fromStatus);

            // Cek apakah saldo mencukupi
            if (amount > fromBalance) {
                Swal.fire({
                    title: '❌ Saldo Tidak Mencukupi!',
                    html: `
                        <div class="balance-warning">
                            <div class="balance-info">
                                <span class="label">Saldo Tersedia:</span>
                                <span class="value">${fromBalance.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                            </div>
                            <div class="balance-info">
                                <span class="label">Jumlah Transfer:</span>
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
                text: 'Terjadi kesalahan saat mencari rekening pengirim',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
            return;
        }

        // Cari informasi rekening penerima
        try {
            const token = localStorage.getItem("token");
            const toResponse = await axios.get(`http://localhost:8080/api/accounts/search`, {
                params: { accountNumber: toAccountNumber },
                headers: { Authorization: `Bearer ${token}` }
            });

            if (toResponse.data.length === 0) {
                Swal.fire({
                    title: '❌ Gagal!',
                    text: 'Rekening penerima tidak ditemukan. Silakan periksa kembali nomor rekening.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
                return;
            }

            toAccountOwner = toResponse.data[0].customerName;
            toStatus = toResponse.data[0].status === "ACTIVE" ? "Aktif" : "Tidak Aktif";

            setToAccountName(toAccountOwner);
            setToAccountStatus(toStatus);

        } catch (err) {
            Swal.fire({
                title: '❌ Gagal!',
                text: 'Terjadi kesalahan saat mencari rekening penerima',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
            return;
        }

        // Konfirmasi sebelum melakukan transfer
        const confirmation = await Swal.fire({
            title: '💸 Konfirmasi Transfer',
            html: `
                <div class="confirmation-detail">
                    <div class="confirmation-item">
                        <span class="label">Rekening <br> Pengirim:</span>
                        <span class="value">${fromAccountNumber} - ${fromAccountOwner}</span>
                    </div>
                    <div class="confirmation-item">
                        <span class="label">Rekening <br> Penerima:</span>
                        <span class="value">${toAccountNumber} - ${toAccountOwner}</span>
                    </div>
                    <div class="confirmation-item">
                        <span class="label">Saldo Pengirim:</span>
                        <span class="value balance">${fromBalance.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                    </div>
                    <div class="confirmation-item">
                        <span class="label">Jumlah Transfer:</span>
                        <span class="value amount">${amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                    </div>
                    <div class="confirmation-item">
                        <span class="label">Tipe Transfer:</span>
                        <span class="value">${transferType === 'internal' ? 'Internal' : 'External'}</span>
                    </div>
                    <div class="confirmation-item final-balance">
                        <span class="label">Saldo Setelah Transfer:</span>
                        <span class="value">${(fromBalance - amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                    </div>
                    ${description ? `
                    <div class="confirmation-item">
                        <span class="label">Deskripsi:</span>
                        <span class="value">${description}</span>
                    </div>
                    ` : ''}
                    <div class="confirmation-note">
                        <small>⚠️ Pastikan data transfer sudah benar sebelum melanjutkan</small>
                    </div>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '✅ Ya, Transfer Sekarang',
            cancelButtonText: '❌ Batal',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            customClass: {
                popup: 'transfer-confirmation-popup'
            }
        });

        if (!confirmation.isConfirmed) return;

        setLoading(true);

        try {
            // Cek status rekening
            if (fromStatus !== "Aktif") {
                Swal.fire({
                    title: '❌ Gagal!',
                    text: 'Rekening pengirim tidak aktif. Transfer hanya dapat dilakukan dari rekening yang aktif.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
                return;
            }

            if (toStatus !== "Aktif") {
                Swal.fire({
                    title: '❌ Gagal!',
                    text: 'Rekening penerima tidak aktif. Transfer hanya dapat dilakukan ke rekening yang aktif.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444'
                });
                return;
            }

            const token = localStorage.getItem("token");
            await axios.post(`http://localhost:8080/api/accounts/transfer`, {
                fromAccountNumber,
                toAccountNumber,
                amount,
                description: description || "Transfer antar rekening"
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Success notification
            await Swal.fire({
                title: '🎉 Berhasil!',
                html: `
                    <div class="success-detail">
                        <p>Transfer telah berhasil diproses</p>
                        <div class="transaction-summary">
                            <div class="summary-item">
                                <span>Jumlah Transfer:</span>
                                <span class="amount">${amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                            </div>
                            <div class="summary-item">
                                <span>Dari:</span>
                                <span>${fromAccountNumber} - ${fromAccountOwner}</span>
                            </div>
                            <div class="summary-item">
                                <span>Ke:</span>
                                <span>${toAccountNumber} - ${toAccountOwner}</span>
                            </div>
                            <div class="summary-item">
                                <span>Saldo Tersisa:</span>
                                <span>${(fromBalance - amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
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
            setFromAccountNumber("");
            setToAccountNumber("");
            setAmount(0);
            setDescription("");
            setFromAccountName("");
            setToAccountName("");
            setFromAccountBalance(0);

        } catch (err: any) {
            Swal.fire({
                title: '❌ Gagal!',
                text: err.response?.data?.message || 'Terjadi kesalahan saat memproses transfer',
                icon: 'error',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'failed':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const filteredTransfers = transfers.filter(transfer => {
        const matchesSearch = transfer.fromAccount.includes(searchTerm) ||
            transfer.toAccount.includes(searchTerm) ||
            transfer.reference.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter;
        const matchesType = typeFilter === 'all' || transfer.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="transfer-page">
            <div className="transfer-container">
                {/* Header Section */}
                <div className="transfer-header">
                    <div className="header-icon">🏦</div>
                    <h1 className="header-title">Transfer Antar Rekening</h1>
                    <p className="header-subtitle">Proses transfer dengan verifikasi keamanan</p>
                </div>

                {/* Form Section */}
                <div className="transfer-form-container">
                    <form className="transfer-form" onSubmit={handleSubmit}>
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
                                    value={fromAccountNumber}
                                    onChange={e => setFromAccountNumber(e.target.value)}
                                    required
                                    placeholder="Masukkan nomor rekening pengirim"
                                    disabled={loading}
                                />
                                <div className="input-border"></div>
                            </div>
                            {fromAccountName && (
                                <div className="account-info">
                                    <span className="info-icon">👤</span>
                                    <span className="info-text">Atas Nama: <strong>{fromAccountName}</strong></span>
                                </div>
                            )}
                        </div>

                        {fromAccountBalance > 0 && (
                            <div className="balance-display">
                                <div className="balance-card">
                                    <span className="balance-label">💰 Saldo Tersedia</span>
                                    <span className="balance-amount">
                                        {fromAccountBalance.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
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
                                    value={toAccountNumber}
                                    onChange={e => setToAccountNumber(e.target.value)}
                                    required
                                    placeholder="Masukkan nomor rekening penerima"
                                    disabled={loading}
                                />
                                <div className="input-border"></div>
                            </div>
                            {toAccountName && (
                                <div className="account-info">
                                    <span className="info-icon">👤</span>
                                    <span className="info-text">Atas Nama: <strong>{toAccountName}</strong></span>
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
                                        value={amount || ""}
                                        onChange={e => setAmount(Number(e.target.value))}
                                        required
                                        min={1}
                                        max={fromAccountBalance || undefined}
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
                                    {fromAccountBalance > 0 && (
                                        <span className="remaining-balance">
                                            Sisa: {(fromAccountBalance - amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
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
                                    value={transferType}
                                    onChange={e => setTransferType(e.target.value)}
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
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
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

                {/* Security Notice */}
                <div className="security-notice">
                    <div className="notice-header">
                        <span className="security-icon">🔐</span>
                        <h3>Protokol Keamanan Transfer</h3>
                    </div>
                    <ul className="security-list">
                        <li>✓ Verifikasi kedua rekening (pengirim & penerima)</li>
                        <li>✓ Pastikan saldo mencukupi</li>
                        <li>✓ Konfirmasi data sebelum memproses</li>
                        <li>✓ Simpan bukti transaksi</li>
                    </ul>
                </div>

                {/* Transfer History */}
                {/* <div className="transfer-history">
                    <div className="history-header">
                        <h3>Riwayat Transfer Hari Ini</h3>
                        <div className="history-controls">
                            <div className="search-container">
                                <Search className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Cari transaksi..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">Semua Status</option>
                                <option value="completed">Berhasil</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Gagal</option>
                            </select>
                        </div>
                    </div>

                    <div className="history-list">
                        {filteredTransfers.map((transfer) => (
                            <div key={transfer.id} className="history-item">
                                <div className="transfer-info">
                                    <div className="transfer-icon">
                                        {transfer.type === 'internal' ?
                                            <Building className="icon" /> :
                                            <CreditCard className="icon" />
                                        }
                                    </div>
                                    <div className="transfer-details">
                                        <div className="transfer-ref">{transfer.reference}</div>
                                        <div className="transfer-accounts">
                                            {transfer.fromAccount} → {transfer.toAccount}
                                        </div>
                                        <div className="transfer-desc">{transfer.description}</div>
                                    </div>
                                </div>
                                <div className="transfer-meta">
                                    <div className="transfer-amount">
                                        {formatCurrency(transfer.amount)}
                                    </div>
                                    <div className="transfer-status">
                                        {getStatusIcon(transfer.status)}
                                        <span className={`status-badge ${transfer.status}`}>
                                            {transfer.status === 'completed' ? 'Berhasil' :
                                                transfer.status === 'pending' ? 'Pending' : 'Gagal'}
                                        </span>
                                    </div>
                                    <div className="transfer-date">
                                        {formatDate(transfer.date)}
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedTransfer(transfer);
                                        setIsModalOpen(true);
                                    }}
                                    className="view-btn"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div> */}

                {/* Detail Modal */}
                {isModalOpen && selectedTransfer && (
                    <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Detail Transfer</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="modal-close"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <label>Referensi</label>
                                        <span>{selectedTransfer.reference}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Rekening Pengirim</label>
                                        <span>{selectedTransfer.fromAccount}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Rekening Penerima</label>
                                        <span>{selectedTransfer.toAccount}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Jumlah</label>
                                        <span className="amount">{formatCurrency(selectedTransfer.amount)}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Status</label>
                                        <div className="status-container">
                                            {getStatusIcon(selectedTransfer.status)}
                                            <span className={`status-badge ${selectedTransfer.status}`}>
                                                {selectedTransfer.status === 'completed' ? 'Berhasil' :
                                                    selectedTransfer.status === 'pending' ? 'Pending' : 'Gagal'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="detail-item">
                                        <label>Tanggal</label>
                                        <span>{formatDate(selectedTransfer.date)}</span>
                                    </div>
                                </div>

                                <div className="detail-item full-width">
                                    <label>Deskripsi</label>
                                    <span>{selectedTransfer.description}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransferManagementPage;