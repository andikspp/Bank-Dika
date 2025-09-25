import React from "react";

type DashboardHeaderProps = {
    user: any;
    onLogout: () => void;
};

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onLogout }) => (
    <header className="dashboard-header">
        <div className="header-content">
            <div className="user-info">
                <div className="user-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                    <h1 className="welcome-text">Selamat datang, {user.name}!</h1>
                    <p className="user-role">Role: {user.role}</p>
                </div>
            </div>
            <button className="logout-button" onClick={onLogout}>
                <span>🚪</span> Logout
            </button>
        </div>
    </header>
);

export default DashboardHeader;