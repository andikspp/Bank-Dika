import { useState } from 'react';
import { Customer } from '../types/Customer';
import { CustomerService } from '../api/CustomerService';

export const useCustomers = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCustomers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await CustomerService.getAllCustomers();
            setCustomers(data);
        } catch (err) {
            setError("Gagal memuat data nasabah. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return { customers, loading, error, fetchCustomers };
};