import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export class AccountService {
    private static getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    static async createAccount(accountData: any): Promise<void> {
        await axios.post(`${API_BASE_URL}/accounts/add`, accountData, {
            headers: this.getAuthHeaders()
        });
    }

    static async deleteAccount(accountId: number): Promise<void> {
        await axios.delete(`${API_BASE_URL}/accounts/${accountId}`, {
            headers: this.getAuthHeaders()
        });
    }

    static async updateAccountStatus(accountId: number, status: string): Promise<void> {
        await axios.patch(`${API_BASE_URL}/accounts/${accountId}/status`,
            { status },
            { headers: this.getAuthHeaders() }
        );
    }
}