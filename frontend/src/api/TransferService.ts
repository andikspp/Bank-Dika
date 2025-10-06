import axios from 'axios';
import { TRANSFER_CONSTANTS } from '../constants/messages';
import { AccountInfo, TransferFormData } from '../types/Transfer';

export class TransferService {
    private static getAuthHeaders() {
        const token = localStorage.getItem("token");
        return { Authorization: `Bearer ${token}` };
    }

    static async findAccount(accountNumber: string): Promise<AccountInfo> {
        const response = await axios.get(`${TRANSFER_CONSTANTS.API_BASE_URL}/accounts/search`, {
            params: { accountNumber },
            headers: this.getAuthHeaders()
        });

        if (response.data.length === 0) {
            throw new Error('Account not found');
        }

        const account = response.data[0];
        return {
            customerName: account.customerName,
            balance: account.balance,
            status: account.status === "ACTIVE" ? "Aktif" : "Tidak Aktif"
        };
    }

    static async processTransfer(transferData: TransferFormData): Promise<void> {
        await axios.post(`${TRANSFER_CONSTANTS.API_BASE_URL}/accounts/transfer`, {
            fromAccountNumber: transferData.fromAccountNumber,
            toAccountNumber: transferData.toAccountNumber,
            amount: transferData.amount,
            description: transferData.description || "Transfer antar rekening"
        }, {
            headers: this.getAuthHeaders()
        });
    }
}