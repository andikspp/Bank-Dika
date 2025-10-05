import { Customer } from '../types/Customer';

export const filterCustomers = (customers: Customer[], searchTerm: string): Customer[] => {
    if (!searchTerm.trim()) return customers;

    const lowercaseSearch = searchTerm.toLowerCase();

    return customers.filter(customer =>
        customer.fullName.toLowerCase().includes(lowercaseSearch) ||
        customer.email?.toLowerCase().includes(lowercaseSearch) ||
        customer.phone?.toLowerCase().includes(lowercaseSearch) ||
        customer.ktpNumber?.toLowerCase().includes(lowercaseSearch)
    );
};