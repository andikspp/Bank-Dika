import React from 'react';
import { Customer } from "../../types/Customer";
import "../../styles/customerTable.css";
import Swal from "sweetalert2";

interface CustomerTableProps {
    customers: Customer[];
    onDelete?: (customerId: number) => void;
    onEdit?: (customer: Customer) => void;
}

const handleDelete = (customerId: number) => {
    Swal.fire({
        title: 'Apakah Anda yakin?',
        text: "Data nasabah akan dihapus secara permanen!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            try {
                // Panggil API untuk menghapus nasabah
                const token = localStorage.getItem("token");
                fetch(`http://localhost:8080/api/customers/${customerId}`, {
                    method: 'DELETE',
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }).then(response => {
                    if (response.ok) {
                        Swal.fire('Terhapus!', 'Data nasabah telah dihapus.', 'success');
                        // Refresh halaman atau data nasabah setelah penghapusan
                        window.location.reload();
                    } else {
                        Swal.fire('Gagal!', 'Gagal menghapus data nasabah.', 'error');
                    }
                });
            } catch (error) {
                console.error("Error deleting customer:", error);
                Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus data nasabah.', 'error');
            }
        }
    });
}

const CustomerTable: React.FC<CustomerTableProps> = ({ customers, onEdit }) => {
    return (
        <table className="customer-table">
            <thead>
                <tr>
                    <th>Nama Lengkap</th>
                    <th>Email</th>
                    <th>Nomor Telepon</th>
                    <th>Alamat</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                {customers.map((customer) => (
                    <tr key={customer.id}>
                        <td>{customer.fullName}</td>
                        <td>{customer.email}</td>
                        <td>{customer.phone}</td>
                        <td>{customer.address}</td>
                        <td>
                            <button className="view-button" onClick={() => alert(`Viewing details for ${customer.fullName}`)}>
                                Lihat
                            </button>
                            <button className="edit-button" onClick={() => onEdit?.(customer)}>
                                Edit
                            </button>
                            <button className="delete-button" onClick={() => handleDelete(customer.id)}>
                                Hapus
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default CustomerTable;