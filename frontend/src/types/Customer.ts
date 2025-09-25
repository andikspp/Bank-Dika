import { Account } from "./Account";

export type Customer = {
    id: number;
    fullName: string;
    address?: string;
    phone?: string;
    email: string;
    ktpNumber: string;
    registrationDate: string;
    accounts: Account[];
};
