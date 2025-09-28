import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/sidebar.css";
interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

interface MenuItem {
    id: string;
    label: string;
    icon: string;
    path: string;
    badge?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    const [userRole, setUserRole] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem("userRole") || "CUSTOMER";
        const name = localStorage.getItem("userName") || "User";
        setUserRole(role);
        setUserName(name);
    }, []);

    const getMenuItems = (): MenuItem[] => {
        const menuConfig = {
            ADMIN: [
                { id: "dashboard", label: "Dashboard", icon: "🏠", path: "/dashboard" },
                { id: "users", label: "Manajemen User", icon: "👥", path: "/admin/users" },
                { id: "accounts", label: "Manajemen Rekening", icon: "🏦", path: "/admin/accounts" },
                { id: "transactions", label: "Transaksi", icon: "💳", path: "/admin/transactions" },
                { id: "reports", label: "Laporan", icon: "📊", path: "/admin/reports" },
                { id: "settings", label: "Pengaturan", icon: "⚙️", path: "/admin/settings" },
            ],
            TELLER: [
                { id: "dashboard", label: "Dashboard", icon: "🏠", path: "/dashboard" },
                { id: "customers", label: "Data Nasabah", icon: "👤", path: "/teller/customers" },
                { id: "deposit", label: "Setor Tunai", icon: "💰", path: "/teller/deposit" },
                { id: "withdraw", label: "Tarik Tunai", icon: "💸", path: "/teller/withdraw" },
                { id: "transfer", label: "Transfer", icon: "🔄", path: "/teller/transfer" },
                { id: "history", label: "Riwayat Transaksi", icon: "📝", path: "/teller/history" },
            ],
            CUSTOMER: [
                { id: "dashboard", label: "Dashboard", icon: "🏠", path: "/customer/dashboard" },
                { id: "balance", label: "Saldo & Info Akun", icon: "💰", path: "/customer/balance" },
                { id: "transfer", label: "Transfer", icon: "🔄", path: "/customer/transfer" },
                { id: "history", label: "Riwayat Transaksi", icon: "📝", path: "/customer/history" },
                { id: "profile", label: "Profil Saya", icon: "👤", path: "/customer/profile" },
            ]
        };

        return menuConfig[userRole as keyof typeof menuConfig] || [];
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        navigate("/login");
    };

    const getRoleColor = (role: string): string => {
        const roleColors = {
            ADMIN: "#ef4444",
            TELLER: "#10b981",
            CUSTOMER: "#3b82f6",
        };
        return roleColors[role as keyof typeof roleColors] || "#6b7280";
    };

    const getRoleLabel = (role: string): string => {
        const roleLabels = {
            ADMIN: "Administrator",
            TELLER: "Teller",
            CUSTOMER: "Customer",
        };
        return roleLabels[role as keyof typeof roleLabels] || "User";
    };

    const menuItems = getMenuItems();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={toggleSidebar}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
                role="navigation"
                aria-label="Main navigation"
            >
                {/* Header Section */}
                <header className="sidebar-header">
                    <div className="logo-section">
                        <div className="logo">
                            <span className="logo-icon" role="img" aria-label="Bank icon">
                                🏦
                            </span>
                            <span className="logo-text">Bank Dika</span>
                        </div>
                        <button
                            className="sidebar-toggle"
                            onClick={toggleSidebar}
                            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
                            type="button"
                        >
                            <span className="toggle-icon">
                                {isOpen ? "✕" : "☰"}
                            </span>
                        </button>
                    </div>
                </header>

                {/* User Profile Section */}
                <div className="user-profile">
                    <div className="user-avatar">
                        <span className="avatar-text">
                            {userName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="user-info">
                        <div className="user-name" title={userName}>
                            {userName}
                        </div>
                        <div
                            className="user-role"
                            style={{ color: getRoleColor(userRole) }}
                            title={getRoleLabel(userRole)}
                        >
                            {getRoleLabel(userRole)}
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="sidebar-nav" role="navigation">
                    <ul className="nav-list" role="menu">
                        {menuItems.map((item) => (
                            <li key={item.id} className="nav-item" role="none">
                                <Link
                                    to={item.path}
                                    className={`nav-link ${location.pathname === item.path ? 'nav-link-active' : ''
                                        }`}
                                    title={!isOpen ? item.label : undefined}
                                    role="menuitem"
                                    aria-current={location.pathname === item.path ? 'page' : undefined}
                                >
                                    <span
                                        className="nav-icon"
                                        role="img"
                                        aria-label={`${item.label} icon`}
                                    >
                                        {item.icon}
                                    </span>
                                    <span className="nav-text">{item.label}</span>
                                    {item.badge && (
                                        <span
                                            className="nav-badge"
                                            aria-label={`${item.badge} notifications`}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer Section */}
                <footer className="sidebar-footer">
                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                        type="button"
                        title={!isOpen ? "Keluar" : undefined}
                        aria-label="Logout from application"
                    >
                        <span
                            className="logout-icon"
                            role="img"
                            aria-label="Logout icon"
                        >
                            🚪
                        </span>
                        <span className="logout-text">Keluar</span>
                    </button>
                    <div className="sidebar-version" title="Application version 1.0.0">
                        <span>v1.0.0</span>
                    </div>
                </footer>
            </aside>
        </>
    );
};

export default Sidebar;