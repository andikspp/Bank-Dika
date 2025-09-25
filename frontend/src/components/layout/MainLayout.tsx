import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../sidebar/Sidebar";
import "../../styles/layout.css";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Set initial sidebar state based on device type
    useEffect(() => {
        if (!isMobile) {
            setSidebarOpen(true); // Open by default on desktop
        } else {
            setSidebarOpen(false); // Closed by default on mobile
        }
    }, [isMobile]);

    // Handle sidebar toggle
    const toggleSidebar = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    // Handle escape key to close sidebar on mobile
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isMobile && sidebarOpen) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => document.removeEventListener('keydown', handleEscapeKey);
    }, [isMobile, sidebarOpen]);

    // Prevent body scroll when sidebar is open on mobile
    useEffect(() => {
        if (isMobile && sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobile, sidebarOpen]);

    return (
        <div className="app-layout">
            <Sidebar
                isOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            <div
                className={`main-wrapper ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
            >
                {/* Mobile toggle button when sidebar is closed */}
                {isMobile && !sidebarOpen && (
                    <button
                        className="mobile-toggle-btn"
                        onClick={toggleSidebar}
                        aria-label="Open sidebar"
                        type="button"
                    >
                        <span className="toggle-icon">☰</span>
                    </button>
                )}

                <main
                    className="main-content"
                    role="main"
                    aria-label="Main content"
                >
                    <div className="content-container">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;