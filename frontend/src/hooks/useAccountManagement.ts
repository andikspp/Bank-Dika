import { useState } from 'react';
import { Account } from '../types/Account';
import { AccountService } from '../api/AccountService';
import { showSuccess, showError, showConfirmation } from '../utils/alerts';

interface NewAccount {
    accountType: string;
    balance: number;
    status: string;
    customerId: number;
}

export const useAccountManagement = (customerId: number, onRefresh: () => void) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [loadingAccount, setLoadingAccount] = useState(false);
    const [newAccount, setNewAccount] = useState<NewAccount>({
        accountType: "",
        balance: 0,
        status: "ACTIVE",
        customerId: customerId,
    });

    const handleAddAccount = () => {
        setShowAddModal(true);
    };

    const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewAccount(prev => ({
            ...prev,
            [name]: name === "balance" ? Number(value) : value,
        }));
    };

    const handleAccountSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingAccount(true);

        try {
            await AccountService.createAccount(newAccount);
            setShowAddModal(false);
            resetNewAccount();
            onRefresh();
            showSuccess("Berhasil!", "Rekening berhasil ditambahkan.");
        } catch (err) {
            showError("Gagal!", "Gagal menambah rekening.");
        } finally {
            setLoadingAccount(false);
        }
    };

    const handleDeleteAccount = async (accountId: number) => {
        const confirmed = await showConfirmation(
            'Yakin ingin menghapus rekening ini?',
            "Tindakan ini tidak dapat dibatalkan!",
            'Ya, hapus!',
            'Batal'
        );

        if (confirmed) {
            try {
                await AccountService.deleteAccount(accountId);
                onRefresh();
                showSuccess('Dihapus!', 'Rekening telah dihapus.');
            } catch (err) {
                showError('Gagal!', 'Gagal menghapus rekening.');
            }
        }
    };

    const handleToggleAccountStatus = async (accountId: number, currentStatus: string) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        const actionText = newStatus === 'ACTIVE' ? 'mengaktifkan' : 'menonaktifkan';

        const confirmed = await showConfirmation(
            `Yakin ingin ${actionText} rekening ini?`,
            `Status rekening akan diubah menjadi ${newStatus === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}`,
            `Ya, ${actionText}!`,
            'Batal'
        );

        if (confirmed) {
            try {
                await AccountService.updateAccountStatus(accountId, newStatus);
                onRefresh();
                showSuccess('Berhasil!', `Rekening berhasil di${actionText}.`);
            } catch (err) {
                showError('Gagal!', `Gagal ${actionText} rekening.`);
            }
        }
    };

    const handleShowAccountDetail = (account: Account) => {
        setSelectedAccount(account);
        setShowDetailModal(true);
    };

    const handleCloseModals = () => {
        setShowAddModal(false);
        setShowDetailModal(false);
        setSelectedAccount(null);
    };

    const resetNewAccount = () => {
        setNewAccount({
            accountType: "",
            balance: 0,
            status: "ACTIVE",
            customerId: customerId,
        });
    };

    return {
        // State
        showAddModal,
        showDetailModal,
        selectedAccount,
        loadingAccount,
        newAccount,

        // Actions
        handleAddAccount,
        handleAccountChange,
        handleAccountSubmit,
        handleDeleteAccount,
        handleToggleAccountStatus,
        handleShowAccountDetail,
        handleCloseModals,
    };
};