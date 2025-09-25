import DashboardCard from "./DashboardCard";

const TellerDashboard: React.FC = () => (
    <div className="dashboard-content">
        <div className="dashboard-title">
            <h2>Dashboard Teller</h2>
            <p>Kelola transaksi dan layani nasabah dengan efisien.</p>
        </div>
        <div className="dashboard-grid">
            <DashboardCard
                icon="🏦"
                title="Transaksi"
                description="Proses setoran, penarikan, dan transfer nasabah."
                buttonLabel="Proses Transaksi"
                buttonColor="#3182ce"
            />
            <DashboardCard
                icon="👤"
                title="Data Nasabah"
                description="Lihat dan kelola informasi nasabah."
                buttonLabel="Kelola Nasabah"
                buttonColor="#38a169"
            />
            <DashboardCard
                icon="📈"
                title="Laporan Harian"
                description="Buat laporan transaksi harian untuk atasan."
                buttonLabel="Buat Laporan"
                buttonColor="#d69e2e"
            />
        </div>
    </div>
);

export default TellerDashboard;