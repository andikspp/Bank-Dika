import Swal from 'sweetalert2';

import { formatCurrency } from './formatters';

/**
 * Show a success alert
 * @param title 
 * @param text 
 * @returns 
 */
export const showSuccess = (title: string, text: string) => {
    return Swal.fire(title, text, "success");
};

/**
 * Show an error alert
 * @param title 
 * @param text 
 * @returns 
 */
export const showError = (title: string, text: string) => {
    return Swal.fire(title, text, "error");
};

/**
 * show a warning alert
 * @param title 
 * @param text 
 * @param confirmText 
 * @param cancelText 
 * @param confirmColor 
 * @returns 
 */
export const showConfirmation = async (
    title: string,
    text: string,
    confirmText: string,
    cancelText: string,
    confirmColor: string = '#d33'
): Promise<boolean> => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: confirmColor,
        cancelButtonColor: '#3085d6',
        confirmButtonText: confirmText,
        cancelButtonText: cancelText
    });

    return result.isConfirmed;
};

/*-------Alert for withdrawal transactions-------*/

export const showWithdrawalConfirmation = async (
    accountNumber: string,
    customerName: string,
    status: string,
    amount: number,
    currentBalance: number
): Promise<boolean> => {
    const result = await Swal.fire({
        title: '💸 Konfirmasi Penarikan Tunai',
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
                        <span style="font-weight: 500; color: #64748b;">Saldo Saat Ini:</span>
                        <span style="font-weight: 600; color: #1e293b;">${formatCurrency(currentBalance)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                        <span style="font-weight: 500; color: #64748b;">Jumlah Penarikan:</span>
                        <span style="font-weight: 700; color: #dc2626; font-size: 16px;">${formatCurrency(amount)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px 0; background: #fef2f2; margin: 8px -16px -16px; padding: 16px; border-radius: 0 0 8px 8px;">
                        <span style="font-weight: 600; color: #7f1d1d;">Saldo Setelah Penarikan:</span>
                        <span style="font-weight: 700; color: #dc2626; font-size: 18px;">${formatCurrency(currentBalance - amount)}</span>
                    </div>
                </div>
                <div style="background: #fef3c7; padding: 12px; border-radius: 6px; border-left: 4px solid #f59e0b; margin-top: 16px;">
                    <small style="color: #92400e; font-weight: 500;">⚠️ Pastikan nasabah membawa identitas yang valid</small>
                </div>
            </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '✅ Ya, Tarik Sekarang',
        cancelButtonText: '❌ Batal',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        width: '500px',
        customClass: {
            popup: 'withdrawal-confirmation-popup'
        }
    });

    return result.isConfirmed;
};

export const showWithdrawalSuccess = async (amount: number, remainingBalance: number) => {
    return Swal.fire({
        title: '🎉 Berhasil!',
        html: `
            <div class="success-detail">
                <p>Penarikan tunai telah berhasil diproses</p>
                <div class="transaction-summary">
                    <div class="summary-item">
                        <span>Jumlah Penarikan:</span>
                        <span class="amount">${formatCurrency(amount)}</span>
                    </div>
                    <div class="summary-item">
                        <span>Saldo Tersisa:</span>
                        <span>${formatCurrency(remainingBalance)}</span>
                    </div>
                </div>
            </div>
        `,
        icon: 'success',
        confirmButtonColor: '#10b981',
        timer: 4000,
        timerProgressBar: true
    });
};

export const showInsufficientBalance = async (amount: number, balance: number) => {
    return Swal.fire({
        title: '❌ Saldo Tidak Mencukupi!',
        html: `
            <div style="text-align: left; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <div style="background: #fef2f2; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #fecaca;">
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #fecaca;">
                        <span style="font-weight: 500; color: #64748b;">Saldo Tersedia:</span>
                        <span style="font-weight: 600; color: #1e293b;">${formatCurrency(balance)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                        <span style="font-weight: 500; color: #64748b;">Jumlah Penarikan:</span>
                        <span style="font-weight: 700; color: #dc2626; font-size: 16px;">${formatCurrency(amount)}</span>
                    </div>
                </div>
                <div style="background: #fef3c7; padding: 12px; border-radius: 6px; border-left: 4px solid #f59e0b; margin-top: 16px;">
                    <small style="color: #92400e; font-weight: 500;">💡 Silakan cek saldo atau kurangi jumlah penarikan</small>
                </div>
            </div>
        `,
        icon: 'error',
        confirmButtonColor: '#ef4444'
    });
};


