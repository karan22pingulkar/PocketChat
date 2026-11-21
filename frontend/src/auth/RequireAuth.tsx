import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// wraps any page that needs login - no token = sent to /login
export default function RequireAuth({ children }: { children: ReactNode }) {
    const { token } = useAuth();
    if (!token) return <Navigate to="/login" replace />;
    return <>{children}</>;
}
