import React, { createContext } from "react";
import { AuthUser } from "../types/User";

export interface AuthContextType {
    user: AuthUser | null;
    setUser?: (user: AuthUser | null) => void;
}

export const AuthContext = createContext<AuthContextType>({ user: null });