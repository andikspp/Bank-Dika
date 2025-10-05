import { useState, useEffect } from 'react';
import { Customer } from '../types/Customer';
import { CustomerService } from '../api/CustomerService';

export const useCustomerDetail = (customerId: string | undefined) => {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCustomerDetails = async () => {
        if (!customerId) return;

        setLoading(true);
        setError(null);

        try {
            const data = await CustomerService.getCustomerById(customerId);
            setCustomer(data);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                'Gagal memuat detail nasabah. Silakan coba lagi.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (customerId) {
            fetchCustomerDetails();
        }
    }, [customerId]);

    return {
        customer,
        loading,
        error,
        refetch: fetchCustomerDetails
    };
};