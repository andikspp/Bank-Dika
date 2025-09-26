import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../styles/modal.css";
import Swal from "sweetalert2";

interface EditCustomerModalProps {
    open: boolean;
    onClose: () => void;
    customer: {
        id: number;
        fullName: string;
        email?: string;
        phone?: string;
        address?: string;
        ktpNumber?: string;
    } | null;
    onSuccess: () => void;
}

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({ open, onClose, customer, onSuccess }) => {
    const [form, setForm] = useState({ id: 0, fullName: "", email: "", phone: "", address: "", ktpNumber: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (customer) {
            setForm({
                id: customer.id,
                fullName: customer.fullName,
                email: customer.email || "",
                phone: customer.phone || "",
                address: customer.address || "",
                ktpNumber: customer.ktpNumber || "",
            });
        }
    }, [customer]);

    if (!open || !customer) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isChanged =
            form.fullName !== customer.fullName ||
            form.email !== customer.email ||
            form.phone !== customer.phone ||
            form.address !== customer.address ||
            form.ktpNumber !== customer.ktpNumber;

        if (!isChanged) {
            setError("Tidak ada perubahan data.");
            Swal.fire("Info", "Tidak ada perubahan data.", "info");
            onClose();
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:8080/api/customers/${customer.id}`, form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Swal.fire("Sukses", "Data nasabah berhasil diperbarui.", "success");
            onSuccess();
            onClose();
        } catch (err: any) {
            const errorMsg =
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Gagal memperbarui data nasabah.";
            setError(errorMsg);
            Swal.fire("Error", errorMsg, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                {/* Header */}
                <div className="modal-header">
                    <h3>Edit Nasabah</h3>
                    <button className="close-btn" onClick={onClose} type="button">✕</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="add-form">
                    <div className="form-group">
                        <label>Nama Lengkap</label>
                        <input
                            type="text"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Nomor Telepon</label>
                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Alamat</label>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Nomor KTP</label>
                        <input
                            type="text"
                            name="ktpNumber"
                            value={form.ktpNumber}
                            onChange={handleChange}
                            required
                            maxLength={16}
                            minLength={16}
                            pattern="\d{16}"
                            title="Nomor KTP harus terdiri dari 16 digit angka."
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                            Batal
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCustomerModal;
