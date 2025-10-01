import React from 'react';
import {
    XCircle,
    Download,
    ArrowUpRight,
    ArrowDownLeft,
    ArrowRightLeft,
    CheckCircle,
    Clock
} from 'lucide-react';
import { Transaction } from '../../../types/Transaction';

interface TransactionModalProps {
    transaction: Transaction | null;
    isOpen: boolean;
    onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ transaction, isOpen, onClose }) => {
    if (!isOpen || !transaction) return null;

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'DEPOSIT':
                return <ArrowDownLeft className="w-5 h-5 text-green-600" />;
            case 'WITHDRAWAL':
                return <ArrowUpRight className="w-5 h-5 text-red-600" />;
            case 'TRANSFER_DEBIT':
                return <ArrowUpRight className="w-5 h-5 text-blue-600" />;
            case 'TRANSFER_CREDIT':
                return <ArrowDownLeft className="w-5 h-5 text-purple-600" />;
            default:
                return <ArrowRightLeft className="w-5 h-5 text-gray-600" />;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'PENDING':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'FAILED':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'FAILED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTransactionTypeName = (type: string) => {
        switch (type) {
            case 'DEPOSIT':
                return 'Setoran';
            case 'WITHDRAWAL':
                return 'Penarikan';
            case 'TRANSFER_DEBIT':
                return 'Transfer Keluar';
            case 'TRANSFER_CREDIT':
                return 'Transfer Masuk';
            default:
                return type;
        }
    };

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

    const handlePrint = () => {
        // Implementasi print receipt
        window.print();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Detail Transaksi</h3>
                    <button onClick={onClose} className="modal-close">
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="transaction-summary">
                        <div className="summary-icon">
                            {getTransactionIcon(transaction.transactionType)}
                        </div>
                        <div className="summary-info">
                            <h4>{getTransactionTypeName(transaction.transactionType)}</h4>
                            <p className={`summary-amount ${transaction.transactionType === 'DEPOSIT' || transaction.transactionType === 'TRANSFER_CREDIT' ? 'positive' : 'negative'}`}>
                                {transaction.transactionType === 'DEPOSIT' || transaction.transactionType === 'TRANSFER_CREDIT' ? '+' : '-'}
                                {formatCurrency(transaction.amount)}
                            </p>
                        </div>
                        <div className="summary-status">
                            {getStatusIcon(transaction.status)}
                            <span className={`status-badge ${getStatusColor(transaction.status)}`}>
                                {transaction.status === 'COMPLETED' ? 'Berhasil' :
                                    transaction.status === 'PENDING' ? 'Pending' : 'Gagal'}
                            </span>
                        </div>
                    </div>

                    <div className="detail-grid">
                        <div className="detail-item">
                            <label>ID Transaksi</label>
                            <span>{transaction.id}</span>
                        </div>
                        <div className="detail-item">
                            <label>Nomor Referensi</label>
                            <span>{transaction.referenceNumber}</span>
                        </div>
                        <div className="detail-item">
                            <label>Nomor Rekening</label>
                            <span>{transaction.accountNumber}</span>
                        </div>
                        <div className="detail-item">
                            <label>Nama Nasabah</label>
                            <span>{transaction.customerName}</span>
                        </div>
                        <div className="detail-item">
                            <label>Tipe Transaksi</label>
                            <span>{getTransactionTypeName(transaction.transactionType)}</span>
                        </div>
                        <div className="detail-item">
                            <label>Tanggal & Waktu</label>
                            <span>{formatDate(transaction.timestamp)}</span>
                        </div>
                        {transaction.balance && (
                            <div className="detail-item">
                                <label>Saldo Setelah Transaksi</label>
                                <span>{formatCurrency(transaction.balance)}</span>
                            </div>
                        )}
                        <div className="detail-item full-width">
                            <label>Deskripsi</label>
                            <span>{transaction.description}</span>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button onClick={onClose} className="modal-btn secondary">
                        Tutup
                    </button>
                    <button onClick={handlePrint} className="modal-btn primary">
                        <Download className="w-4 h-4" />
                        Cetak Bukti
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionModal;