import { api } from "@/services/api";
import { checkAuth } from '@/utils/checkAuth';
import axios from "axios";
import { router } from 'expo-router';
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type AuthContextType = {
    user: any,
    login: (login: string, pass: string) => Promise<void>,
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any>(null)

    const refreshAuth = async () => {
        const res = await checkAuth()
        setUser(res.loggedIn ? res : null)
    }

    const login = async (login: string, pass: string) => {
        try {
            const res = await api.post(`/auth/login`, { login, pass });
            setUser(res.data.user)
        }
        catch(err: any) {
            throw err
        }
    }
    
    const logout = async () => {
        try {
            await api.post(`/auth/logout`, {});
        }
        finally {
            setUser(null)
            router.replace('/posts');
        }
    }

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    setUser(null);
                }
                return Promise.reject(error);
            }
        );

        refreshAuth();

        return () => axios.interceptors.response.eject(interceptor);
    }, []);
    
    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error("useAuth musi być używany w ContextProvider");
    return context;
}
