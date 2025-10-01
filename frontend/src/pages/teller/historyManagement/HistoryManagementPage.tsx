import React, { useState, useEffect } from 'react';
import { History, RefreshCw } from 'lucide-react';
import { Transaction } from '../../../types/Transaction';
import { transactionService } from '../../../services/TransactionService';
import StatisticsCards from '../../../components/card/StatisticCardComponent';
import FilterSection from '../../../components/filter/FilterHistoryManagement';
import TransactionsList from '../../../components/list/TransactionList';
import TransactionModal from '../../../components/transactionManagement/modal/TransactionModal';
import '../../../styles/historyManagementPage.css';

export interface FilterState {
    searchTerm: string;
    typeFilter: string;
    statusFilter: string;
    dateFilter: string;
    accountFilter: string;
    startDate: string;
    endDate: string;
}

const HistoryManagementPage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '',
        typeFilter: 'all',
        statusFilter: 'all',
        dateFilter: 'today',
        accountFilter: '',
        startDate: '',
        endDate: ''
    });

    const [stats, setStats] = useState({
        totalTransactions: 0,
        totalDeposits: 0,
        totalWithdrawals: 0,
        totalTransfers: 0,
        todayVolume: 0
    });

    // Load transactions from server
    const loadTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await transactionService.getAllTransactions();
            setTransactions(data);
            setFilteredTransactions(data);
            calculateStats(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load transactions');
            console.error('Error loading transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics
    const calculateStats = (transactionData: Transaction[]) => {
        const stats = {
            totalTransactions: transactionData.length,
            totalDeposits: transactionData.filter(t => t.transactionType === 'DEPOSIT').length,
            totalWithdrawals: transactionData.filter(t => t.transactionType === 'WITHDRAWAL').length,
            totalTransfers: transactionData.filter(t => t.transactionType.includes('TRANSFER')).length,
            todayVolume: transactionData
                .filter(t => isToday(new Date(t.timestamp)))
                .reduce((sum, t) => sum + t.amount, 0)
        };
        setStats(stats);
    };

    // Check if date is today
    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    // Filter transactions
    useEffect(() => {
        let filtered = transactions;

        // Search filter
        if (filters.searchTerm) {
            filtered = filtered.filter(t =>
                t.accountNumber.includes(filters.searchTerm) ||
                t.customerName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                t.referenceNumber.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                t.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
            );
        }

        // Type filter
        if (filters.typeFilter !== 'all') {
            filtered = filtered.filter(t => t.transactionType === filters.typeFilter);
        }

        // Status filter
        if (filters.statusFilter !== 'all') {
            filtered = filtered.filter(t => t.status === filters.statusFilter);
        }

        // Account filter
        if (filters.accountFilter) {
            filtered = filtered.filter(t => t.accountNumber.includes(filters.accountFilter));
        }

        // Date filter
        if (filters.dateFilter !== 'all') {
            const now = new Date();
            let startDate: Date;

            switch (filters.dateFilter) {
                case 'today':
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'week':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                case 'custom':
                    if (filters.startDate && filters.endDate) {
                        filtered = filtered.filter(t => {
                            const transactionDate = new Date(t.timestamp);
                            return transactionDate >= new Date(filters.startDate) &&
                                transactionDate <= new Date(filters.endDate);
                        });
                    }
                    break;
                default:
                    startDate = new Date(0);
            }

            if (filters.dateFilter !== 'custom') {
                filtered = filtered.filter(t => new Date(t.timestamp) >= startDate);
            }
        }

        setFilteredTransactions(filtered);
    }, [filters, transactions]);

    // Load data on component mount
    useEffect(() => {
        loadTransactions();
    }, []);

    const handleFilterChange = (newFilters: Partial<FilterState>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleExport = async () => {
        try {
            await transactionService.exportTransactions(filteredTransactions);
        } catch (err) {
            console.error('Export failed:', err);
        }
    };

    const openTransactionModal = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    const closeTransactionModal = () => {
        setSelectedTransaction(null);
        setIsModalOpen(false);
    };

    return (
        <div className="history-page">
            <div className="history-container">
                {/* Header */}
                <div className="history-header">
                    <div className="header-content">
                        <div className="header-icon">
                            <History className="w-8 h-8 text-white" />
                        </div>
                        <div className="header-text">
                            <h1>Riwayat Transaksi</h1>
                            <p>Kelola dan pantau semua aktivitas transaksi</p>
                        </div>
                    </div>
                    <button
                        onClick={loadTransactions}
                        className={`refresh-btn ${loading ? 'loading' : ''}`}
                        disabled={loading}
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={loadTransactions}>Retry</button>
                    </div>
                )}

                {/* Statistics Cards */}
                <StatisticsCards stats={stats} />

                {/* Filters */}
                <FilterSection
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onExport={handleExport}
                />

                {/* Transactions List */}
                <TransactionsList
                    transactions={filteredTransactions}
                    loading={loading}
                    onTransactionClick={openTransactionModal}
                />

                {/* Detail Modal */}
                <TransactionModal
                    transaction={selectedTransaction}
                    isOpen={isModalOpen}
                    onClose={closeTransactionModal}
                />
            </div>
        </div>
    );
};

export default HistoryManagementPage;