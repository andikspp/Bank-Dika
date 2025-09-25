import DashboardCard from "./DashboardCard";

const CustomerDashboard: React.FC = () => (
    <div className="dashboard-content">
        <div className="dashboard-title">
            <h2>Dashboard Nasabah</h2>
            <p>Kelola akun dan transaksi perbankan Anda dengan mudah.</p>
        </div>
        <div className="dashboard-grid">
            <DashboardCard
                icon="💳"
                title="Saldo Rekening"
                description="Lihat saldo dan riwayat transaksi rekening Anda."
                buttonLabel="Lihat Saldo"
                buttonColor="#3182ce"
            />
            <DashboardCard
                icon="💸"
                title="Transfer"
                description="Transfer dana ke rekening lain dengan cepat dan aman."
                buttonLabel="Transfer"
                buttonColor="#38a169"
            />
            <DashboardCard
                icon="📊"
                title="Laporan"
                description="Unduh laporan transaksi bulanan atau tahunan."
                buttonLabel="Lihat Laporan"
                buttonColor="#d69e2e"
            />
        </div>
    </div>
);

export default CustomerDashboard;