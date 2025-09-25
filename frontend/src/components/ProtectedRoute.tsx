import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

type ProtectedRouteProps = {
    children: React.ReactNode;
    requiredRole?: string;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { user } = useAuth();
    const token = localStorage.getItem("token");

    if (!user || !token) {
        return <Navigate to="/login" replace />;
    }
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
};

export default ProtectedRoute;