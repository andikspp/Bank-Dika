import { useNavigate } from "react-router-dom";
import DashboardCard from "./DashboardCard";

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-content">
            <div className="dashboard-title">
                <h2>Dashboard Admin</h2>
                <p>Kelola sistem, pengguna, dan pengaturan aplikasi secara menyeluruh.</p>
            </div>
            <div className="dashboard-grid">
                <DashboardCard
                    icon="👥"
                    title="Manajemen Pengguna"
                    description="Lihat, tambah, edit, dan hapus data pengguna sistem."
                    buttonLabel="Kelola Pengguna"
                    buttonColor="#3182ce"
                    onClick={() => navigate("/admin/users")}
                />
                <DashboardCard
                    icon="🛡️"
                    title="Manajemen Role"
                    description="Atur hak akses dan peran pengguna dalam sistem."
                    buttonLabel="Kelola Role"
                    buttonColor="#38a169"
                />
                <DashboardCard
                    icon="⚙️"
                    title="Pengaturan Sistem"
                    description="Ubah konfigurasi dan preferensi aplikasi."
                    buttonLabel="Pengaturan"
                    buttonColor="#d69e2e"
                />
            </div>
        </div>
    );
};

export default AdminDashboard;