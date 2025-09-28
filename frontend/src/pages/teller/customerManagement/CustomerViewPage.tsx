import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Customer } from "../../../types/Customer";
import axios from "axios";
import "../../../styles/viewUserPage.css";
import CustomerDetailCard from "../../../components/card/CustomerDetailCard";
import AddAccountModal from "../../../components/accountManagement/modal/AddAccountModal";
import { Account } from "../../../types/Account";
import Swal from "sweetalert2";
import AccountDetailModal from "../../../components/customerManagement/modal/DetailAccountModal";
import "../../../styles/modal.css";

const CustomerViewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddAccountModal, setShowAddAccountModal] = useState(false);
    const [newAccount, setNewAccount] = useState({
        accountType: "",
        balance: 0,
        status: "ACTIVE",
        customerId: Number(id) || 0,
    });
    const [loadingAccount, setLoadingAccount] = useState(false);
    const [showAccountDetailModal, setShowAccountDetailModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);


    useEffect(() => {
        if (id) {
            console.log("Customer ID from params:", id);
            fetchCustomerDetails(id);
        }
    }, [id]);

    const fetchCustomerDetails = async (customerId: string) => {
        try {
            console.log("Fetching details for customer ID:", customerId);
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:8080/api/customers/${customerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Fetched customer details:", response.data);
            setCustomer(response.data);
            setError(null);
        } catch (err: any) {
            console.error("Failed to fetch customer details:", err);
            const errorMessage =
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Gagal memuat detail nasabah. Silakan coba lagi.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAccount = () => {
        setShowAddAccountModal(true);
    };

    const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewAccount(acc => ({
            ...acc,
            [name]: name === "balance" ? Number(value) : value,
        }));
    };

    const handleAccountSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingAccount(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:8080/api/accounts/add", newAccount, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setShowAddAccountModal(false);
            setNewAccount({
                accountType: "",
                balance: 0,
                status: "ACTIVE",
                customerId: Number(id) || 0,
            });
            fetchCustomerDetails(id!);
            Swal.fire("Berhasil!", "Rekening berhasil ditambahkan.", "success");
        } catch (err: any) {
            alert("Gagal menambah rekening.");
        } finally {
            setLoadingAccount(false);
        }
    };

    const handleDeleteAccount = (accountId: number) => {
        Swal.fire({
            title: 'Yakin ingin menghapus rekening ini?',
            text: "Tindakan ini tidak dapat dibatalkan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem("token");
                    await axios.delete(`http://localhost:8080/api/accounts/${accountId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    fetchCustomerDetails(id!);
                    Swal.fire('Dihapus!', 'Rekening telah dihapus.', 'success');
                } catch (err: any) {
                    Swal.fire('Gagal!', 'Gagal menghapus rekening.', 'error');
                }
            }
        }
        );
    };

    const handleToggleAccountStatus = async (accountId: number, currentStatus: string) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        const actionText = newStatus === 'ACTIVE' ? 'mengaktifkan' : 'menonaktifkan';

        const result = await Swal.fire({
            title: `Yakin ingin ${actionText} rekening ini?`,
            text: `Status rekening akan diubah menjadi ${newStatus === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: newStatus === 'ACTIVE' ? '#10b981' : '#f59e0b',
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Ya, ${actionText}!`,
            cancelButtonText: 'Batal'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem("token");
                await axios.patch(`http://localhost:8080/api/accounts/${accountId}/status`,
                    { status: newStatus },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                fetchCustomerDetails(id!);
                Swal.fire(
                    'Berhasil!',
                    `Rekening berhasil di${actionText}.`,
                    'success'
                );
            } catch (err: any) {
                Swal.fire(
                    'Gagal!',
                    `Gagal ${actionText} rekening.`,
                    'error'
                );
            }
        }
    };

    const handleShowAccountDetail = (account: Account) => {
        setSelectedAccount(account);
        setShowAccountDetailModal(true);
    };

    const handleCloseAccountDetailModal = () => {
        setShowAccountDetailModal(false);
        setSelectedAccount(null);
    };

    // Loading State
    if (loading) {
        return (
            <div className="view-user-page">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Memuat data nasabah...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="view-user-page">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h3>Terjadi Kesalahan</h3>
                    <p>{error}</p>
                    <div className="error-actions">
                        <button className="btn btn-primary" onClick={() => fetchCustomerDetails(id!)}>
                            🔄 Coba Lagi
                        </button>
                        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                            ← Kembali
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Customer Not Found State
    if (!customer) {
        return (
            <div className="view-user-page">
                <div className="page-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        ← Kembali
                    </button>
                    <div className="header-content">
                        <h1>👤 Detail Nasabah</h1>
                        <p>Data nasabah tidak ditemukan</p>
                    </div>
                </div>

                <div className="empty-customer-container">
                    <div className="empty-state">
                        <div className="empty-icon">😕</div>
                        <h3>Nasabah Tidak Ditemukan</h3>
                        <p>Data nasabah dengan ID tersebut tidak ditemukan dalam sistem.</p>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate(-1)}
                        >
                            ← Kembali ke Daftar Nasabah
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Main Content with Customer Data
    return (
        <div className="view-user-page">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Kembali
                </button>
                <div className="header-content">
                    <h1>👤 Detail Nasabah</h1>
                    <p>Informasi lengkap data nasabah - {customer.fullName}</p>
                </div>
                <div className="header-actions">
                    <div className="header-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => fetchCustomerDetails(id!)}
                        >
                            <span className="btn-icon">🔄</span>
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="content-grid">
                <CustomerDetailCard
                    customer={customer}
                    showAddAccountButton={true}
                    onAddAccount={handleAddAccount}
                    onDeleteAccount={handleDeleteAccount}
                    onToggleAccountStatus={handleToggleAccountStatus}
                    onShowAccountDetail={handleShowAccountDetail}
                />
            </div>

            {/* Add Account Modal */}
            {showAddAccountModal && (
                <AddAccountModal
                    open={showAddAccountModal}
                    onClose={() => setShowAddAccountModal(false)}
                    onSubmit={handleAccountSubmit}
                    onChange={handleAccountChange}
                    newAccount={newAccount}
                    loading={loadingAccount}
                    hideCustomerIdInput
                />
            )}

            {showAccountDetailModal && (
                <AccountDetailModal
                    open={showAccountDetailModal}
                    account={selectedAccount}
                    onClose={handleCloseAccountDetailModal}
                />
            )}
        </div>
    );
};

export default CustomerViewPage;