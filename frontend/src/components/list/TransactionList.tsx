import React from 'react';
import { History } from 'lucide-react';
import TransactionItem from '../transactionManagement/ItemComponent';
import { Transaction } from '../../types/Transaction';

interface TransactionsListProps {
    transactions: Transaction[];
    loading: boolean;
    onTransactionClick: (transaction: Transaction) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({
    transactions,
    loading,
    onTransactionClick
}) => {
    if (loading) {
        return (
            <div className="transactions-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Memuat transaksi...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="transactions-container">
            <div className="table-header">
                <h3>Daftar Transaksi ({transactions.length})</h3>
            </div>

            <div className="transactions-list">
                {transactions.map((transaction) => (
                    <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                        onClick={() => onTransactionClick(transaction)}
                    />
                ))}
            </div>

            {transactions.length === 0 && (
                <div className="empty-state">
                    <History className="w-16 h-16 text-gray-300" />
                    <h3>Tidak ada transaksi ditemukan</h3>
                    <p>Coba ubah filter pencarian Anda</p>
                </div>
            )}
        </div>
    );
};

export default TransactionsList;