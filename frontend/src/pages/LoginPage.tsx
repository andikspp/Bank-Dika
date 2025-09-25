import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { User } from "../features/auth/types";

interface LoginPageProps {
    onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    return <LoginForm onLogin={onLogin} />;
};

export default LoginPage;