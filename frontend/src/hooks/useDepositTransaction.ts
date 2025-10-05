import { useState } from 'react';
import { DepositService } from '../api/DepositService';
import { showSuccess, showError } from '../utils/alerts';
import { formatCurrency } from '../utils/formatters';
import Swal from 'sweetalert2';

interface AccountInfo {
    customerName: string;
    status: string;
    balance: number;
}

export const useDepositTransaction = () => {
    const [accountNumber, setAccountNumber] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
    const [loading, setLoading] = useState(false);

    const searchAccount = async (accountNumber: string): Promise<boolean> => {
        try {
            const data = await DepositService.searchAccount(accountNumber);

            if (data.length === 0) {
                showError('Gagal!', 'Rekening tidak ditemukan. Silakan periksa kembali nomor rekening.');
                return false;
            }

            const account = data[0];
            setAccountInfo({
                customerName: account.customerName,
                status: account.status === "ACTIVE" ? "Aktif" : "Tidak Aktif",
                balance: account.balance
            });

            return true;
        } catch (error: any) {
            showError('Gagal!', 'Terjadi kesalahan saat mencari rekening');
            return false;
        }
    };

    const processDeposit = async () => {
        if (!accountInfo) return false;

        // Validasi status rekening
        if (accountInfo.status !== "Aktif") {
            showError('Gagal!', 'Rekening tidak aktif. Setoran hanya dapat dilakukan pada rekening yang aktif.');
            return false;
        }

        // Konfirmasi transaksi
        const confirmed = await showDepositConfirmation(
            accountNumber,
            accountInfo.customerName,
            accountInfo.status,
            amount,
            accountInfo.balance
        );

        if (!confirmed) return false;

        setLoading(true);
        try {
            await DepositService.processDeposit(accountNumber, amount);

            await showDepositSuccess(amount, accountInfo.balance + amount);

            resetForm();
            return true;
        } catch (error: any) {
            showError('Gagal!', error.response?.data?.message || 'Terjadi kesalahan saat memproses setoran');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setAccountNumber("");
        setAmount(0);
        setAccountInfo(null);
    };

    return {
        // State
        accountNumber,
        amount,
        accountInfo,
        loading,

        // Actions
        setAccountNumber,
        setAmount,
        searchAccount,
        processDeposit,
        resetForm
    };
};

// Helper functions for alerts
export const showDepositConfirmation = async (
    accountNumber: string,
    customerName: string,
    status: string,
    amount: number,
    currentBalance: number
): Promise<boolean> => {
    const result = await Swal.fire({
        title: '💰 Konfirmasi Setor Tunai',
        html: `
            <div style="text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                        <span style="font-weight: 500; color: #64748b;">No. Rekening:</span>
                        <span style="font-weight: 600; color: #1e293b;">${accountNumber}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                        <span style="font-weight: 500; color: #64748b;">Atas Nama:</span>
                        <span style="font-weight: 600; color: #1e293b;">${customerName}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                        <span style="font-weight: 500; color: #64748b;">Status:</span>
                        <span style="font-weight: 600; color: ${status === 'Aktif' ? '#10b981' : '#ef4444'};">${status}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                        <span style="font-weight: 500; color: #64748b;">Jumlah Setoran:</span>
                        <span style="font-weight: 700; color: #059669; font-size: 16px;">${formatCurrency(amount)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                        <span style="font-weight: 500; color: #64748b;">Saldo Saat Ini:</span>
                        <span style="font-weight: 600; color: #1e293b;">${formatCurrency(currentBalance)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px 0; background: #ecfdf5; margin: 8px -16px -16px; padding: 16px; border-radius: 0 0 8px 8px;">
                        <span style="font-weight: 600; color: #065f46;">Saldo Setelah Setoran:</span>
                        <span style="font-weight: 700; color: #059669; font-size: 18px;">${formatCurrency(currentBalance + amount)}</span>
                    </div>
                </div>
                <div style="background: #fef3c7; padding: 12px; border-radius: 6px; border-left: 4px solid #f59e0b; margin-top: 16px;">
                    <small style="color: #92400e; font-weight: 500;">⚠️ Pastikan data sudah benar sebelum melanjutkan</small>
                </div>
            </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#ef4444',
        confirmButtonText: '✅ Ya, Setor Sekarang',
        cancelButtonText: '❌ Batal',
        width: '500px',
        customClass: {
            popup: 'deposit-confirmation-popup'
        }
    });

    return result.isConfirmed;
};

const showDepositSuccess = async (amount: number, finalBalance: number) => {
    return showSuccess(
        '🎉 Berhasil!',
        createSuccessHtml(amount, finalBalance)
    );
};

const createSuccessHtml = (amount: number, finalBalance: number): string => {
    return `
        <div class="success-detail">
            <p>Setoran tunai telah berhasil diproses</p>
            <div class="transaction-summary">
                <div class="summary-item">
                    <span>Jumlah Setoran:</span>
                    <span class="amount">${formatCurrency(amount)}</span>
                </div>
                <div class="summary-item">
                    <span>Saldo Saat ini:</span>
                    <span>${formatCurrency(finalBalance)}</span>
                </div>
            </div>
        </div>
    `;
};