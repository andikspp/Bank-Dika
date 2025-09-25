import React from "react";
import { User } from "../../types/User";
import "../../styles/userTable.css";
import axios from "axios";
import Swal from "sweetalert2";

type UserTableProps = {
    users: User[];
    onDelete?: (userId: number) => void;
    onEdit?: (user: User) => void;
};

const handleDelete = (userId: number, onDelete?: (userId: number) => void) => async () => {
    const result = await Swal.fire({
        title: "Hapus User?",
        text: "User yang dihapus tidak dapat dikembalikan.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8080/api/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (onDelete) {
            onDelete(userId);
        }
        Swal.fire("Dihapus!", "User telah dihapus.", "success");
    } catch (err) {
        console.error("Failed to delete user:", err);
        alert("Failed to delete user.");
    }
}

const handleView = (userId: number, username: String) => () => {
    // pengecekan role user berdasarkan userId
    try {
        const token = localStorage.getItem("token");
        console.log("Token for authorization:", token);
        console.log("Fetching role for user ID:", userId);
        axios.get(`http://localhost:8080/api/users/customers/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(response => {
            const user = response.data;
            if (user.roleName === "CUSTOMER") {
                window.location.href = `/admin/users/view/${userId}/${username}`;
            } else {
                Swal.fire("Akses Ditolak", "Hanya user dengan role CUSTOMER yang dapat dilihat.", "error");
            }
        }
        ).catch(err => {
            console.error("Failed to fetch user role:", err);
            const errorMsg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to fetch user role.";
            Swal.fire("Error", errorMsg, "error");
        });
    }
    catch (err) {
        console.error("Failed to fetch user role:", err);
        Swal.fire("Error", "Failed to fetch user role.", "error");
    }
}

const handleEdit = (user: User, onEdit?: (user: User) => void) => () => {
    if (onEdit) {
        onEdit(user);
    }
}
const UserTable: React.FC<UserTableProps> = ({ users, onDelete, onEdit }) => (
    <div className="table-wrapper">
        <div className="table-container">
            <table className="modern-table" style={{ tableLayout: "fixed", width: "100%" }}>
                <thead>
                    <tr>
                        <th style={{ width: "60px" }}>
                            <span className="th-content">No</span>
                        </th>
                        <th style={{ width: "100px" }}>
                            <span className="th-content">
                                <span className="th-icon">👤</span>
                                Username
                            </span>
                        </th>
                        <th style={{ width: "120px" }}>
                            <span className="th-content">
                                <span className="th-icon">🏷️</span>
                                Role
                            </span>
                        </th>
                        <th style={{ width: "120px" }}>
                            <span className="th-content">Actions</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id} className="table-row">
                            <td style={{ width: "60px", textAlign: "left" }}>
                                <div className="number-badge">{index + 1}</div>
                            </td>
                            <td style={{ width: "200px", paddingLeft: "16px" }}>
                                <div className="user-info">
                                    <div className="user-avatar">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="username-text">{user.username}</div>
                                </div>
                            </td>
                            <td style={{ width: "120px" }}>
                                <span className={`role-badge role-${user.roleName.toLowerCase()}`}>
                                    {user.roleName}
                                </span>
                            </td>
                            <td style={{ width: "120px" }}>
                                <div className="action-buttons" style={{ width: "120px" }}>
                                    <button className="action-btn view-btn" title="View" onClick={handleView(user.id, user.username)}>
                                        👁️
                                    </button>
                                    <button
                                        className="action-btn edit-btn"
                                        title="Edit"
                                        onClick={handleEdit(user, onEdit)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="action-btn delete-btn"
                                        title="Delete"
                                        onClick={handleDelete(user.id, onDelete)}
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

        {/* Mobile Card View */}
        <div className="mobile-cards">
            {users.map((user, index) => (
                <div key={user.id} className="mobile-card">
                    <div className="card-header">
                        <div className="user-info-mobile">
                            <div className="user-avatar-mobile">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-details">
                                <h3 className="username-mobile">{user.username}</h3>
                                <span className={`role-badge-mobile role-${user.roleName.toLowerCase()}`}>
                                    {user.roleName}
                                </span>
                            </div>
                        </div>
                        <div className="card-number">#{index + 1}</div>
                    </div>

                    <div className="card-actions">
                        <button className="mobile-action-btn view-btn">👁️ View</button>
                        <button className="mobile-action-btn edit-btn">✏️ Edit</button>
                        <button className="mobile-action-btn delete-btn" onClick={() => handleDelete(user.id)}>🗑️ Delete</button>
                    </div>
                </div>
            ))}
        </div>
    </div >
);

export default UserTable;