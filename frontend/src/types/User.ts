import { UserRole } from "./UserRoles";

export type User = {
    id: number;
    username: string;
    email: string;
    roleName: string;
};

export interface AuthUser {
    name: string;
    role: UserRole;
}