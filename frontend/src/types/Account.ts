export type Account = {
    id: number;
    accountNumber: number;
    accountType: string;
    status: string;
    balance: number;
    customerName?: string;
};