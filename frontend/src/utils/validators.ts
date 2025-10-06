import { TRANSFER_CONSTANTS, TRANSFER_MESSAGES } from '../constants/messages';
import { AccountInfo } from '../types/Transfer';

/* ----------------------- Transaction Validations ------------------ */
export const validateTransactionAmount = (amount: number): string | null => {
    if (amount <= 0) {
        return 'Jumlah setoran harus lebih dari Rp 0';
    }

    if (amount > 1000000000) { // 1 Miliar
        return 'Jumlah setoran terlalu besar';
    }

    return null;
};

export const validateAccountNumber = (accountNumber: string): string | null => {
    if (!accountNumber.trim()) {
        return 'Nomor rekening tidak boleh kosong';
    }

    if (accountNumber.length < 10) {
        return 'Nomor rekening minimal 10 digit';
    }

    return null;
};

/* ----------------------- Transfer Validations ------------------ */
export class TransferValidator {
    static validateAmount(amount: number): string | null {
        if (amount <= 0) {
            return TRANSFER_MESSAGES.INVALID_AMOUNT;
        }
        return null;
    }

    static validateAccountNumbers(fromAccount: string, toAccount: string): string | null {
        if (fromAccount === toAccount) {
            return TRANSFER_MESSAGES.SAME_ACCOUNT;
        }
        return null;
    }

    static validateBalance(amount: number, balance: number): string | null {
        if (amount > balance) {
            return TRANSFER_MESSAGES.INSUFFICIENT_BALANCE;
        }
        return null;
    }

    static validateAccountStatus(status: string): string | null {
        if (status !== "Aktif") {
            return TRANSFER_MESSAGES.ACCOUNT_INACTIVE;
        }
        return null;
    }

    static validateTransferForm(
        amount: number,
        fromAccount: string,
        toAccount: string,
        fromAccountInfo?: AccountInfo,
        toAccountInfo?: AccountInfo
    ): string | null {
        const amountError = this.validateAmount(amount);
        if (amountError) return amountError;

        const accountsError = this.validateAccountNumbers(fromAccount, toAccount);
        if (accountsError) return accountsError;

        if (fromAccountInfo) {
            const balanceError = this.validateBalance(amount, fromAccountInfo.balance);
            if (balanceError) return balanceError;

            const fromStatusError = this.validateAccountStatus(fromAccountInfo.status);
            if (fromStatusError) return `Rekening pengirim ${fromStatusError.toLowerCase()}`;
        }

        if (toAccountInfo) {
            const toStatusError = this.validateAccountStatus(toAccountInfo.status);
            if (toStatusError) return `Rekening penerima ${toStatusError.toLowerCase()} pada rekening penerima`;
        }

        return null;
    }
}