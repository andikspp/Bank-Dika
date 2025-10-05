import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCustomerDetail } from "../../../hooks/useCustomerDetail";
import { useAccountManagement } from "../../../hooks/useAccountManagement";

import CustomerDetailHeader from "../../../components/customerManagement/CustomerDetailHeader";
import CustomerDetailCard from "../../../components/card/CustomerDetailCard";
import AddAccountModal from "../../../components/accountManagement/modal/AddAccountModal";
import AccountDetailModal from "../../../components/customerManagement/modal/DetailAccountModal";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import ErrorMessage from "../../../components/ui/ErrorMessage";
import EmptyState from "../../../components/ui/EmptyState";

import "../../../styles/viewUserPage.css";
import "../../../styles/modal.css";

const CustomerViewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { customer, loading, error, refetch } = useCustomerDetail(id);

    const accountManagement = useAccountManagement(
        Number(id) || 0,
        refetch
    );

    const handleBack = () => navigate(-1);

    // Loading State
    if (loading) {
        return (
            <div className="view-user-page">
                <LoadingSpinner
                    message="Memuat data nasabah..."
                    size="large"
                />
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="view-user-page">
                <CustomerDetailHeader onBack={handleBack} onRefresh={refetch} />
                <ErrorMessage
                    title="Terjadi Kesalahan"
                    message={error}
                    onRetry={refetch}
                    secondaryActionText="← Kembali"
                    onSecondaryAction={handleBack}
                    fullWidth
                />
            </div>
        );
    }

    // Customer Not Found State
    if (!customer) {
        return (
            <div className="view-user-page">
                <CustomerDetailHeader onBack={handleBack} onRefresh={refetch} />
                <EmptyState
                    icon="😕"
                    title="Nasabah Tidak Ditemukan"
                    description="Data nasabah dengan ID tersebut tidak ditemukan dalam sistem."
                    actionText="← Kembali ke Daftar Nasabah"
                    onAction={handleBack}
                />
            </div>
        );
    }

    // Main Content with Customer Data
    return (
        <div className="view-user-page">
            <CustomerDetailHeader
                customerName={customer.fullName}
                onBack={handleBack}
                onRefresh={refetch}
            />

            <div className="content-grid">
                <CustomerDetailCard
                    customer={customer}
                    showAddAccountButton={true}
                    onAddAccount={accountManagement.handleAddAccount}
                    onDeleteAccount={accountManagement.handleDeleteAccount}
                    onToggleAccountStatus={accountManagement.handleToggleAccountStatus}
                    onShowAccountDetail={accountManagement.handleShowAccountDetail}
                />
            </div>

            {/* Add Account Modal */}
            {accountManagement.showAddModal && (
                <AddAccountModal
                    open={accountManagement.showAddModal}
                    onClose={accountManagement.handleCloseModals}
                    onSubmit={accountManagement.handleAccountSubmit}
                    onChange={accountManagement.handleAccountChange}
                    newAccount={accountManagement.newAccount}
                    loading={accountManagement.loadingAccount}
                    hideCustomerIdInput
                />
            )}

            {/* Account Detail Modal */}
            {accountManagement.showDetailModal && (
                <AccountDetailModal
                    open={accountManagement.showDetailModal}
                    account={accountManagement.selectedAccount}
                    onClose={accountManagement.handleCloseModals}
                />
            )}
        </div>
    );
};

export default CustomerViewPage;