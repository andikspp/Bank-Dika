import { AuthUser } from "../types/User";
import { jwtDecode } from "jwt-decode";

export function useInitialUser(): AuthUser | null {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const decoded: any = jwtDecode(token);
            return {
                name: decoded.sub,
                role: decoded.role
            };
        } catch {
            localStorage.removeItem("token");
        }
    }
    return null;
}