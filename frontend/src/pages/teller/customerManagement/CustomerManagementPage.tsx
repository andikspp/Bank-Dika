import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Customer } from "../../../types/Customer";
import CustomerTable from "../../../components/customerManagement/CustomerTable";
import EditCustomerModal from '../../../components/customerManagement/modal/EditCustomerModal';
import "../../../styles/customerManagementPage.css";

const CustomerManagementPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        const filtered = customers.filter(
            customer =>
                customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.ktpNumber?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCustomers(filtered);
    }, [customers, searchTerm]);

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
            {/* Header Section */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-title">
                        <span className="header-icon">👤</span>
                        <h1>Manajemen Nasabah</h1>
                    </div>
                    <p className="header-subtitle">
                        Kelola data nasabah Bank Dika untuk keperluan layanan perbankan.
                    </p>
                </div>
                <div className="header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        <span className={`btn-icon ${loading ? 'spinning' : ''}`}>🔄</span>
                        {loading ? "Memuat..." : "Refresh"}
                    </button>
                </div>
            </div>

            {/* Search Section */}
            <div className="search-section">
                <div className="search-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nama, email, telepon, atau nomor KTP..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="results-info">
                    {!loading && (
                        <span>
                            Menampilkan {filteredCustomers.length} dari {customers.length} nasabah
                        </span>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="content-section">
                {loading && (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Memuat data nasabah...</p>
                    </div>
                )}

                {error && (
                    <div className="error-container">
                        <div className="error-content">
                            <h3>Oops! Terjadi kesalahan</h3>
                            <p>{error}</p>
                            <button className="btn btn-primary" onClick={handleRefresh}>
                                Coba Lagi
                            </button>
                        </div>
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {filteredCustomers.length === 0 ? (
                            <div className="empty-state">
                                <span className="empty-icon">👤</span>
                                <h3>Tidak ada nasabah ditemukan</h3>
                                <p>
                                    {searchTerm
                                        ? "Coba ubah kata kunci pencarian Anda"
                                        : "Belum ada nasabah yang terdaftar"
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="table-container">
                                <CustomerTable
                                    customers={filteredCustomers}
                                    onEdit={handleEditCustomer}
                                    onDelete={fetchCustomers}
                                />
                            </div>
                        )}
                    </>
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