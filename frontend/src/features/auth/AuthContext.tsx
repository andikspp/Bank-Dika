import React, { createContext } from "react";
import { User } from "./types";

export interface AuthContextType {
    user: User | null;
    setUser?: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({ user: null });