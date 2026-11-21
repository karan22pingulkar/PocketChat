import { api } from "./client";

interface TokenResponse {
    access_token: string;
}

export function login(email: string, password: string) {
    return api<TokenResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export function register(email: string, password: string) {
    return api<TokenResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}
