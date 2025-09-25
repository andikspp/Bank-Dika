import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../styles/userManagementPage.css";
import { User } from "../../../types/User";
import UserTable from "../../../components/userManagement/UserTable";
import AddUserModal from "../../../components/userManagement/modal/AddUserModal";
import EditUserModal from "../../../components/userManagement/modal/EditUserModal";

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);


    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(
            user =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.roleName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [users, searchTerm]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:8080/api/users/customers-tellers", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(res.data);
            setError(null);
        } catch (err) {
            setError("Gagal memuat data user. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchUsers();
    };

    return (
        <div className="user-management-container">
            {/* Header Section */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-title">
                        <span className="header-icon">👥</span>
                        <h1>Manajemen User</h1>
                    </div>
                    <p className="header-subtitle">
                        Kelola data user Bank Dika untuk keperluan autentikasi dan otorisasi.
                    </p>
                </div>
                <div className="header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        <span className="btn-icon">🔄</span>
                        Refresh
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowAddModal(true)}
                    >
                        <span className="btn-icon">➕</span>
                        Tambah User
                    </button>
                </div>
            </div>

            {/* Search Section */}
            <div className="search-section">
                <div className="search-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Cari berdasarkan username atau role..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="results-info">
                    {!loading && (
                        <span>
                            Menampilkan {filteredUsers.length} dari {users.length} user
                        </span>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="content-section">
                {loading && (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Memuat data user...</p>
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
                        {filteredUsers.length === 0 ? (
                            <div className="empty-state">
                                <span className="empty-icon">👥</span>
                                <h3>Tidak ada user ditemukan</h3>
                                <p>
                                    {searchTerm
                                        ? "Coba ubah kata kunci pencarian Anda"
                                        : "Belum ada user yang terdaftar"
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="table-container">
                                <UserTable
                                    users={filteredUsers}
                                    onDelete={fetchUsers}
                                    onEdit={(user) => {
                                        setSelectedUser(user);
                                        setShowEditModal(true);
                                    }}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
            <AddUserModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={handleRefresh}
            />
            <EditUserModal
                open={showEditModal}
                onClose={() => setShowEditModal(false)}
                user={selectedUser}
                onSuccess={fetchUsers}
            />
        </div>
    );
};

export default UserManagementPage;