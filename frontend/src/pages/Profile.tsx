import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { 
    User, Mail, Phone, MapPin, Calendar, Briefcase, GraduationCap, Github, Linkedin, Twitter, Globe, Save, Edit3, X,
    Building2, BookOpen, Award, FileText, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

interface ProfileData {
    uid: string;
    displayName: string;
    email: string;
    institute: string;
    course: string;
    bio: string;
    membershipStatus: 'pending' | 'approved' | 'rejected' | string;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN' | string;

    phone: string; dateOfBirth: string; gender: string; yearOfStudy: string; 
    enrollmentNumber: string; department: string; specialization: string; 
    address: string; city: string; state: string; pincode: string; 
    interests: string; skills: string; achievements: string; 
    githubUrl: string; linkedinUrl: string; twitterUrl: string; websiteUrl: string;
}

const getInitialProfileData = (userData: any): ProfileData => ({
    uid: userData?.uid || '',
    displayName: userData?.displayName || '',
    email: userData?.email || '',
    institute: userData?.institute || '',
    course: userData?.course || '',
    bio: userData?.bio || '',
    membershipStatus: userData?.membershipStatus || 'pending',
    role: userData?.role || 'guest',

    phone: '', dateOfBirth: '', gender: '', yearOfStudy: '', enrollmentNumber: '', 
    department: '', specialization: '', address: '', city: '', state: '', pincode: '', 
    interests: '', skills: '', achievements: '', githubUrl: '', linkedinUrl: '', 
    twitterUrl: '', websiteUrl: '',
});


const Profile: React.FC = () => {
    const { user, userData, refreshUserData, getAuthToken } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading] = useState(false); // Rely on context for initial loading
    
    const [profileData, setProfileData] = useState<ProfileData>(getInitialProfileData(null));
    const [originalData, setOriginalData] = useState<ProfileData>(getInitialProfileData(null));

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


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!user || !getAuthToken()) return;
        
        setSaving(true);
        try {
            const coreUserPayload = {
                displayName: profileData.displayName,
                institute: profileData.institute,
                course: profileData.course,
                bio: profileData.bio,
            };

            // 2. Extended Profile Payload (Fields NOT in your primary Django User model)
            // NOTE: For a complete solution, Django requires a separate Profile Model and corresponding API endpoint (e.g., /profile-details/{uid}/).
            const extendedProfilePayload = {
                phone: profileData.phone, dateOfBirth: profileData.dateOfBirth, gender: profileData.gender, 
                yearOfStudy: profileData.yearOfStudy, enrollmentNumber: profileData.enrollmentNumber, 
                department: profileData.department, specialization: profileData.specialization, 
                address: profileData.address, city: profileData.city, state: profileData.state, 
                pincode: profileData.pincode, interests: profileData.interests, skills: profileData.skills, 
                achievements: profileData.achievements, githubUrl: profileData.githubUrl, 
                linkedinUrl: profileData.linkedinUrl, twitterUrl: profileData.twitterUrl, 
                websiteUrl: profileData.websiteUrl,
            };
            
            const token = getAuthToken();
            const headers = { Authorization: `Bearer ${token}` };
            await axios.put(`/users/${user.uid}/`, coreUserPayload, { headers });
            await refreshUserData();
            
            toast.success('Profile updated successfully! 🎉');
            setIsEditing(false);
            
        } catch (error) {
            console.error('Error updating profile:', error);
            const axiosError = error as AxiosError;
            const errorData = axiosError.response?.data as any;
            
            let errorMessage = 'Failed to update profile.';
            if (axiosError.response?.status === 400 && errorData) {
                errorMessage = JSON.stringify(errorData, null, 2).replace(/[{}"\\]/g, '').replace(/,/g, '\n');
            }
            
            toast.error(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setProfileData(originalData); 
    };
    const ProfileInput: React.FC<{ 
        label: string, name: keyof ProfileData, icon: React.FC<{ className: string }>, 
        type?: string, placeholder?: string, isTextArea?: boolean
    }> = ({ label, name, icon: Icon, type = 'text', placeholder, isTextArea = false }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-2">
                {label}
            </label>
            <div className="relative">
                {!isTextArea && <Icon className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />}
                {isTextArea ? (
                    <textarea
                        id={name} name={name} value={profileData[name] || ''} onChange={handleInputChange}
                        disabled={!isEditing} rows={name === 'bio' ? 4 : 3}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all resize-none"
                        placeholder={placeholder}
                    />
                ) : (
                    <input
                        id={name} type={type} name={name} value={profileData[name] || ''} onChange={handleInputChange}
                        disabled={!isEditing}
                        //@ts-ignore
                        className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all`}
                        placeholder={placeholder}
                    />
                )}
            </div>
        </div>
    );
    
    const ProfileSelect: React.FC<{ label: string, name: keyof ProfileData, options: { value: string, label: string }[] }> = ({ label, name, options }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-2">
                {label}
            </label>
            <select
                id={name} name={name} value={profileData[name] || ''} onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
                <option value="">Select {label}</option>
                {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        </div>
    );


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
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25"
                                    >
                                        <Save className="w-4 h-4" />
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
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
                                <Sparkles className="w-3 h-3"/> Paras Stones: {userData?.parasStones || 0}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                                🪙 Coins: {userData?.coins || 0}
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 shadow-2xl"
                    >
                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center gap-2 mb-6">
                                    <User className="w-5 h-5 text-blue-400" />
                                    <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ProfileInput label="Full Name" name="displayName" icon={User} placeholder="Enter your full name" />
                                    <div className="pointer-events-none">
                                        <ProfileInput label="Email Address" name="email" icon={Mail} type="email" />
                                    </div>
                                    <ProfileInput label="Phone Number" name="phone" icon={Phone} type="tel" placeholder="+91 XXXXX XXXXX" />
                                    <ProfileInput label="Date of Birth" name="dateOfBirth" icon={Calendar} type="date" />
                                    <ProfileSelect 
                                        label="Gender" 
                                        name="gender" 
                                        options={[
                                            { value: 'male', label: 'Male' },
                                            { value: 'female', label: 'Female' },
                                            { value: 'other', label: 'Other' },
                                            { value: 'prefer-not-to-say', label: 'Prefer not to say' },
                                        ]}
                                    />
                                </div>
                            </div>

                            {/* Academic Information */}
                            <div className="pt-6 border-t border-slate-800">
                                <div className="flex items-center gap-2 mb-6">
                                    <GraduationCap className="w-5 h-5 text-cyan-400" />
                                    <h2 className="text-xl font-semibold text-white">Academic Information</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ProfileInput label="Institute/University" name="institute" icon={Building2} placeholder="e.g., IISER Berhampur" />
                                    <ProfileInput label="Course/Program" name="course" icon={BookOpen} placeholder="e.g., BS-MS Dual Degree" />
                                    <ProfileSelect 
                                        label="Year of Study" 
                                        name="yearOfStudy" 
                                        options={[
                                            { value: '1', label: '1st Year' },
                                            { value: '2', label: '2nd Year' },
                                            { value: '3', label: '3rd Year' },
                                            { value: '4', label: '4th Year' },
                                            { value: '5', label: '5th Year' },
                                        ]}
                                    />
                                    <ProfileInput label="Enrollment Number" name="enrollmentNumber" icon={FileText} placeholder="Your enrollment number" />
                                    <ProfileInput label="Department" name="department" icon={Briefcase} placeholder="e.g., Physics, Chemistry" />
                                    <ProfileInput label="Specialization" name="specialization" icon={Award} placeholder="Your area of interest" />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-800">
                                <div className="flex items-center gap-2 mb-6">
                                    <MapPin className="w-5 h-5 text-emerald-400" />
                                    <h2 className="text-xl font-semibold text-white">Address Information</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    <ProfileInput label="Address" name="address" icon={MapPin} placeholder="Street address" />
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <ProfileInput label="City" name="city" icon={MapPin} placeholder="City" />
                                        <ProfileInput label="State" name="state" icon={MapPin} placeholder="State" />
                                        <ProfileInput label="PIN Code" name="pincode" icon={MapPin} placeholder="PIN Code" />
                                    </div>
                                </div>
                            </div>

                            {/* About Section */}
                            <div className="pt-6 border-t border-slate-800">
                                <div className="flex items-center gap-2 mb-6">
                                    <FileText className="w-5 h-5 text-purple-400" />
                                    <h2 className="text-xl font-semibold text-white">About You</h2>
                                </div>
                                <div className="space-y-6">
                                    <ProfileInput label="Bio" name="bio" icon={FileText} isTextArea placeholder="Tell us about yourself..." />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ProfileInput label="Interests" name="interests" icon={Sparkles} placeholder="e.g., Physics, AI, Web Dev" />
                                        <ProfileInput label="Skills" name="skills" icon={Award} placeholder="e.g., Python, React, MATLAB" />
                                    </div>
                                    <ProfileInput label="Achievements" name="achievements" icon={Award} isTextArea placeholder="List your achievements and awards..." />
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="pt-6 border-t border-slate-800">
                                <div className="flex items-center gap-2 mb-6">
                                    <Globe className="w-5 h-5 text-indigo-400" />
                                    <h2 className="text-xl font-semibold text-white">Social Links</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ProfileInput label="GitHub" name="githubUrl" icon={Github} type="url" placeholder="https://github.com/username" />
                                    <ProfileInput label="LinkedIn" name="linkedinUrl" icon={Linkedin} type="url" placeholder="https://linkedin.com/in/username" />
                                    <ProfileInput label="Twitter/X" name="twitterUrl" icon={Twitter} type="url" placeholder="https://twitter.com/username" />
                                    <ProfileInput label="Website/Portfolio" name="websiteUrl" icon={Globe} type="url" placeholder="https://yourwebsite.com" />
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