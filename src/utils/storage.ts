import { LoginData } from "@/types/auth";

const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "currentUser";

export const storage = {

    saveToken(token: string) {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    },

    getToken(): string | null {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    removeToken() {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    },

    saveUser(user: LoginData) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    getUser(): LoginData | null {

        const user = localStorage.getItem(USER_KEY);

        if (!user) return null;

        return JSON.parse(user);
    },

    clearAuth() {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
};