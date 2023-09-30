'use client'

import { useRouter } from "next/navigation";
import { destroyCookie, setCookie } from "nookies";
import { createContext, ReactNode, useState } from "react";
import { api } from "../service/api";

interface AuthContextData {
    signIn(credentials: SignInCredentials): Promise<void>;
    logout: () => Promise<void>;
    user: undefined | User
    isAuthenticated: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

interface SignInCredentials {
    email: string;
    password: string;
}

interface User {
    id: string;
    name: string;
    email: string;
}

export const AuthContext = createContext({} as AuthContextData);


export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User>({} as User);
    const isAuthenticated = !!user?.id;
    const router = useRouter();

    async function signIn({ email, password }: SignInCredentials) {
        
        const response = await api.post("/auth", { email, password});
        const { token, user: loggedUser } = response.data;

        console.log(loggedUser)
        setUser(loggedUser)

        setCookie(undefined, 'nextauth.token', token, {
            maxAge: 60 * 60 * 5, // 1 hour
        })

        setCookie(undefined, 'nextauth.name', user.name, {
            maxAge: 60 * 60 * 5, // 5 hour
        })

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        router.push('/');
    }

    async function logout() {
        destroyCookie(undefined, 'nextauth.token');
        destroyCookie(undefined, 'nextauth.name');
        router.push('/signin');
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, logout }}>
            {children}
        </AuthContext.Provider>
    )
}