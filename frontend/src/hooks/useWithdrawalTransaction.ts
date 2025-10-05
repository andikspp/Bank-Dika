import { useState } from 'react';
import { WithdrawalService } from '../api/WithdrawalService';
import { showError } from '../utils/alerts';
import { showWithdrawalConfirmation, showWithdrawalSuccess, showInsufficientBalance } from '../utils/alerts';

interface AccountInfo {
    customerName: string;
    status: string;
    balance: number;
}

interface WithdrawalState {
    accountNumber: string;
    amount: number;
    accountInfo: AccountInfo | null;
    loading: boolean;
}

const INITIAL_STATE: WithdrawalState = {
    accountNumber: '',
    amount: 0,
    accountInfo: null,
    loading: false
};

export const useWithdrawalTransaction = () => {
    const [state, setState] = useState<WithdrawalState>(INITIAL_STATE);

    const updateState = (updates: Partial<WithdrawalState>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    const setAccountNumber = (accountNumber: string) => {
        updateState({ accountNumber });
    };

    const setAmount = (amount: number) => {
        updateState({ amount });
    };

    const searchAccount = async (accountNumber: string): Promise<boolean> => {
        try {
            const accountData = await WithdrawalService.searchAccount(accountNumber);

            if (!isAccountFound(accountData)) {
                showAccountNotFoundError();
                return false;
            }

            const accountInfo = mapAccountData(accountData[0]);
            updateState({ accountInfo });

            return true;
        } catch (error) {
            handleSearchError(error);
            return false;
        }
    };

    const processWithdrawal = async (): Promise<boolean> => {
        if (!state.accountInfo) return false;

        // Validasi status rekening
        if (!isAccountActive(state.accountInfo.status)) {
            showInactiveAccountError();
            return false;
        }

        // Validasi saldo
        if (!hasSufficientBalance(state.amount, state.accountInfo.balance)) {
            await showInsufficientBalance(state.amount, state.accountInfo.balance);
            return false;
        }

        const confirmed = await confirmWithdrawal();
        if (!confirmed) return false;

        return await executeWithdrawal();
    };

    const confirmWithdrawal = async (): Promise<boolean> => {
        const { accountNumber, amount, accountInfo } = state;

        return showWithdrawalConfirmation(
            accountNumber,
            accountInfo!.customerName,
            accountInfo!.status,
            amount,
            accountInfo!.balance
        );
    };

    const executeWithdrawal = async (): Promise<boolean> => {
        updateState({ loading: true });

        try {
            await WithdrawalService.processWithdrawal(state.accountNumber, state.amount);

            const remainingBalance = state.accountInfo!.balance - state.amount;
            await showWithdrawalSuccess(state.amount, remainingBalance);

            resetForm();
            return true;
        } catch (error) {
            handleWithdrawalError(error);
            return false;
        } finally {
            updateState({ loading: false });
        }
    };

    const resetForm = () => {
        setState(INITIAL_STATE);
    };

    // Helper functions
    const isAccountFound = (data: any[]): boolean => data.length > 0;

    const isAccountActive = (status: string): boolean => status === "Aktif";

    const hasSufficientBalance = (amount: number, balance: number): boolean => amount <= balance;

    const mapAccountData = (account: any): AccountInfo => ({
        customerName: account.customerName,
        status: account.status === "ACTIVE" ? "Aktif" : "Tidak Aktif",
        balance: account.balance
    });

    const showAccountNotFoundError = () => {
        showError('Gagal!', 'Rekening tidak ditemukan. Silakan periksa kembali nomor rekening.');
    };

    const showInactiveAccountError = () => {
        showError('Gagal!', 'Rekening tidak aktif. Tarik tunai hanya dapat dilakukan pada rekening yang aktif.');
    };

    const handleSearchError = (error: any) => {
        console.error('Search account error:', error);
        showError('Gagal!', 'Terjadi kesalahan saat mencari rekening');
    };

    const handleWithdrawalError = (error: any) => {
        console.error('Withdrawal error:', error);
        const message = error.response?.data?.message || 'Terjadi kesalahan saat memproses penarikan';
        showError('Gagal!', message);
    };

    return {
        // State
        accountNumber: state.accountNumber,
        amount: state.amount,
        accountInfo: state.accountInfo,
        loading: state.loading,

        // Actions
        setAccountNumber,
        setAmount,
        searchAccount,
        processWithdrawal,
        resetForm
    };
};