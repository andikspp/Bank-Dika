import axios from 'axios';
import { Customer } from '../types/Customer';

const API_BASE_URL = 'http://localhost:8080/api';

export class CustomerService {
    private static getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    static async getAllCustomers(): Promise<Customer[]> {
        const response = await axios.get(`${API_BASE_URL}/customers`, {
            headers: this.getAuthHeaders()
        });
        return response.data;
    }

    static async getCustomerById(customerId: string): Promise<Customer> {
        const response = await axios.get(`${API_BASE_URL}/customers/${customerId}`, {
            headers: this.getAuthHeaders()
        });
        return response.data;
    }
}