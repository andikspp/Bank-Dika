import React from 'react';
import {
    Eye,
    Calendar,
    ArrowUpRight,
    ArrowDownLeft,
    ArrowRightLeft,
    CheckCircle,
    Clock,
    XCircle,
    CreditCard,
    Building2,
    FileText
} from 'lucide-react';
import { Transaction } from '../../types/Transaction';

interface TransactionItemProps {
    transaction: Transaction;
    onClick: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onClick }) => {
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
            case 'SUCCESS':
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
            case 'SUCCESS':
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

    return (
        <div className="transaction-item">
            <div className="transaction-main">
                <div className="transaction-icon">
                    {getTransactionIcon(transaction.transactionType)}
                </div>

                <div className="transaction-info">
                    <div className="transaction-header">
                        <div className="transaction-title">
                            <span className="transaction-type">
                                {getTransactionTypeName(transaction.transactionType)}
                            </span>
                            <span className={`transaction-badge ${transaction.transactionType.toLowerCase()}`}>
                                {getTransactionTypeName(transaction.transactionType)}
                            </span>
                        </div>
                        <div className="transaction-amount">
                            <span className={`amount ${transaction.transactionType === 'DEPOSIT' || transaction.transactionType === 'TRANSFER_CREDIT' ? 'positive' : 'negative'}`}>
                                {transaction.transactionType === 'DEPOSIT' || transaction.transactionType === 'TRANSFER_CREDIT' ? '+' : '-'}
                                {formatCurrency(transaction.amount)}
                            </span>
                        </div>
                    </div>

                    <div className="transaction-details">
                        <div className="detail-item">
                            <CreditCard className="w-4 h-4" />
                            <span>{transaction.accountNumber}</span>
                        </div>
                        <div className="detail-item">
                            <Building2 className="w-4 h-4" />
                            <span>{transaction.customerName}</span>
                        </div>
                        <div className="detail-item">
                            <FileText className="w-4 h-4" />
                            <span>{transaction.referenceNumber}</span>
                        </div>
                        <div className="detail-item">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(transaction.timestamp)}</span>
                        </div>
                    </div>

                    <div className="transaction-description">
                        {transaction.description}
                    </div>
                </div>
            </div>

            <div className="transaction-meta">
                <div className="transaction-status">
                    {getStatusIcon(transaction.status)}
                    <span className={`status-badge ${getStatusColor(transaction.status)}`}>
                        {transaction.status === 'SUCCESS' ? 'Berhasil' :
                            transaction.status === 'PENDING' ? 'Pending' : 'Gagal'}
                    </span>
                </div>

                {transaction.balance && (
                    <div className="balance-info">
                        <span className="balance-label">Saldo:</span>
                        <span className="balance-amount">{formatCurrency(transaction.balance)}</span>
                    </div>
                )}

                <button onClick={onClick} className="view-btn">
                    <Eye className="w-4 h-4" />
                    Detail
                </button>
            </div>
        </div>
    );
};

export default TransactionItem;