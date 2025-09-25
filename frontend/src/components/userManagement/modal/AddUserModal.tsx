import React, { useState } from "react";
import axios from "axios";
import "../../../styles/modal.css";
import Swal from "sweetalert2";

const AddUserModal: React.FC<{ open: boolean; onClose: () => void; onSuccess: () => void }> = ({ open, onClose, onSuccess }) => {
    const [form, setForm] = useState({ username: "", password: "", role: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!open) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
            setError("User tidak terautentikasi.");
            setLoading(false);
            return;
        }
        if (!form.role) {
            setError("Role harus dipilih.");
            setLoading(false);
            return;
        }
        try {
            await axios.post("http://localhost:8080/api/users/add", form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (onSuccess) onSuccess();
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "User berhasil ditambahkan.",
                timer: 1500,
                showConfirmButton: false,
            });
            onClose();
        } catch (err: any) {
            // Jika backend mengirim string, gunakan err.response.data
            const msg = err.response?.data || "Gagal menambah user.";
            setError(msg);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: msg,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h3>Tambah User Baru</h3>
                    <button className="close-btn" onClick={onClose} type="button" aria-label="Tutup">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="add-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Pilih Role --</option>
                            <option value="CUSTOMER">Customer - Nasabah</option>
                            <option value="TELLER">Teller - Petugas Bank</option>
                        </select>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
                            Batal
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Menyimpan..." : "Tambah User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;