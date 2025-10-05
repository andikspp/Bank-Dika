import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { AuthUser } from "../types/User";

interface LoginPageProps {
    onLogin: (user: AuthUser) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    return <LoginForm onLogin={onLogin} />;
};

export default LoginPage;