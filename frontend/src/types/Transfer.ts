export interface Transfer {
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

export interface AccountInfo {
    customerName: string;
    balance: number;
    status: string;
}

export interface TransferFormData {
    fromAccountNumber: string;
    toAccountNumber: string;
    amount: number;
    description: string;
    transferType: string;
}