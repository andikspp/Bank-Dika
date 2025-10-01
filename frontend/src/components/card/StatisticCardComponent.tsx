import React from 'react';
import { FileText, TrendingUp, TrendingDown, ArrowRightLeft, Wallet } from 'lucide-react';
import { TransactionStats } from '../../types/Transaction';

interface StatisticsCardsProps {
    stats: TransactionStats;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ stats }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    return (
        <div className="stats-grid">
            <div className="stat-card total">
                <div className="stat-icon">
                    <FileText className="w-8 h-8" />
                </div>
                <div className="stat-content">
                    <div className="stat-value">{stats.totalTransactions}</div>
                    <div className="stat-label">Total Transaksi</div>
                </div>
            </div>

            <div className="stat-card deposits">
                <div className="stat-icon">
                    <TrendingUp className="w-8 h-8" />
                </div>
                <div className="stat-content">
                    <div className="stat-value">{stats.totalDeposits}</div>
                    <div className="stat-label">Setoran</div>
                </div>
            </div>

            <div className="stat-card withdrawals">
                <div className="stat-icon">
                    <TrendingDown className="w-8 h-8" />
                </div>
                <div className="stat-content">
                    <div className="stat-value">{stats.totalWithdrawals}</div>
                    <div className="stat-label">Penarikan</div>
                </div>
            </div>

            <div className="stat-card transfers">
                <div className="stat-icon">
                    <ArrowRightLeft className="w-8 h-8" />
                </div>
                <div className="stat-content">
                    <div className="stat-value">{stats.totalTransfers}</div>
                    <div className="stat-label">Transfer</div>
                </div>
            </div>

            <div className="stat-card volume">
                <div className="stat-icon">
                    <Wallet className="w-8 h-8" />
                </div>
                <div className="stat-content">
                    <div className="stat-value">{formatCurrency(stats.todayVolume)}</div>
                    <div className="stat-label">Volume Hari Ini</div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsCards;