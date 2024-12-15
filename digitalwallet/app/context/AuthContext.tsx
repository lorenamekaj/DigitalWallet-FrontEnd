import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';

interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null }
    onRegister?: ( name: string, email: string, password: string ) => Promise<any>;
    onLogin?: ( email: string, password: string ) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'my-jwt';
const FULLNAME = 'fullname';
const EMAIL = 'email';
const ROLE = 'role';
export const API_URL='http://localhost:8080';

const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {

    const [authState, setAuthState] = useState<{
        token: string | null;
        authenticated: boolean | null;
    }> ({
        token: null,
        authenticated: null
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            console.log('stored:', token);

            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                setAuthState({
                    token: token,
                    authenticated: true
                });
            }
        };
        loadToken();
    }, [])

    const register = async (name: string, email: string, password: string) => {
        try {
            return await axios.post(`${API_URL}/api/v1/auth/sign-up`, { name, email, password });
        }
        catch (e) {
            return { error: true, msg: (e as any).response.data.msg };
        }
    }

    const login = async (email: string, password: string) => {
        try {
            const result = await axios.post(`${API_URL}/api/v1/auth/login`, { email, password });

            console.log("🚀 ~ file: AuthContext.tsx:44 ~ login ~ result:", result);

            setAuthState({
                token: result.data.token,
                authenticated: true
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
            await SecureStore.setItemAsync(FULLNAME, result.data.userDto.name);
            await SecureStore.setItemAsync(EMAIL, result.data.userDto.email);
            await SecureStore.setItemAsync(ROLE, result.data.userDto.role);

            return result;
        }
        catch (e) {
            return { error: true, msg: (e as any).response.data.msg }
        }
    }

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(FULLNAME);
        await SecureStore.deleteItemAsync(EMAIL);
        await SecureStore.deleteItemAsync(ROLE);
        axios.defaults.headers.common['Authorization'] = '';
        
        setAuthState({
            token: null,
            authenticated: false
        });
    }

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout, 
        authState,
    };

    return <AuthContext.Provider value={value}>{ children }</AuthContext.Provider>
};