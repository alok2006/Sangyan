import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, Mail, Save, Edit3, X, Building2, BookOpen, FileText, Sparkles, Loader, GraduationCap 
} from 'lucide-react';
import { motion } from 'framer-motion';
// CRITICAL FIX: Import the definitive User interface
import { useAuth } from '../context/AuthContext';
import { User as UserType } from '../types'; 
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';


// Define the state as a partial of the UserType, since not all fields are editable
// and we don't want to store the entire history/read-only fields in the form state.
type EditableProfileFields = Pick<UserType, 
    'first_name' | 'last_name' | 'photoURL' | 'institute' | 'course' | 'bio'
>;

// --- Helper function to extract initial state from the definitive User object ---
const getInitialProfileData = (userData: UserType | null): EditableProfileFields => {
    return {
        first_name: userData?.first_name || '',
        last_name: userData?.last_name || '',
        photoURL: userData?.photoURL || undefined,
        institute: userData?.institute || '',
        course: userData?.course || '',
        bio: userData?.bio || '',
    };
};


const Profile: React.FC = () => {
    // CRITICAL FIX: Destructure the refactored context state
    const { currentUser, updateProfile, loading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    
    // CRITICAL FIX: Use the simplified type for form state
    const [profileData, setProfileData] = useState<EditableProfileFields>(getInitialProfileData(null));
    const [originalData, setOriginalData] = useState<EditableProfileFields>(getInitialProfileData(null));

    // --- Data Synchronization Effect ---
    useEffect(() => {
        // Handle unauthenticated user redirect
        if (!loading && !isAuthenticated) {
            navigate('/login');
            return;
        }

        // Only sync if we are NOT editing AND comprehensive data is available
        if (!isEditing && currentUser) {
            const data = getInitialProfileData(currentUser);
            setProfileData(data);
            setOriginalData(data);
        }
    // Added currentUser.uid to ensure sync happens if the user object changes entirely
    }, [isAuthenticated, currentUser, navigate, loading, isEditing]); 


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // CRITICAL FIX: Use keyof EditableProfileFields for type safety
        setProfileData(prev => ({ ...prev, [name as keyof EditableProfileFields]: value }));
    };

    // --- Core Save Handler ---
    const handleSave = async () => {
        if (!currentUser) return;
        
        setSaving(true);
        try {
            // CRITICAL FIX: Align arguments with the refactored updateProfile signature
            await updateProfile(
                profileData.first_name, 
                profileData.last_name, 
                profileData.photoURL,
                profileData.institute,
                profileData.course,
                profileData.bio,
            );
            
            toast.success('Profile updated successfully! 🎉');
            setIsEditing(false);
            
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to save profile changes.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setProfileData(originalData); 
    };

    // --- Sub-Component: ProfileInput ---
    
    const ProfileInput: React.FC<{ 
        label: string, name: keyof EditableProfileFields | 'email' | 'displayName', // Added read-only fields for completeness
        icon: React.FC<{ className: string }>, 
        type?: string, placeholder?: string, isTextArea?: boolean, readOnly?: boolean
    }> = ({ label, name, icon: Icon, type = 'text', placeholder, isTextArea = false, readOnly = false }) => {
        
        const disabled = !isEditing || readOnly;
        
        // CRITICAL FIX: Safely retrieve value from combined currentUser or local state
        let value: string | undefined | null;
        if (readOnly) {
            // Read-only fields come from the immutable currentUser object
            value = currentUser ? currentUser[name as keyof UserType] : ''; 
        } else {
            // Editable fields come from the local profileData state
            value = profileData[name as keyof EditableProfileFields]; 
        }
        
        const stringValue = String(value ?? '');

        return (
            <div>
                <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-2">
                    {label} {readOnly && <span className="text-red-400 text-xs">(Read-Only)</span>}
                </label>
                <div className="relative">
                    {!isTextArea && <Icon className={`absolute left-3 top-3.5 w-5 h-5 ${readOnly ? 'text-blue-500' : 'text-slate-500'}`} />}
                    {isTextArea ? (
                        <textarea
                            id={name} name={name} value={stringValue} onChange={handleInputChange}
                            disabled={disabled} rows={name === 'bio' ? 4 : 3}
                            className={`w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none
                                ${disabled ? 'opacity-75 cursor-default' : ''}
                            `}
                            placeholder={placeholder}
                        />
                    ) : (
                        <input
                            id={name} type={type} name={name} value={stringValue} onChange={handleInputChange}
                            disabled={disabled}
                            className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
                                ${disabled ? 'opacity-75 cursor-default' : ''}
                            `}
                            placeholder={placeholder}
                        />
                    )}
                </div>
            </div>
        );
    }
    
    // --- Loading State ---
    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-slate-950">
                    <motion.div
                        className="text-center p-10 bg-slate-900 rounded-xl shadow-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Loader className="animate-spin h-8 w-8 text-blue-400 mx-auto mb-4" />
                        <p className="text-white text-lg">Initializing Session...</p>
                    </motion.div>
                </div>
                <Footer />
            </>
        );
    }

    // Check for currentUser after loading is complete and if isAuthenticated failed
    if (!currentUser) {
         return (
            <div className="min-h-screen pt-24 text-center text-red-400 bg-slate-950">
                <Navbar />
                <p className="mt-10 p-4 bg-red-900/20 border border-red-500/30 rounded-lg max-w-md mx-auto">
                    Authentication complete, but failed to load profile data. Please log in again.
                </p>
                <Footer />
            </div>
        );
    }


    // --- Main Render ---

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        {/* Title and Edit/Save Buttons (Unchanged Logic) */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                                    My Profile
                                </h1>
                                <p className="text-slate-400">Welcome, {currentUser.displayName}!</p>
                            </div>
                            
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCancel}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
                                >
                                        <Save className="w-4 h-4" />
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Status Tags (Using currentUser directly for read-only status) */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                currentUser.membershipStatus === 'approved' 
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                    : currentUser.membershipStatus === 'rejected'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            }`}>
                                {currentUser.membershipStatus === 'approved' ? '✓ Approved Member' : 
                                 currentUser.membershipStatus === 'rejected' ? '✗ Membership Rejected' : 
                                 '⏳ Pending Approval'}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                {currentUser.role === 'ADMIN' ? '👑 Admin' : 
                                 currentUser.role === 'TEACHER' ? '👨‍🏫 Teacher' : 
                                 currentUser.role === 'STUDENT' ? '🎓 Student' : '👤 Guest'}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                                <Sparkles className="w-3 h-3"/> Paras Stones: {currentUser.parasStones}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                                🪙 Coins: {currentUser.coins}
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 shadow-2xl mt-8"
                    >
                        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                            <div className="space-y-8">
                                
                                {/* Personal Information (Core Fields) */}
                                <div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <User className="w-5 h-5 text-blue-400" />
                                        <h2 className="text-xl font-semibold text-white">Identity</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* CRITICAL: Use the direct first_name/last_name fields */}
                                        <ProfileInput label="First Name" name="first_name" icon={User} placeholder="Enter your first name" />
                                        <ProfileInput label="Last Name" name="last_name" icon={User} placeholder="Enter your last name" />
                                        {/* Email is read-only, pulled directly from currentUser */}
                                        <ProfileInput label="Email Address" name="email" icon={Mail} type="email" readOnly={true} /> 
                                        {/* Optional: Add photoURL editor */}
                                        <ProfileInput label="Photo URL" name="photoURL" icon={User} type="url" placeholder="Link to profile photo" /> 
                                    </div>
                                </div>
                                
                                {/* Academic Information (Core Fields) */}
                                <div className="pt-6 border-t border-slate-800">
                                    <div className="flex items-center gap-2 mb-6">
                                        <GraduationCap className="w-5 h-5 text-cyan-400" />
                                        <h2 className="text-xl font-semibold text-white">Academic Details</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ProfileInput label="Institute/University" name="institute" icon={Building2} placeholder="e.g., IISER Berhampur" />
                                        <ProfileInput label="Course/Program" name="course" icon={BookOpen} placeholder="e.g., BS-MS Dual Degree" />
                                    </div>
                                </div>

                                {/* About Section (Core Bio Field) */}
                                <div className="pt-6 border-t border-slate-800">
                                    <div className="flex items-center gap-2 mb-6">
                                        <FileText className="w-5 h-5 text-purple-400" />
                                        <h2 className="text-xl font-semibold text-white">Bio / Designation</h2>
                                    </div>
                                    <div className="space-y-6">
                                        <ProfileInput label="Bio" name="bio" icon={FileText} isTextArea placeholder="Tell us about yourself..." />
                                    </div>
                                </div>
                                
                                {isEditing && (
                                    <div className="flex justify-end gap-3 mt-8">
                                        <button
                                            type="button" 
                                            onClick={handleCancel}
                                            disabled={saving}
                                            className="px-6 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit" 
                                            disabled={saving}
                                            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50"
                                        >
                                            {saving ? <Loader className="w-5 h-5 animate-spin mx-auto"/> : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Profile;