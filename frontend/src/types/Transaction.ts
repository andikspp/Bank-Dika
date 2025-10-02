export interface Transaction {
    id: string;
    accountNumber: string;
    customerName: string;
    transactionType: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER_DEBIT' | 'TRANSFER_CREDIT';
    amount: number;
    description: string;
    referenceNumber: string;
    timestamp: string;
    status: 'SUCCESS' | 'PENDING' | 'FAILED';
    balance?: number;
}

export interface TransactionStats {
    totalTransactions: number;
    totalDeposits: number;
    totalWithdrawals: number;
    totalTransfers: number;
    todayVolume: number;
}