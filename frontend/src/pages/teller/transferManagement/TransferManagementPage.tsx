import React from 'react';
import { TransferService } from '../../../api/TransferService';
import { TransferValidator } from '../../../utils/validators';
import { TransferAlerts } from '../../../utils/alerts';
import { TransferForm } from '../../../components/transferComponent/TransferForm';
import { TransferSecurityNotice } from '../../../components/ui/SecurityNotice';
import { useTransferForm } from '../../../hooks/useTransferForm';
import { TRANSFER_MESSAGES } from '../../../constants/messages';
import { AccountInfo } from '../../../types/Transfer';
import '../../../styles/transferManagementPage.css';

const TransferManagementPage: React.FC = () => {
    const {
        formData,
        updateFormData,
        fromAccountInfo,
        setFromAccountInfo,
        toAccountInfo,
        setToAccountInfo,
        loading,
        setLoading,
        resetForm
    } = useTransferForm();

    const fetchAccountInfo = async (): Promise<{ fromAccount: AccountInfo; toAccount: AccountInfo }> => {
        const fromAccount = await TransferService.findAccount(formData.fromAccountNumber);
        const toAccount = await TransferService.findAccount(formData.toAccountNumber);

        // Update state untuk UI
        setFromAccountInfo(fromAccount);
        setToAccountInfo(toAccount);

        // Return untuk validasi langsung
        return { fromAccount, toAccount };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        const validationError = TransferValidator.validateTransferForm(
            formData.amount,
            formData.fromAccountNumber,
            formData.toAccountNumber
        );

        if (validationError) {
            await TransferAlerts.showWarning('Peringatan!', validationError);
            return;
        }

        setLoading(true);

        try {
            // Fetch account information dan dapatkan data langsung
            const { fromAccount, toAccount } = await fetchAccountInfo();

            // Advanced validation dengan data yang baru di-fetch
            const advancedValidationError = TransferValidator.validateTransferForm(
                formData.amount,
                formData.fromAccountNumber,
                formData.toAccountNumber,
                fromAccount, // Gunakan data langsung, bukan state
                toAccount    // Gunakan data langsung, bukan state
            );

            if (advancedValidationError) {
                if (advancedValidationError === TRANSFER_MESSAGES.INSUFFICIENT_BALANCE) {
                    await TransferAlerts.showInsufficientBalance(formData.amount, fromAccount.balance);
                } else {
                    await TransferAlerts.showError('❌ Gagal!', advancedValidationError);
                }
                return;
            }

            // Show confirmation dengan data yang tepat
            const confirmation = await TransferAlerts.showTransferConfirmation(
                formData.fromAccountNumber,
                formData.toAccountNumber,
                fromAccount,
                toAccount,
                formData.amount,
                formData.transferType,
                formData.description
            );

            if (!confirmation.isConfirmed) return;

            // Process transfer
            await TransferService.processTransfer(formData);

            // Show success message
            await TransferAlerts.showSuccess(
                formData.amount,
                formData.fromAccountNumber,
                formData.toAccountNumber,
                fromAccount.customerName,
                toAccount.customerName,
                fromAccount.balance - formData.amount
            );

            // Reset form
            resetForm();

        } catch (error: any) {
            let errorMessage: string = TRANSFER_MESSAGES.TRANSFER_ERROR;

            if (error.message === 'Account not found') {
                errorMessage = TRANSFER_MESSAGES.ACCOUNT_NOT_FOUND;
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            await TransferAlerts.showError('❌ Gagal!', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="transfer-page">
            <div className="transfer-container">
                {/* Header Section */}
                <div className="transfer-header">
                    <div className="header-icon">🏦</div>
                    <h1 className="header-title">Transfer Antar Rekening</h1>
                    <p className="header-subtitle">Proses transfer dengan verifikasi keamanan</p>
                </div>

                {/* Form Section */}
                <TransferForm
                    formData={formData}
                    onFormDataChange={updateFormData}
                    fromAccountInfo={fromAccountInfo}
                    toAccountInfo={toAccountInfo}
                    loading={loading}
                    onSubmit={handleSubmit}
                />

                {/* Security Notice */}
                <TransferSecurityNotice />
            </div>
        </div>
    );
};

export default TransferManagementPage;