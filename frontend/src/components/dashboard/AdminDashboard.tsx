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
                    title="Manajemen User"
                    description="Kelola data pengguna sistem."
                    buttonLabel="Kelola Pengguna"
                    buttonColor="#3182ce"
                    onClick={() => navigate("/admin/users")}
                />
                <DashboardCard
                    icon="💼"
                    title="Manajemen Rekening"
                    description="Kelola semua rekening nasabah."
                    buttonLabel="Kelola Rekening"
                    buttonColor="#38a169"
                    onClick={() => navigate("/admin/accounts")}
                />
                <DashboardCard
                    icon="💳"
                    title="Manajemen Transaksi"
                    description="Pantau dan kelola semua transaksi."
                    buttonLabel="Pantau Transaksi"
                    buttonColor="#d69e2e"
                    onClick={() => navigate("/admin/transactions")}
                />
                <DashboardCard
                    icon="📊"
                    title="Laporan & Statistik"
                    description="Lihat laporan keuangan dan statistik."
                    buttonLabel="Lihat Laporan"
                    buttonColor="#805ad5"
                />
            </div>
        </div>
    );
};

export default AdminDashboard;