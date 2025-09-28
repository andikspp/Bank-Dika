import React, { useEffect, useState } from "react";
import axios from "axios";
import { Account } from "../../../types/Account";
import "../../../styles/accountManagementPage.css";
import "../../../styles/modal.css";
import AddAccountModal from "../../../components/accountManagement/modal/AddAccountModal";
import AccountDetailModal from "../../../components/customerManagement/modal/DetailAccountModal";
import Swal from "sweetalert2";

const AccountManagementPage: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [customers, setCustomers] = useState<{ id: number; fullName: string }[]>([]);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    // State untuk tambah rekening
    const [newAccount, setNewAccount] = useState({
        accountType: "",
        balance: 0,
        status: "ACTIVE",
        customerId: 0
    });

    useEffect(() => {
        fetchAccounts();
        fetchCustomers();
    }, []);



    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8080/api/accounts");
            setAccounts(res.data);
            setLoading(false);
        } catch (err) {
            setError("Gagal mengambil data rekening.");
            setLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/customers");
            // debug data customers
            console.log("Fetched customers for dropdown add rekening:", res.data);
            setCustomers(res.data.map((c: any) => ({
                id: c.id,
                fullName: c.fullName
            })));
        } catch {
            setCustomers([]);
        }
    };

    const handleDelete = async (id: number) => {
        const confirm = await Swal.fire({
            title: 'Yakin ingin menghapus rekening ini?',
            text: "Tindakan ini tidak dapat dibatalkan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        });
        if (confirm.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8080/api/accounts/${id}`);
                setAccounts(accounts.filter(acc => acc.id !== id));
                Swal.fire('Terhapus!', 'Rekening berhasil dihapus.', 'success');
            } catch (err) {
                Swal.fire('Error', 'Gagal menghapus rekening.', 'error');
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewAccount({ ...newAccount, [e.target.name]: e.target.value });
    };

    const handleAddAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8080/api/accounts/add", newAccount);
            setAccounts([...accounts, res.data]);
            setNewAccount({
                accountType: "",
                balance: 0,
                status: "",
                customerId: 0
            });
            setShowAddForm(false);
            Swal.fire("Sukses", "Rekening berhasil ditambahkan.", "success");
        } catch (err: any) {
            Swal.fire("Error", err.response?.data?.message || "Gagal menambahkan rekening.", "error");
        }
    };

    const handleToggleStatus = async (accountId: number, currentStatus: string) => {
        try {
            const confirm = await Swal.fire({
                title: 'Ubah Status Rekening',
                text: `Yakin ingin mengubah status rekening ini menjadi ${currentStatus === "ACTIVE" ? "Nonaktif" : "Aktif"}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Ya, ubah',
                cancelButtonText: 'Batal'
            });
            if (!confirm.isConfirmed) return;

            const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
            await axios.patch(
                `http://localhost:8080/api/accounts/${accountId}/status`,
                { status: newStatus },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            setAccounts(accounts =>
                accounts.map(acc =>
                    acc.id === accountId ? { ...acc, status: newStatus } : acc
                )
            );
            Swal.fire("Sukses", `Status rekening diubah menjadi ${newStatus === "ACTIVE" ? "Aktif" : "Nonaktif"}.`, "success");
        } catch (err) {
            Swal.fire("Error", "Gagal mengubah status rekening.", "error");
        }
    };


    const filteredAccounts = accounts.filter(account =>
        account.accountNumber.toString().includes(searchTerm) ||
        account.accountType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (account.customerName && account.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const formatBalance = (balance: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(balance);
    };

    const getStatusBadge = (status: string) => {
        return (
            <span className={`status-badge ${status.toLowerCase()}`}>
                {status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
            </span>
        );
    };

    const getAccountTypeIcon = (type: string) => {
        return type === 'SAVINGS' ? '💰' : '🏦';
    };

    const handleShowDetail = (account: Account) => {
        setSelectedAccount(account);
        setShowDetailModal(true);
    };

    return (
        <div className="account-management-container">
            {/* Header Section - Updated to match UserManagement style */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-title">
                        <span className="header-icon">🏦</span>
                        <h1>Manajemen Rekening</h1>
                    </div>
                    <p className="header-subtitle">
                        Kelola semua rekening nasabah Bank Dika dengan mudah dan efisien.
                    </p>
                </div>
                <div className="header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={fetchAccounts}
                        disabled={loading}
                    >
                        <span className={`btn-icon ${loading ? 'spinning' : ''}`}>🔄</span>
                        {loading ? "Memuat..." : "Refresh"}
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        <span className="btn-icon">➕</span>
                        Tambah Rekening
                    </button>
                </div>
            </div>

            {/* Search Bar - Updated to match UserManagement style */}
            <div className="search-section">
                <div className="search-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Cari berdasarkan nomor rekening, jenis, atau nama nasabah..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="results-info">
                    {!loading && (
                        <span>
                            Menampilkan {filteredAccounts.length} dari {accounts.length} rekening
                        </span>
                    )}
                </div>
            </div>

            {/* Content Section - Wrap existing content */}
            <div className="content-section">
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Memuat data rekening...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <div className="error-content">
                            <h3>Oops! Terjadi kesalahan</h3>
                            <p>{error}</p>
                            <button className="btn btn-primary" onClick={fetchAccounts}>
                                Coba Lagi
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">📊</div>
                                <div className="stat-content">
                                    <h3>{accounts.length}</h3>
                                    <p>Total Rekening</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">✅</div>
                                <div className="stat-content">
                                    <h3>{accounts.filter(acc => acc.status === 'ACTIVE').length}</h3>
                                    <p>Rekening Aktif</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">💰</div>
                                <div className="stat-content">
                                    <h3>{accounts.filter(acc => acc.accountType === 'SAVINGS').length}</h3>
                                    <p>Tabungan</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">🏦</div>
                                <div className="stat-content">
                                    <h3>{accounts.filter(acc => acc.accountType === 'CURRENT').length}</h3>
                                    <p>Giro</p>
                                </div>
                            </div>
                        </div>

                        {/* Accounts Table */}
                        <div className="table-container">
                            <div className="table-header">
                                <h3>Daftar Rekening</h3>
                                <span className="result-count">
                                    Menampilkan {filteredAccounts.length} dari {accounts.length} rekening
                                </span>
                            </div>

                            {filteredAccounts.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">🔍</div>
                                    <h3>Tidak ada rekening ditemukan</h3>
                                    <p>Coba ubah kata kunci pencarian atau tambah rekening baru</p>
                                </div>
                            ) : (
                                <div className="table-wrapper">
                                    <table className="accounts-table">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>No Rekening</th>
                                                <th>Jenis</th>
                                                <th>Saldo</th>
                                                <th>Status</th>
                                                <th>Nasabah</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredAccounts.map(acc => (
                                                <tr key={acc.id}>
                                                    <td>{accounts.findIndex(a => a.id === acc.id) + 1}</td>
                                                    <td className="account-number">
                                                        <strong>{acc.accountNumber}</strong>
                                                    </td>
                                                    <td>
                                                        <span className="account-type">
                                                            {getAccountTypeIcon(acc.accountType)} {acc.accountType === 'SAVINGS' ? 'Tabungan' : 'Giro'}
                                                        </span>
                                                    </td>
                                                    <td className="balance">
                                                        {formatBalance(acc.balance)}
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                            <span className={`status-badge ${acc.status.toLowerCase()}`}>
                                                                {acc.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                                                            </span>
                                                            <button
                                                                className="btn btn-sm btn-toggle"
                                                                onClick={() => handleToggleStatus(acc.id, acc.status)}
                                                                title="Ubah status rekening"
                                                            >
                                                                {acc.status === "ACTIVE" ? "Nonaktifkan" : "Aktifkan"}
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td>{acc.customerName || "-"}</td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button
                                                                className="action-btn detail-btn"
                                                                title="Lihat Detail Rekening"
                                                                onClick={() => handleShowDetail(acc)}
                                                            >
                                                                🔍
                                                            </button>
                                                            <button
                                                                className="action-btn delete-btn"
                                                                title="Hapus Rekening"
                                                                onClick={() => handleDelete(acc.id)}
                                                            >
                                                                🗑️
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
            {/* Modal */}
            {showAddForm && (
                <AddAccountModal
                    open={showAddForm}
                    onClose={() => setShowAddForm(false)}
                    onSubmit={handleAddAccount}
                    onChange={handleInputChange}
                    newAccount={newAccount}
                    loading={false}
                    customers={customers}
                />
            )}

            {/* Modal Detail Rekening */}
            {showDetailModal && (
                <AccountDetailModal
                    open={showDetailModal}
                    account={selectedAccount}
                    onClose={() => setShowDetailModal(false)}
                />
            )}
        </div>
    );
};

export default AccountManagementPage;