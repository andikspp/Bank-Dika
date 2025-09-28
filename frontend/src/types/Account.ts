export type Account = {
    id: number;
    accountNumber: number;
    accountType: string;
    status: string;
    balance: number;
    openedDate: string;
    customerName?: string;
};