import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Customer } from "../../../types/Customer";
import { useCustomers } from "../../../hooks/useCustomers";
import { filterCustomers } from "../../../utils/customerFilters";
import { MESSAGES } from "../../../constants/messages";

import CustomerHeader from "../../../components/customerManagement/CustomerHeader";
import CustomerSearch from "../../../components/customerManagement/CustomerSearch";
import CustomerTable from "../../../components/customerManagement/CustomerTable";
import EditCustomerModal from '../../../components/customerManagement/modal/EditCustomerModal';
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import EmptyState from "../../../components/ui/EmptyState";

import "../../../styles/customerManagementPage.css";

const CustomerManagementPage: React.FC = () => {
    const { customers, loading, error, fetchCustomers } = useCustomers();
    const [searchTerm, setSearchTerm] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    // Memoized filtered customers
    const filteredCustomers = useMemo(() =>
        filterCustomers(customers, searchTerm),
        [customers, searchTerm]
    );

    // Load data on mount
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Event handlers
    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
    }, []);

    const handleEditCustomer = useCallback((customer: Customer) => {
        setSelectedCustomer(customer);
        setShowEditModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowEditModal(false);
        setSelectedCustomer(null);
    }, []);

    const handleEditSuccess = useCallback(() => {
        fetchCustomers();
        handleCloseModal();
    }, [fetchCustomers, handleCloseModal]);

    // Render helpers
    const renderContent = () => {
        if (loading) {
            return <LoadingSpinner message={MESSAGES.LOADING} />;
        }

        if (error) {
            return (
                <ErrorMessage
                    message={error}
                    onRetry={fetchCustomers}
                />
            );
        }

        if (filteredCustomers.length === 0) {
            return (
                <EmptyState
                    icon="👤"
                    title={MESSAGES.NO_CUSTOMERS}
                    description={
                        searchTerm
                            ? MESSAGES.NO_SEARCH_RESULTS
                            : MESSAGES.NO_REGISTERED_CUSTOMERS
                    }
                />
            );
        }

        return (
            <div className="table-container">
                <CustomerTable
                    customers={filteredCustomers}
                    onEdit={handleEditCustomer}
                    onDelete={fetchCustomers}
                />
            </div>
        );
    };

    return (
        <div className="customer-management-container">
            <CustomerHeader
                onRefresh={fetchCustomers}
                isLoading={loading}
            />

            <CustomerSearch
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
                totalCustomers={customers.length}
                filteredCount={filteredCustomers.length}
                isLoading={loading}
            />

            <div className="content-section">
                {renderContent()}
            </div>

            {showEditModal && selectedCustomer && (
                <EditCustomerModal
                    open={showEditModal}
                    onClose={handleCloseModal}
                    customer={selectedCustomer}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    );
};

export default CustomerManagementPage;