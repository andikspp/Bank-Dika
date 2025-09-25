import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Customer } from "../../../types/Customer";
import { User } from "../../../types/User";
import { Account } from "../../../types/Account";
import axios from "axios";
import "../../../styles/viewUserPage.css";
import AddAccountModal from "../../../components/accountManagement/modal/AddAccountModal";
import Swal from "sweetalert2";

const ViewUserPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [Accounts, setAccounts] = useState<Account[]>([]);
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

    // debug isi id customer
    console.log("Customer ID:", customer?.id);

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
            setUser(response.data.user); // Assuming the API returns user details within customer data
            setAccounts(response.data.accounts || []);
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
            // debug data customer baru
            alert(JSON.stringify(newCustomerData));
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
            fetchCustomerDetails(id!); // Refresh customer details
        } catch (err) {
            console.error("Failed to create customer:", err);
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
            fetchCustomerDetails(id!); // Refresh data rekening
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

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

    if (error) {
        return (
            <div className="view-user-page">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h3>Terjadi Kesalahan</h3>
                    <p>{error}</p>
                    <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    // Jika customer belum ada (semua field null)
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
                </div>

                <div className="empty-customer-container">
                    <div className="empty-state">
                        <div className="empty-icon">📝</div>
                        <h3>Data Customer Belum Ada</h3>
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

    return (
        <div className="view-user-page">
            <div className="page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Kembali
                </button>
                <div className="header-content">
                    <h1>👤 Detail Customer</h1>
                    <p>Informasi lengkap data customer</p>
                </div>
            </div>

            <div className="content-grid">

                {/* Customer Info Card */}
                <div className="info-card full-width">
                    <div className="card-header">
                        <h3>👨‍💼 Data Customer</h3>
                    </div>
                    <div className="card-content">
                        <div className="info-item">
                            <span className="label">Nama Lengkap</span>
                            <span className="value">{customer?.fullName}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Email</span>
                            <span className="value">{customer?.email}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">No. Telepon</span>
                            <span className="value">{customer?.phone || "-"}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">No. KTP</span>
                            <span className="value">{customer?.ktpNumber}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Alamat</span>
                            <span className="value">{customer?.address || "-"}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Tanggal Registrasi</span>
                            <span className="value">{formatDate(customer?.registrationDate!)}</span>
                        </div>
                    </div>
                </div>

                {/* Accounts Card */}
                <div className="info-card full-width">
                    <div className="card-header">
                        <h3>💳 Rekening ({customer?.accounts?.length || 0})</h3>
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={() => setShowAddAccountModal(true)}
                        >
                            ➕ Tambah Rekening
                        </button>
                    </div>
                    <div className="card-content">
                        {customer?.accounts && customer.accounts.length > 0 ? (
                            <div className="accounts-grid">
                                {customer.accounts.map((account) => (
                                    <div key={account.id} className="account-card">
                                        <div className="account-header">
                                            <span className="account-type">
                                                {account.accountType === 'SAVINGS' ? '💰' : '🏦'}
                                                {account.accountType === 'SAVINGS' ? 'Tabungan' : 'Giro'}
                                            </span>
                                            <span className={`status-badge ${account.status.toLowerCase()}`}>
                                                {account.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </div>
                                        <div className="account-number">
                                            {account.accountNumber}
                                        </div>
                                        <div className="account-balance">
                                            {formatCurrency(account.balance)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-accounts">
                                <div className="empty-icon">💳</div>
                                <p>Belum ada rekening</p>
                                <small>Customer ini belum memiliki rekening bank</small>
                            </div>
                        )}
                    </div>
                </div>
            </div>
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
        </div>
    );
};

export default ViewUserPage;