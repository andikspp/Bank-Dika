import { useState } from 'react';
import { TransferFormData, AccountInfo } from '../types/Transfer';

export const useTransferForm = () => {
    const [formData, setFormData] = useState<TransferFormData>({
        fromAccountNumber: '',
        toAccountNumber: '',
        amount: 0,
        description: '',
        transferType: 'internal'
    });

    const [fromAccountInfo, setFromAccountInfo] = useState<AccountInfo | null>(null);
    const [toAccountInfo, setToAccountInfo] = useState<AccountInfo | null>(null);
    const [loading, setLoading] = useState(false);

    const updateFormData = (field: keyof TransferFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormData({
            fromAccountNumber: '',
            toAccountNumber: '',
            amount: 0,
            description: '',
            transferType: 'internal'
        });
        setFromAccountInfo(null);
        setToAccountInfo(null);
    };

    return {
        formData,
        updateFormData,
        fromAccountInfo,
        setFromAccountInfo,
        toAccountInfo,
        setToAccountInfo,
        loading,
        setLoading,
        resetForm
    };
};