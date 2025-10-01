import axios from 'axios';
import { Transaction } from '../types/Transaction';

const API_BASE_URL = 'http://localhost:8080/api';

class TransactionService {
    private getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    async getAllTransactions(): Promise<Transaction[]> {
        try {
            const response = await axios.get(`${API_BASE_URL}/transactions`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
        }
    }

    async getTransactionsByAccount(accountNumber: string): Promise<Transaction[]> {
        try {
            const response = await axios.get(`${API_BASE_URL}/transactions/account/${accountNumber}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch account transactions');
        }
    }

    async getTransactionsByType(type: string): Promise<Transaction[]> {
        try {
            const response = await axios.get(`${API_BASE_URL}/transactions/type/${type}`, {
                headers: this.getAuthHeaders()
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch transactions by type');
        }
    }

    async getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
        try {
            const response = await axios.get(`${API_BASE_URL}/transactions/date-range`, {
                headers: this.getAuthHeaders(),
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch transactions by date range');
        }
    }

    async exportTransactions(transactions: Transaction[]): Promise<void> {
        try {
            const response = await axios.post(`${API_BASE_URL}/transactions/export`,
                { transactions },
                {
                    headers: this.getAuthHeaders(),
                    responseType: 'blob'
                }
            );

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to export transactions');
        }
    }
}

export const transactionService = new TransactionService();