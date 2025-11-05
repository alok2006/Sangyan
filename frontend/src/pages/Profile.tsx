import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, Mail, Save, Edit3, X, Building2, BookOpen, FileText, Sparkles, Loader
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth, UserData } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

// --- Configuration ---
// Define a function to initialize state using the UserData interface
const getInitialProfileData = (userData: UserData | null): UserData => ({
    // Use the comprehensive UserData type for initial structure
    uid: userData?.uid || '',
    email: userData?.email || '',
    displayName: userData?.displayName || '',
    photoURL: userData?.photoURL || null,
    role: userData?.role || 'STUDENT',
    membershipStatus: userData?.membershipStatus || 'pending',
    institute: userData?.institute || '',
    course: userData?.course || '',
    bio: userData?.bio || '',
    parasStones: userData?.parasStones || 0,
    coins: userData?.coins || 0,
});


const Profile: React.FC = () => {
    const { user, userData, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    
    // 📌 FIX 1: Use UserData for the state type
    const [profileData, setProfileData] = useState<UserData>(getInitialProfileData(null));
    const [originalData, setOriginalData] = useState<UserData>(getInitialProfileData(null));
    console.log(userData)
    // --- Data Synchronization Effect ---
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (userData) {
            const data = getInitialProfileData(userData);
            setProfileData(data);
            setOriginalData(data);
        }
    }, [user, userData, navigate]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // The cast to keyof UserData is safe since we only use UserData properties here
        setProfileData(prev => ({ ...prev, [name as keyof UserData]: value }));
    };

    // --- Core Save Handler ---
    const handleSave = async () => {
        if (!user) return;
        
        setSaving(true);
        try {
            // 📌 FIX 2: Pass ONLY the updatable core fields to the context function
            // The context handles the API call to /api/users/{uid}/
            await updateProfile(
                profileData.displayName || '',
                profileData.photoURL || undefined, // photoURL is often managed separately
                profileData.institute,
                profileData.course,
                profileData.bio
            );
            
            toast.success('Profile updated successfully! 🎉');
            setIsEditing(false);
            
            // Re-sync original data after successful save
            setOriginalData(profileData); 
            
        } catch (error) {
            console.error('Error updating profile:', error);
            // Error handling relies on the toast provided by AuthContext
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
        label: string, name: keyof UserData, icon: React.FC<{ className: string }>, 
        type?: string, placeholder?: string, isTextArea?: boolean, readOnly?: boolean
    }> = ({ label, name, icon: Icon, type = 'text', placeholder, isTextArea = false, readOnly = false }) => {
        
        const disabled = !isEditing || readOnly;
        // Access value safely using the UserData structure
        const value = profileData[name] ?? ''; 

        return (
            <div>
                <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-2">
                    {label} {readOnly && <span className="text-red-400 text-xs">(Read-Only)</span>}
                </label>
                <div className="relative">
                    {!isTextArea && <Icon className={`absolute left-3 top-3.5 w-5 h-5 ${readOnly ? 'text-blue-500' : 'text-slate-500'}`} />}
                    {isTextArea ? (
                        <textarea
                            id={name} name={name} value={String(value)} onChange={handleInputChange}
                            disabled={disabled} rows={name === 'bio' ? 4 : 3}
                            className={`w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none
                                ${disabled ? 'opacity-75 cursor-default' : ''}
                            `}
                            placeholder={placeholder}
                        />
                    ) : (
                        <input
                            id={name} type={type} name={name} value={String(value)} onChange={handleInputChange}
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
    if (!userData) {
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
                        <p className="text-white text-lg">Loading Profile Data...</p>
                    </motion.div>
                </div>
                <Footer />
            </>
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
                        {/* Title and Edit/Save Buttons */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                                    My Profile
                                </h1>
                                <p className="text-slate-400">Manage your personal information and preferences</p>
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

                        {/* Status Tags */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                profileData.membershipStatus === 'approved' 
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                    : profileData.membershipStatus === 'rejected'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            }`}>
                                {profileData.membershipStatus === 'approved' ? '✓ Approved Member' : 
                                 profileData.membershipStatus === 'rejected' ? '✗ Membership Rejected' : 
                                 '⏳ Pending Approval'}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                {profileData.role === 'ADMIN' ? '👑 Admin' : 
                                 profileData.role === 'TEACHER' ? '👨‍🏫 Teacher' : 
                                 profileData.role === 'STUDENT' ? '🎓 Student' : '👤 Guest'}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                                <Sparkles className="w-3 h-3"/> Paras Stones: {profileData.parasStones}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                                🪙 Coins: {profileData.coins}
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 shadow-2xl mt-8"
                    >
                        <div className="space-y-8">
                            
                            {/* Personal Information (Core Fields) */}
                            <div>
                                <div className="flex items-center gap-2 mb-6">
                                    <User className="w-5 h-5 text-blue-400" />
                                    <h2 className="text-xl font-semibold text-white">Identity</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ProfileInput label="Full Name" name="displayName" icon={User} placeholder="Enter your full name" />
                                    {/* Email is read-only */}
                                    <ProfileInput label="Email Address" name="email" icon={Mail} type="email" readOnly={true} /> 
                                </div>
                            </div>
                            
                            {/* Academic Information (Core Fields) */}
                            <div className="pt-6 border-t border-slate-800">
                                <div className="flex items-center gap-2 mb-6">
                                    <Building2 className="w-5 h-5 text-cyan-400" />
                                    <h2 className="text-xl font-semibold text-white">Academic Details</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ProfileInput label="Institute/University" name="institute" icon={GraduationCap} placeholder="e.g., IISER Berhampur" />
                                    <ProfileInput label="Course/Program" name="course" icon={BookOpen} placeholder="e.g., BS-MS Dual Degree" />
                                </div>
                            </div>

                            {/* About Section (Core Bio Field) */}
                            <div className="pt-6 border-t border-slate-800">
                                <div className="flex items-center gap-2 mb-6">
                                    <FileText className="w-5 h-5 text-purple-400" />
                                    <h2 className="text-xl font-semibold text-white">Bio</h2>
                                </div>
                                <div className="space-y-6">
                                    <ProfileInput label="Bio" name="bio" icon={FileText} isTextArea placeholder="Tell us about yourself..." />
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Profile; 