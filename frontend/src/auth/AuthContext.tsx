import { createContext, useContext, useState, type ReactNode } from "react";
import * as authApi from "../api/auth";

interface AuthContextType {
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    devEnter: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

    async function login(email: string, password: string) {
        const res = await authApi.login(email, password);
        localStorage.setItem("token", res.access_token);
        setToken(res.access_token);
    }

    async function register(email: string, password: string) {
        const res = await authApi.register(email, password);
        localStorage.setItem("token", res.access_token);
        setToken(res.access_token);
    }

    // temporary: lets us open the app before the backend exists
    function devEnter() {
        localStorage.setItem("token", "dev-token");
        setToken("dev-token");
    }

    function logout() {
        localStorage.removeItem("token");
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{ token, login, register, devEnter, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
