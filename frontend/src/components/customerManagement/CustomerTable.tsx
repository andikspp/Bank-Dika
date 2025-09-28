import React from 'react';
import { Customer } from "../../types/Customer";
import "../../styles/customerTable.css";
import Swal from "sweetalert2";
import axios from "axios";

interface CustomerTableProps {
    customers: Customer[];
    onDelete?: (customerId: number) => void;
    onEdit?: (customer: Customer) => void;
}

const handleDelete = (customerId: number, onDelete?: (customerId: number) => void) => async () => {
    const result = await Swal.fire({
        title: 'Apakah Anda yakin?',
        text: "Data nasabah akan dihapus secara permanen!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:8080/api/customers/${customerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (onDelete) {
                onDelete(customerId);
            }
            Swal.fire('Dihapus!', 'Data nasabah telah dihapus.', 'success');
        } catch (err) {
            console.error("Gagal menghapus nasabah:", err);
            Swal.fire('Gagal!', 'Gagal menghapus data nasabah.', 'error');
        }
    }
}

const handleView = (customer: Customer) => () => {
    window.location.href = `/teller/customers/detail/${customer.id}`;
}

const handleEdit = (customer: Customer, onEdit?: (customer: Customer) => void) => () => {
    if (onEdit) {
        onEdit(customer);
    }
}

const CustomerTable: React.FC<CustomerTableProps> = ({ customers, onEdit, onDelete }) => {
    return (
        <div className="table-wrapper">
            <div className="table-container">
                <table className="modern-table" style={{ tableLayout: "fixed", width: "100%" }}>
                    <thead>
                        <tr>
                            <th style={{ width: "60px" }}>
                                <span className="th-content">No</span>
                            </th>
                            <th style={{ width: "200px" }}>
                                <span className="th-content">
                                    <span className="th-icon">👤</span>
                                    Nama Lengkap
                                </span>
                            </th>
                            <th style={{ width: "180px" }}>
                                <span className="th-content">
                                    <span className="th-icon">📧</span>
                                    Email
                                </span>
                            </th>
                            <th style={{ width: "120px" }}>
                                <span className="th-content">
                                    <span className="th-icon">📱</span>
                                    Telepon
                                </span>
                            </th>
                            <th style={{ width: "200px" }}>
                                <span className="th-content">
                                    <span className="th-icon">🏠</span>
                                    Alamat
                                </span>
                            </th>
                            <th style={{ width: "140px" }}>
                                <span className="th-content">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer, index) => (
                            <tr key={customer.id} className="table-row">
                                <td style={{ width: "60px", textAlign: "left" }}>
                                    <div className="number-badge">{index + 1}</div>
                                </td>
                                <td style={{ width: "200px", paddingLeft: "16px" }}>
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            {customer.fullName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="username-text">{customer.fullName}</div>
                                    </div>
                                </td>
                                <td style={{ width: "180px" }}>
                                    <span className="email-text">{customer.email || 'Tidak tersedia'}</span>
                                </td>
                                <td style={{ width: "120px" }}>
                                    <span className="phone-text">{customer.phone || 'Tidak tersedia'}</span>
                                </td>
                                <td style={{ width: "200px" }}>
                                    <span className="address-text" title={customer.address}>
                                        {customer.address ?
                                            (customer.address.length > 30 ?
                                                customer.address.substring(0, 30) + '...' :
                                                customer.address
                                            ) :
                                            'Tidak tersedia'
                                        }
                                    </span>
                                </td>
                                <td style={{ width: "140px" }}>
                                    <div className="action-buttons" style={{ width: "140px" }}>
                                        <button
                                            className="action-btn view-btn"
                                            title="View"
                                            onClick={handleView(customer)}
                                        >
                                            👁️
                                        </button>
                                        <button
                                            className="action-btn edit-btn"
                                            title="Edit"
                                            onClick={handleEdit(customer, onEdit)}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="action-btn delete-btn"
                                            title="Delete"
                                            onClick={handleDelete(customer.id, onDelete)}
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
                {customers.map((customer, index) => (
                    <div key={customer.id} className="mobile-card">
                        <div className="card-header">
                            <div className="user-info-mobile">
                                <div className="user-avatar-mobile">
                                    {customer.fullName.charAt(0).toUpperCase()}
                                </div>
                                <div className="user-details">
                                    <h3 className="username-mobile">{customer.fullName}</h3>
                                    <span className="customer-info-mobile">
                                        {customer.email || customer.phone || 'Tidak ada kontak'}
                                    </span>
                                </div>
                            </div>
                            <div className="card-number">#{index + 1}</div>
                        </div>

                        <div className="card-body">
                            <div className="info-row">
                                <span className="info-label">📧 Email:</span>
                                <span className="info-value">{customer.email || 'Tidak tersedia'}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">📱 Telepon:</span>
                                <span className="info-value">{customer.phone || 'Tidak tersedia'}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">🏠 Alamat:</span>
                                <span className="info-value">{customer.address || 'Tidak tersedia'}</span>
                            </div>
                        </div>

                        <div className="card-actions">
                            <button
                                className="mobile-action-btn view-btn"
                                onClick={handleView(customer)}
                            >
                                👁️ View
                            </button>
                            <button
                                className="mobile-action-btn edit-btn"
                                onClick={handleEdit(customer, onEdit)}
                            >
                                ✏️ Edit
                            </button>
                            <button
                                className="mobile-action-btn delete-btn"
                                onClick={handleDelete(customer.id, onDelete)}
                            >
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CustomerTable;