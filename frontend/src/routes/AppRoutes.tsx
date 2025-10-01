import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../features/auth/AuthContext";
import { User } from "../features/auth/types";
import { useInitialUser } from "../features/auth/hooks/useInitialUser";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";

const Login = React.lazy(() => import("../pages/LoginPage"));
const Dashboard = React.lazy(() => import("../pages/DashboardPage"));
const Register = React.lazy(() => import("../pages/RegisterPage"));
const UserManagement = React.lazy(() => import("../pages/admin/userManagement/UserManagementPage"));
const AddUserPage = React.lazy(() => import("../pages/admin/userManagement/AddUserPage"));
const EditUserPage = React.lazy(() => import("../pages/admin/userManagement/EditUserPage"));
const ViewUserPage = React.lazy(() => import("../pages/admin/userManagement/ViewUserPage"));
const AccountManagementPage = React.lazy(() => import("../pages/admin/accountManagement/AccountManagementPage"));
const CustomerManagementPage = React.lazy(() => import("../pages/teller/customerManagement/CustomerManagementPage"));
const CustomerViewPage = React.lazy(() => import("../pages/teller/customerManagement/CustomerViewPage"));
const DepositeManagementPage = React.lazy(() => import("../pages/teller/depositManagement/DepositManagementPage"));
const WithdrawalManagementPage = React.lazy(() => import("../pages/teller/withdrawalManagement/WithdrawalManagementPage"));
const TransferManagementPage = React.lazy(() => import("../pages/teller/transferManagement/TransferManagementPage"));
const HistoryManagementPage = React.lazy(() => import("../pages/teller/historyManagement/HistoryManagementPage"));

const AppRoutes: React.FC = () => {
    const initialUser = useInitialUser();
    const [user, setUser] = useState<User | null>(initialUser);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            <Router>
                <React.Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/login" element={<Login onLogin={setUser} />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        {/* Gunakan MainLayout di sini */}
                        <Route
                            path="/admin/users"
                            element={
                                <ProtectedRoute requiredRole="ADMIN">
                                    <MainLayout>
                                        <UserManagement />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/users/add"
                            element={
                                <ProtectedRoute requiredRole="ADMIN">
                                    <MainLayout>
                                        <AddUserPage />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/users/edit/:id"
                            element={
                                <ProtectedRoute requiredRole="ADMIN">
                                    <MainLayout>
                                        <EditUserPage />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/users/view/:id/:username"
                            element={
                                <ProtectedRoute requiredRole="ADMIN">
                                    <MainLayout>
                                        <React.Suspense fallback={<div>Loading...</div>}>
                                            <ViewUserPage />
                                        </React.Suspense>
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/accounts"
                            element={
                                <ProtectedRoute requiredRole="ADMIN">
                                    <MainLayout>
                                        <AccountManagementPage />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/teller/customers"
                            element={
                                <ProtectedRoute requiredRole="TELLER">
                                    <MainLayout>
                                        <CustomerManagementPage />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/teller/customers/detail/:id"
                            element={
                                <ProtectedRoute requiredRole="TELLER">
                                    <MainLayout>
                                        <CustomerViewPage />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/teller/deposit"
                            element={
                                <ProtectedRoute requiredRole="TELLER">
                                    <MainLayout>
                                        <DepositeManagementPage />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/teller/withdrawal"
                            element={
                                <ProtectedRoute requiredRole="TELLER">
                                    <MainLayout>
                                        <WithdrawalManagementPage />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/teller/transfer"
                            element={
                                <ProtectedRoute requiredRole="TELLER">
                                    <MainLayout>
                                        <TransferManagementPage />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/teller/history"
                            element={
                                <ProtectedRoute requiredRole="TELLER">
                                    <MainLayout>
                                        <HistoryManagementPage />
                                    </MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        {/* Redirect semua route yang tidak dikenali ke login */}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </React.Suspense>
            </Router>
        </AuthContext.Provider>
    );
};

export default AppRoutes;