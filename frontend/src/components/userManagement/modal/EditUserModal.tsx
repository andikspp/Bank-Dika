import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../styles/modal.css";
import Swal from "sweetalert2";

interface EditUserModalProps {
    open: boolean;
    onClose: () => void;
    user: {
        id: number;
        username: string;
        roleName: string;
        password?: string;
    } | null;
    onSuccess: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ open, onClose, user, onSuccess }) => {
    const [form, setForm] = useState({ username: "", role: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setForm({
                username: user.username,
                role: user.roleName || "",
                password: "",
            });
        }
    }, [user]);

    if (!open || !user) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.role) {
            setError("Role harus dipilih.");
            alert("Role harus dipilih.");
            return;
        }

        // cek apakah ada perubahan data
        const isChanged =
            form.username !== user.username ||
            form.role !== user.roleName ||
            form.password !== "";

        if (!isChanged) {
            setError("Tidak ada perubahan data.");
            Swal.fire("Info", "Tidak ada perubahan data.", "info");
            onClose();
            return;
        }

        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        try {
            await axios.put(
                `http://localhost:8080/api/users/${user.id}`,
                { ...form },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onSuccess();
            onClose();
            Swal.fire("Sukses", "User berhasil diubah.", "success");
        } catch (err: any) {
            setError(err.response?.data?.message || "Gagal mengedit user.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h3>Edit User</h3>
                    <button className="close-btn" onClick={onClose} type="button">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="add-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password (kosongkan jika tidak diubah)</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Pilih Role --</option>
                            <option value="CUSTOMER">Customer</option>
                            <option value="TELLER">Teller</option>
                        </select>
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

export default EditUserModal;