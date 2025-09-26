import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Customer } from "../../../types/Customer";
import CustomerTable from "../../../components/customerManagement/CustomerTable";
import EditCustomerModal from '../../../components/customerManagement/modal/EditCustomerModal';
import "../../../styles/customerManagementPage.css";

const CustomerManagementPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8080/api/customers", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCustomers(res.data);
            setError(null);
        } catch (err) {
            setError("Gagal memuat data nasabah. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchCustomers();
    };

    const handleEditCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        setSelectedCustomer(null);
    };

    const handleEditSuccess = () => {
        fetchCustomers();
        handleCloseModal();
    };

    return (
        <div className="customer-management-container">
            <div className="page-header">
                <div className="header-content">
                    <h1>Manajemen Nasabah</h1>
                    <button
                        className="refresh-button"
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        {loading ? "Memuat..." : "Muat Ulang"}
                    </button>
                </div>
                <p className="header-subtitle">Kelola data nasabah.</p>
            </div>

            <div className="customer-table-container">
                {error && <div className="error-message">{error}</div>}
                {loading && <div className="loading-spinner"></div>}

                {/* Hanya satu CustomerTable */}
                {!loading && !error && (
                    <CustomerTable
                        customers={customers}
                        onEdit={handleEditCustomer}
                    />
                )}
            </div>

            {/* Modal hanya di-render jika diperlukan */}
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