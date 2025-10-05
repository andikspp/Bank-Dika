import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import '../../styles/amountPreview.css';

type TransactionType = 'deposit' | 'withdrawal';

interface AmountPreviewProps {
    amount: number;
    currentBalance: number;
    transactionType: TransactionType;
    showBalance?: boolean;
}

const AmountPreview: React.FC<AmountPreviewProps> = ({
    amount,
    currentBalance,
    transactionType,
    showBalance = true
}) => {
    const isDeposit = transactionType === 'deposit';
    const finalBalance = isDeposit ? currentBalance + amount : currentBalance - amount;

    const getTransactionIcon = (): string => {
        return isDeposit ? '💰' : '💸';
    };

    const getTransactionClass = (): string => {
        return isDeposit ? 'deposit' : 'withdrawal';
    };

    const getFinalBalanceLabel = (): string => {
        return isDeposit ? 'Saldo Akhir' : 'Saldo Tersisa';
    };

    const getFinalBalanceClass = (): string => {
        if (!showBalance) return '';

        if (isDeposit) return 'positive';

        // For withdrawal, show warning if balance is low
        if (finalBalance < 100000) return 'warning'; // Less than 100k
        if (finalBalance < 0) return 'negative';

        return 'normal';
    };

    return (
        <div className={`amount-preview ${getTransactionClass()}`}>
            <div className="preview-amount">
                <span className="transaction-icon">{getTransactionIcon()}</span>
                <span className="preview-text">
                    {formatCurrency(amount)}
                </span>
            </div>

            {showBalance && currentBalance > 0 && (
                <div className={`balance-result ${getFinalBalanceClass()}`}>
                    <span className="balance-label">{getFinalBalanceLabel()}:</span>
                    <span className="balance-value">
                        {formatCurrency(finalBalance)}
                    </span>
                    {!isDeposit && finalBalance < 100000 && finalBalance > 0 && (
                        <span className="balance-warning">⚠️</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default AmountPreview;