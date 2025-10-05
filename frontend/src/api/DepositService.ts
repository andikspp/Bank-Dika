import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export class DepositService {
    private static getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    static async searchAccount(accountNumber: string): Promise<any[]> {
        const response = await axios.get(`${API_BASE_URL}/accounts/search`, {
            params: { accountNumber },
            headers: this.getAuthHeaders()
        });
        return response.data;
    }

    static async processDeposit(accountNumber: string, amount: number): Promise<void> {
        await axios.post(`${API_BASE_URL}/accounts/deposit/${accountNumber}`,
            { amount },
            { headers: this.getAuthHeaders() }
        );
    }
}