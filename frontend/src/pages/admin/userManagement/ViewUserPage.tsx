import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Customer } from "../../../types/Customer";
import { User } from "../../../types/User";
import { Account } from "../../../types/Account";
import axios from "axios";
import "../../../styles/viewUserPage.css";
import AddAccountModal from "../../../components/accountManagement/modal/AddAccountModal";
import CustomerDetailCard from "../../../components/card/CustomerDetailCard";
import AccountDetailModal from "../../../components/customerManagement/modal/DetailAccountModal";
import "../../../styles/modal.css";
import Swal from "sweetalert2";

const ViewUserPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newCustomerData, setNewCustomerData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        ktpNumber: ""
    });
    const [newAccount, setNewAccount] = useState({
        accountType: "",
        balance: 0,
        status: "ACTIVE",
        customerId: customer?.id ?? 0
    });
    const [loadingAccount, setLoadingAccount] = useState(false);
    const [showAddAccountModal, setShowAddAccountModal] = useState(false);
    const [showAccountDetailModal, setShowAccountDetailModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    useEffect(() => {
        if (id && username) {
            console.log("User ID from params:", id);
            console.log("Username from params:", username);
            fetchCustomerDetails(id);
        }
    }, [id]);

    useEffect(() => {
        // Set customerId setiap kali customer berubah
        setNewAccount(acc => ({
            ...acc,
            customerId: customer?.id ?? 0,
        }));
    }, [customer]);

    const fetchCustomerDetails = async (userId: string) => {
        try {
            console.log("Fetching details for user ID:", userId);
            const response = await axios.get(`http://localhost:8080/api/users/customers/${userId}`);
            console.log("Fetched customer details:", response.data);
            setCustomer(response.data);
            setUser(response.data.user);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch user details.");
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewCustomerData({
            ...newCustomerData,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:8080/api/customers", {
                userId: id,
                customer: newCustomerData
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Created new customer:", response.data);
            setCustomer(response.data);
            setIsEditing(false);
            setError(null);
            Swal.fire("Berhasil", "Data customer berhasil dibuat.", "success");
            fetchCustomerDetails(id!);
        } catch (err) {
            console.error("Failed to create customer:", err);
            Swal.fire("Gagal", "Gagal membuat data customer.", "error");
        }
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
                customerId: customer?.id ?? 0,
            });
            Swal.fire("Berhasil", "Rekening berhasil ditambahkan.", "success");
            fetchCustomerDetails(id!);
        } catch (err: any) {
            const msg =
                err.response?.data?.message ||
                err.response?.data ||
                "Gagal menambah rekening.";
            Swal.fire("Gagal", msg, "error");
        } finally {
            setLoadingAccount(false);
        }
    };

    const handleAddAccount = () => {
        setShowAddAccountModal(true);
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
        });
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
                    <p>Memuat data user...</p>
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

    // Empty Customer State
    const isCustomerEmpty = !customer?.fullName && !customer?.email && !customer?.phone;

    if (isCustomerEmpty) {
        return (
            <div className="view-user-page">
                <div className="page-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        ← Kembali
                    </button>
                    <div className="header-content">
                        <h1>👤 Detail User</h1>
                        <p>Username: {username}</p>
                    </div>
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

                <div className="empty-customer-container">
                    <div className="empty-state">
                        <div className="empty-icon">📝</div>
                        <h3>Data Nasabah Belum Ada</h3>
                        <p>User ini belum memiliki data customer. Silakan buat data customer untuk user ini.</p>

                        {!isEditing ? (
                            <button
                                className="btn btn-primary"
                                onClick={() => setIsEditing(true)}
                            >
                                ➕ Buat Data Customer
                            </button>
                        ) : (
                            <div className="customer-form">
                                <form onSubmit={handleCreateCustomer}>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Nama Lengkap</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={newCustomerData.fullName}
                                                onChange={handleInputChange}
                                                placeholder="Masukkan nama lengkap"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={newCustomerData.email}
                                                onChange={handleInputChange}
                                                placeholder="Masukkan email"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>No. Telepon</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={newCustomerData.phone}
                                                onChange={handleInputChange}
                                                placeholder="Masukkan nomor telepon"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>No. KTP</label>
                                            <input
                                                type="text"
                                                name="ktpNumber"
                                                value={newCustomerData.ktpNumber}
                                                onChange={handleInputChange}
                                                placeholder="Masukkan nomor KTP"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Alamat</label>
                                        <textarea
                                            name="address"
                                            value={newCustomerData.address}
                                            onChange={handleInputChange}
                                            placeholder="Masukkan alamat lengkap"
                                            rows={3}
                                            required
                                        />
                                    </div>
                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Batal
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Simpan Data Customer
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
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

            <div className="content-grid">
                {/* Menggunakan CustomerDetailCard Component */}
                <CustomerDetailCard
                    customer={customer!}
                    onAddAccount={handleAddAccount}
                    showAddAccountButton={true}
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

export default ViewUserPage;