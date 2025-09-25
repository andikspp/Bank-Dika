import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../styles/addUserPage.css";

const Input = ({ icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon?: string }) => (
    <div className="input-group">
        {icon && <span className="input-icon">{icon}</span>}
        <input {...props} className="form-input" />
    </div>
);

const Select = ({ icon, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { icon?: string }) => (
    <div className="input-group">
        {icon && <span className="input-icon">{icon}</span>}
        <select {...props} className="form-select">
            {children}
        </select>
    </div>
);

const AddUserPage: React.FC = () => {
    const [form, setForm] = useState({ username: "", password: "", role: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

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
            // debug request form
            console.log("Submitting form:", form);
            await axios.post("http://localhost:8080/api/users/add", form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess(true);
            setTimeout(() => navigate("/admin/users"), 1500);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Gagal menambah user.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="success-container">
                <div className="success-card">
                    <div className="success-icon">✅</div>
                    <h2>User Berhasil Ditambahkan!</h2>
                    <p>Mengalihkan ke halaman manajemen user...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="add-user-container">
            <div className="add-user-card">
                <div className="card-header">
                    <h1>Tambah User Baru</h1>
                    <p>Lengkapi informasi untuk menambahkan user baru ke sistem</p>
                </div>

                <form onSubmit={handleSubmit} className="add-user-form">
                    <Input
                        icon="🔖"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        icon="🔒"
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <Select icon="🏷️" name="role" value={form.role} onChange={handleChange}>
                        <option value="">-- Pilih Role --</option>
                        <option value="CUSTOMER">Customer - Nasabah</option>
                        <option value="TELLER">Teller - Petugas Bank</option>
                    </Select>

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/users")}
                            className="btn btn-secondary"
                            disabled={loading}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <span>💾</span>
                                    Tambah User
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserPage;