import DashboardCard from "./DashboardCard";

const TellerDashboard: React.FC = () => (
    <div className="dashboard-content">
        <div className="dashboard-title">
            <h2>Dashboard Teller</h2>
            <p>Kelola transaksi dan layani nasabah dengan efisien.</p>
        </div>
        <div className="dashboard-grid">
            <DashboardCard
                icon="👤"
                title="Data Nasabah"
                description="Lihat dan kelola informasi nasabah."
                buttonLabel="Kelola Nasabah"
                buttonColor="#38a169"
                onClick={() => window.location.href = "/teller/customers"}
            />
            <DashboardCard
                icon="💸"
                title="Setoran Tunai"
                description="Lakukan setoran tunai untuk nasabah."
                buttonLabel="Setor Tunai"
                buttonColor="#3182ce"
                onClick={() => window.location.href = "/teller/deposit"}
            />
            <DashboardCard
                icon="🏦"
                title="Penarikan Tunai"
                description="Lakukan penarikan tunai untuk nasabah."
                buttonLabel="Tarik Tunai"
                buttonColor="#e53e3e"
                onClick={() => window.location.href = "/teller/withdrawal"}
            />
            <DashboardCard
                icon="🔄"
                title="Transfer Dana"
                description="Lakukan transfer dana antar rekening."
                buttonLabel="Transfer"
                buttonColor="#805ad5"
                onClick={() => window.location.href = "/teller/transfer"}
            />
        </div>
    </div>
);

export default TellerDashboard;