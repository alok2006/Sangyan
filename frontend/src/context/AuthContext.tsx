import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import toast from 'react-hot-toast';
import axios, { AxiosInstance, AxiosError } from 'axios';

// --- Configuration ---
// Base URL for the Django REST API endpoints
const API_BASE_URL = 'http://localhost:8000/api/'; 

// --- Interface Definitions ---

export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN'; 
export type MembershipStatusType = 'pending' | 'approved' | 'rejected';

export interface ParasTransaction {
    amount: number;
    transaction_type: string; // e.g., 'earning', 'spending'
    reason: string;
    timestamp: string;
}

export interface UserData {
    uid: string; 
    email: string;
    displayName: string | null;
    photoURL: string | null;
    role: UserRole;
    membershipStatus?: MembershipStatusType;
    createdAt?: string;
    institute?: string;
    course?: string;
    bio?: string;
    parasStones: number;
    parasHistory?: ParasTransaction[]; 
    coins: number;
}

export interface AuthUser {
    uid: string;
    email: string;
}

interface AuthContextType {
    user: AuthUser | null;
    userData: UserData | null;
    loading: boolean;
    signOut: (callApi?: boolean) => Promise<void>;
    updateProfile: (displayName: string, photoURL?: string, institute?: string, course?: string, bio?: string) => Promise<void>;
    refreshUserData: () => Promise<void>;
    addParasStones: (amount: number, reason: string) => Promise<void>;
    spendParasStones: (amount: number, reason: string) => Promise<boolean>;
    getAuthToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Auth Provider Component ---
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    const getAuthToken = useCallback((): string | null => {
        return localStorage.getItem('authToken'); // Uses 'authToken' for consistency
    }, []);
    
    // SignOut function needs to be declared outside of actions to be used by interceptor
    const signOut = useCallback(async (callApi = true) => {
        try {
            if (callApi) {
                // Optional: Call JWT blacklist endpoint
                // await axiosInstance.post('/auth/logout/'); 
            }
            
            localStorage.removeItem('authToken');
            // Ensure no pending requests try to use a stale token
            delete axiosInstance.defaults.headers.common['Authorization']; 
            
            setUser(null);
            setUserData(null);
            
            toast.success('Signed out successfully');
        } catch (error) {
            console.error('Error signing out:', error);
            toast.error('Failed to sign out');
        }
    }, []);


    // Fetch user data from the API
    const fetchUserData = useCallback(async () => {
        const URL = '/users/me/'; 

        try {
            const response = await axiosInstance.get(URL);
            const data = response.data;
            
            const mappedData: UserData = {
                uid: data.uid, 
                email: data.email,
                displayName: data.displayName,
                photoURL: data.photoURL || null,
                role: data.role as UserRole,
                membershipStatus: data.membershipStatus,
                createdAt: data.createdAt,
                institute: data.institute,
                course: data.course,
                bio: data.bio,
                parasStones: data.parasStones,
                coins: data.coins,
                
                parasHistory: data.parasHistory?.map((tx: any) => ({
                    amount: tx.amount,
                    transaction_type: tx.transaction_type, 
                    reason: tx.reason,
                    timestamp: tx.timestamp,
                })) || [],
            };
            
            setUser({ uid: mappedData.uid, email: mappedData.email || '' });
            return mappedData;
        } catch (error) {
            const axiosErr = error as AxiosError;
            // The interceptor handles 401; catch other retrieval errors (404, 500 etc.)
            if (axiosErr.response?.status !== 401) { 
                console.error('Error fetching user data:', axiosErr.message);
                // No toast here as it floods on initial load if API is down
            }
        }
        return null;
    }, [signOut]);

    const refreshUserData = useCallback(async () => {
        // Only run if we know a user is logged in (user state is populated or token exists)
        if (getAuthToken()) {
            const data = await fetchUserData();
            if (data) {
                setUserData(data);
            }
        }
    }, [fetchUserData, getAuthToken]);
    
    // --- Interceptors Setup ---
    useEffect(() => {
        // Request Interceptor: Add Authorization header to every request
        const requestInterceptor = axiosInstance.interceptors.request.use(
            (config) => {
                const token = getAuthToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                    // Set default header for subsequent requests
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response Interceptor: Handle global 401 errors
        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    // Check if it's not a direct token request (like /token/) to avoid false positives
                    if (!error.config?.url?.includes('token/')) {
                        toast.error('Session expired. Please log in again.');
                        // Use a local signout to prevent an infinite interceptor loop
                        setTimeout(() => signOut(false), 0); 
                    }
                }
                return Promise.reject(error);
            }
        );

        // Clean up interceptors
        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, [getAuthToken, signOut]);


    // --- Initialization Effect ---
    useEffect(() => {
        const initializeAuth = async () => {
            if (getAuthToken()) {
                await fetchUserData();
            }
            setLoading(false);
        };

        initializeAuth();
    }, [fetchUserData, getAuthToken]);


    // --- API Action Functions (Memoized) ---
    
    const addParasStones = useCallback(async (amount: number, reason: string) => {
        if (!user) throw new Error('No user logged in');
        
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
    }, [user, refreshUserData]);

    const spendParasStones = useCallback(async (amount: number, reason: string): Promise<boolean> => {
        if (!user || !userData) {
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
    }, [user, userData, refreshUserData]);

    const updateProfile = useCallback(async (
        displayName: string, 
        photoURL?: string, 
        institute?: string, 
        course?: string, 
        bio?: string
    ) => {
        if (!user) throw new Error('No user logged in');
        
        const updateData: Partial<UserData> = {
            displayName, photoURL, institute, course, bio
        };

        try {
            await axiosInstance.put(`/users/${user.uid}/`, updateData);
            
            // Fast local update
            setUser(prev => prev ? { ...prev, displayName } : null); 
            
            await refreshUserData();
            toast.success('Profile updated successfully');
        } catch (error) {
            const axiosErr = error as AxiosError;
            const errorData = axiosErr.response?.data as { detail?: string } | string;
            
            console.error('Error updating profile:', axiosErr);
            const errorMessage = typeof errorData === 'string' 
                ? errorData 
                : errorData?.detail || JSON.stringify(errorData);
                
            toast.error(`Failed to update profile: ${errorMessage}`);
            throw error;
        }
    }, [user, refreshUserData]);


    const value: AuthContextType = {
        user,
        userData,
        loading,
        signOut,
        updateProfile,
        refreshUserData,
        addParasStones,
        spendParasStones,
        getAuthToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};