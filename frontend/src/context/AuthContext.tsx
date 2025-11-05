import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import toast from 'react-hot-toast';
import axios, { AxiosInstance, AxiosError } from 'axios';

// --- Type Imports (CRITICAL FIX: Use central types file) ---
// Assuming this is imported from the refactored 'src/types.ts'
import { User, UserRole, MembershipStatus, ParasTransaction } from './types'; 

// --- Configuration ---
const API_SERVER_ROOT = 'http://localhost:8000'; 
const API_ROUTER_BASE = `${API_SERVER_ROOT}/api/`; 
const TOKEN_URL = `${API_SERVER_ROOT}/api/token/`; // Centralize token URL

// --- Context Interfaces (SIMPLIFIED) ---

/**
 * Interface defining the methods and state of the Auth Context.
 * Now uses the central 'User' interface.
 */
interface AuthContextType {
    // We use the full User type here, even though some fields might be null on initial load
    currentUser: User | null; // Renamed from userData for clarity
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signOut: (callApi?: boolean) => Promise<void>;
   updateProfile: (
        // CRITICAL: Aligned with Django field names
        first_name: string, 
        last_name: string, 
        photoURL?: string, 
        institute?: string, 
        course?: string, 
        bio?: string
    ) => Promise<void>;
    refreshUserData: () => Promise<void>;
    addParasStones: (amount: number, reason: string) => Promise<void>;
    spendParasStones: (amount: number, reason: string) => Promise<boolean>;
    getAuthToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to decode JWT payload (Unchanged, but useful)
const decodeTokenUID = (token: string): string | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        // JWTs typically store the user ID as 'user_id' or 'uid' (our custom token uses 'uid')
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

// Create a configured Axios instance with the API ROUTER base
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_ROUTER_BASE, 
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Auth Provider Component ---
export const AuthProvider = ({ children }: AuthProviderProps) => {
    // CRITICAL FIX: Use the central User interface and simplify state
    const [currentUser, setCurrentUser] = useState<User | null>(null); 
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!currentUser;
    const getAuthToken = useCallback((): string | null => localStorage.getItem('authToken'), []);
    const getUID = useCallback((): string | null => localStorage.getItem('authUID'), []);
    
    // 1. SIGN OUT: Clears all credentials
    const signOut = useCallback(async (callApi = true) => {
        // TODO: Implement API call to token blacklist if needed
        try {
            if (callApi) { 
                // e.g., await axiosInstance.post('/token/blacklist/', { refresh: refreshToken });
            } 
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUID'); 
            delete axiosInstance.defaults.headers.common['Authorization']; 
            setCurrentUser(null);
            toast.success('Signed out successfully');
        } catch (error) { 
            // Even if the API call fails, we still clear local storage
            console.error('Sign out error:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUID'); 
            delete axiosInstance.defaults.headers.common['Authorization']; 
            setCurrentUser(null);
        }
    }, []);


    // 2. FETCH USER DATA: Uses stored UID
    const fetchUserData = useCallback(async () => {
        const uid = getUID();
        const token = getAuthToken();

        if (!uid || !token) {
            signOut(false);
            return null;
        }
        
        const URL = `users/${uid}/`; 

        try {
            const response = await axiosInstance.get(URL);
            
            // CRITICAL FIX: Directly cast the response data to the User type
            const data: User = response.data;
            
            // NOTE: We rely on the Serializer to return the correct structure.
            setCurrentUser(data);
            return data; 
        } catch (error) {
            const axiosErr = error as AxiosError;
            if (axiosErr.response?.status !== 401) { 
                console.error(`Error fetching user data:`, axiosErr.message); 
            }
            // If fetching fails (e.g., 404, 403, or invalid token), sign out
            signOut(false);
            return null; 
        }
    }, [signOut, getUID, getAuthToken]);

    const refreshUserData = useCallback(async () => {
        const data = await fetchUserData();
        return !!data; 
    }, [fetchUserData]);
    
    
    // 3. LOGIN IMPLEMENTATION
     const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await axios.post(TOKEN_URL, { email, password });
            
            // CustomTokenObtainPairSerializer adds 'uid' and 'email' to the response body
            const { access, uid: responseUid } = response.data; 

            let uid = responseUid;
            if (access && !uid) {
                // Fallback: Decode UID from the access token payload
                uid = decodeTokenUID(access); 
            }
            
            if (access && uid) {
                localStorage.setItem('authToken', access);
                localStorage.setItem('authUID', uid); 
                
                // Immediately set Authorization header for subsequent fetchUserData call
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;

                const success = await fetchUserData();
                
                if (!success) {
                    signOut(false); 
                    toast.error("Login successful, but failed to retrieve user data.");
                    return false;
                }

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
            return false; // Return false on any login failure
        }
    }, [fetchUserData, signOut, currentUser]); // Added currentUser to dependency array


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
            // Use PATCH for partial updates, PUT implies replacing the whole resource
            await axiosInstance.patch(`/users/${uid}/`, updateData);
            await refreshUserData(); // Fetch fresh data after successful patch
            toast.success('Profile updated successfully');
        } catch (error) { 
            const axiosErr = error as AxiosError;
            console.error('Profile Update Error:', axiosErr);
            toast.error('Failed to update profile.');
            throw error; // Propagate error for component-level handling
        }
    }, [refreshUserData, getUID]);


    // --- Interceptors Setup (Unchanged but relies on fixed logic) ---
    useEffect(() => {
        const requestInterceptor = axiosInstance.interceptors.request.use(
            (config) => {
                const token = getAuthToken();
                if (token && !config.headers.Authorization) {
                    config.headers.Authorization = `Bearer ${token}`;
                    // Set default for use outside of interceptor flow (e.g., fetchUserData)
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401 && !error.config?.url?.includes('/api/token/')) {
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


    // --- Initialization Effect (Unchanged logic) ---
    useEffect(() => {
        const initializeAuth = async () => {
            if (getAuthToken()) {
                // Ensure the Authorization header is set before fetchUserData runs
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${getAuthToken()}`;
                await fetchUserData();
            }
            setLoading(false);
        };

        initializeAuth();
    }, [fetchUserData, getAuthToken]);


    // --- Monetary Functions (Logic depends on fixed 'user' state) ---
    // The logic remains the same, but now it uses 'currentUser'
    const addParasStones = useCallback(async (amount: number, reason: string) => {
        if (!currentUser) throw new Error('No user logged in');
        
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
    }, [currentUser, refreshUserData]);

    const spendParasStones = useCallback(async (amount: number, reason: string): Promise<boolean> => {
        if (!currentUser) {
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
    }, [currentUser, refreshUserData]);

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