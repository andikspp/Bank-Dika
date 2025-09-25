import React from "react";
import { UserRole } from "../types/UserRoles";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import "../styles/dashboardPage.css";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import CustomerDashboard from "../components/dashboard/CustomerDashboard";
import TellerDashboard from "../components/dashboard/TellerDashboard";
import AdminDashboard from "../components/dashboard/AdminDashboard";

const DashboardPage: React.FC = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Silakan login untuk mengakses dashboard.</p>
            </div>
        );
    }

    const handleLogout = () => {
        if (setUser) setUser(null);
        localStorage.removeItem("token");
        navigate("/login");
    };

    const dashboards: Record<UserRole, React.ReactNode> = {
        [UserRole.ADMIN]: <AdminDashboard />,
        [UserRole.TELLER]: <TellerDashboard />,
        [UserRole.CUSTOMER]: <CustomerDashboard />,
    };

    return (
        <div className="dashboard-container">
            <DashboardHeader user={user} onLogout={handleLogout} />
            <main className="dashboard-main">
                {dashboards[user.role] || (
                    <div className="error-container">
                        <h2>Role tidak dikenali</h2>
                        <p>Silakan hubungi administrator sistem.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DashboardPage;