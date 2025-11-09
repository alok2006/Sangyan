import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import toast from 'react-hot-toast';
import axios, { AxiosInstance, AxiosError } from 'axios';

// --- Type Imports (Ensure this path is correct in your project) ---
import { User, UserRole, MembershipStatus, ParasTransaction } from '../types'; 

// --- Configuration ---
const API_ROUTER_BASE = `/api/`; 
const TOKEN_URL = `/api/token/`; 

// --- Context Interfaces ---

interface AuthContextType {
    currentUser: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signOut: (callApi?: boolean) => Promise<void>;
    updateProfile: (
        first_name: string, 
        last_name: string, 
        photoURL?: string, 
        institute?: string, 
        course?: string, 
        bio?: string
    ) => Promise<void>;
    refreshUserData: () => Promise<boolean>; // Returns boolean on success/fail
    addParasStones: (amount: number, reason: string) => Promise<void>;
    spendParasStones: (amount: number, reason: string) => Promise<boolean>;
    getAuthToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to decode JWT payload
const decodeTokenUID = (token: string): string | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        return payload.uid || payload.user_id || null; 
    } catch (e) {
        return null;
    }
};

// --- Hooks ---
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

// Create a configured Axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_ROUTER_BASE, 
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Auth Provider Component ---
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null); 
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!currentUser;
    const getAuthToken = useCallback((): string | null => localStorage.getItem('authToken'), []);
    const getUID = useCallback((): string | null => localStorage.getItem('authUID'), []);
    
    // 1. SIGN OUT: Clears all credentials
    const signOut = useCallback(async (callApi = true) => {
        try {
            if (callApi) { 
                // Placeholder for API call (e.g., await axiosInstance.post('/token/blacklist/', { refresh: refreshToken });)
            } 
        } catch (error) { 
            console.error('Sign out API call error:', error);
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUID'); 
            delete axiosInstance.defaults.headers.common['Authorization']; 
            setCurrentUser(null);
            toast.success('Signed out successfully');
        }
    }, []);


    // 2. FETCH USER DATA: Uses stored UID
    const fetchUserData = useCallback(async (): Promise<boolean> => {
        const uid = getUID();
        const token = getAuthToken();

        if (!uid || !token) {
            signOut(false);
            return false;
        }
        
        const URL = `users/${uid}/`; 

        try {
            // Ensure Authorization header is set for this direct call
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const response = await axiosInstance.get(URL);
            
            const data: User = response.data;
            setCurrentUser(data);
            return true; 
        } catch (error) {
            const axiosErr = error as AxiosError;
            console.error(`Error fetching user data:`, axiosErr.message, axiosErr.response?.status);
            
            // If fetching fails due to auth issues, sign out
            if (axiosErr.response?.status === 401 || axiosErr.response?.status === 403) {
                 signOut(false);
            }
            return false; 
        }
    }, [signOut, getUID, getAuthToken]);

    const refreshUserData = useCallback(async (): Promise<boolean> => {
        return fetchUserData(); 
    }, [fetchUserData]);
    
    
    // 3. LOGIN IMPLEMENTATION
     const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await axios.post(TOKEN_URL, { email, password });
            
            const { access, uid: responseUid } = response.data; 

            let uid = responseUid;
            if (access && !uid) {
                uid = decodeTokenUID(access); 
            }
            
            if (access && uid) {
                localStorage.setItem('authToken', access);
                localStorage.setItem('authUID', uid); 
                
                // Immediately set Authorization header
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;

                const success = await fetchUserData();
                
                if (!success) {
                    signOut(false); 
                    toast.error("Login successful, but failed to retrieve user data.");
                    return false;
                }
                
                // Use the newly fetched user data for the welcome message
                toast.success(`Welcome, ${currentUser?.displayName || email}!`);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login Error:', error);
            const axiosErr = error as AxiosError;
            let errorMessage = 'Login failed. Check credentials.';
            if (axiosErr.response?.status === 401) {
                errorMessage = 'Invalid email or password.';
            }
            toast.error(errorMessage);
            return false; 
        }
    }, [fetchUserData, signOut, currentUser]); // Kept currentUser for welcome message dependency if fetch fails


    // 4. UPDATE PROFILE IMPLEMENTATION
    const updateProfile = useCallback(async (
        first_name: string, 
        last_name: string, 
        photoURL?: string, 
        institute?: string, 
        course?: string, 
        bio?: string
    ) => {
        const uid = getUID();
        if (!uid) {
            toast.error('Cannot update profile: Not logged in.');
            return;
        }
        
        // CRITICAL FIX: Ensure keys match Django serializer field names
        const updateData: Partial<User> = {
            first_name, 
            last_name,   
            photoURL: photoURL, 
            institute: institute, 
            course: course, 
            bio: bio
        };

        try {
            await axiosInstance.patch(`/users/${uid}/`, updateData);
            await refreshUserData(); 
            toast.success('Profile updated successfully');
        } catch (error) { 
            const axiosErr = error as AxiosError;
            console.error('Profile Update Error:', axiosErr);
            toast.error('Failed to update profile.');
            throw error; 
        }
    }, [refreshUserData, getUID]);


    // --- Interceptors Setup (Kept for token refresh/expiry handling) ---
    useEffect(() => {
        const requestInterceptor = axiosInstance.interceptors.request.use(
            (config) => {
                const token = getAuthToken();
                // Only set header if token exists and header isn't already set
                if (token && !config.headers.Authorization) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                // If 401 and not trying to get a token, sign out
                if (error.response?.status === 401 && !error.config?.url?.includes(TOKEN_URL)) {
                    toast.error('Session expired. Please log in again.');
                    setTimeout(() => signOut(false), 0); 
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, [getAuthToken, signOut]);


    // --- Initialization Effect ---
    useEffect(() => {
        const initializeAuth = async () => {
            // Set header default if token exists (for initial fetchUserData and subsequent API calls)
            const token = getAuthToken();
            if (token) {
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                await fetchUserData();
            }
            setLoading(false);
        };

        initializeAuth();
    }, [fetchUserData, getAuthToken]);


    // --- Monetary Functions (Cleaned dependencies) ---
    
    const addParasStones = useCallback(async (amount: number, reason: string) => {
        if (!getAuthToken()) throw new Error('No user logged in'); // Rely on token existence
        
        try {
            await axiosInstance.post('/users/paras/add/', { amount, reason });
            await refreshUserData();
            toast.success(`🎉 You earned ${amount} Paras Stones! ${reason}`, { duration: 3000 });
        } catch (error) {
            const axiosErr = error as AxiosError;
            const errorData = axiosErr.response?.data as { detail?: string, message?: string };
            console.error('Error adding Paras Stones:', axiosErr);
            toast.error(errorData?.detail || errorData?.message || 'Failed to add Paras Stones');
        }
    }, [refreshUserData, getAuthToken]); // Removed currentUser from dependencies

    const spendParasStones = useCallback(async (amount: number, reason: string): Promise<boolean> => {
        if (!getAuthToken()) {
            toast.error('No user logged in.');
            return false;
        }
        
        try {
            await axiosInstance.post('/users/paras/spend/', { amount, reason });
            await refreshUserData();
            toast.success(`✨ You spent ${amount} Paras Stones on ${reason}`);
            return true;
        } catch (error) {
            const axiosErr = error as AxiosError;
            const errorData = axiosErr.response?.data as { detail?: string, message?: string };
            
            if (axiosErr.response?.status === 400 && (errorData.detail || '').includes('Insufficient')) {
                toast.error('Insufficient Paras Stones!');
                return false;
            }
            
            console.error('Error spending Paras Stones:', axiosErr);
            toast.error(errorData?.detail || errorData?.message || 'Failed to spend Paras Stones');
            return false;
        }
    }, [refreshUserData, getAuthToken]); // Removed currentUser from dependencies


    const value: AuthContextType = {
        currentUser, 
        isAuthenticated,
        loading, 
        login, 
        signOut, 
        updateProfile, 
        refreshUserData, 
        addParasStones, 
        spendParasStones, 
        getAuthToken
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};