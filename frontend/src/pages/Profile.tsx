import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, BookOpen, GraduationCap, FileText, Loader2, Sparkles, Gem } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar'; // Assuming it's still needed
import Footer from '../components/Footer'; // Assuming it's still needed
import { User as UserType } from '../types'; // Import the main User type

// ------------------------------
// 1️⃣ Types
// ------------------------------
type EditableProfileFields = Pick<UserType, 
  'first_name' | 'last_name' | 'photoURL' | 'institute' | 'course' | 'bio'
>;

type ProfileInputProps = {
  label: string;
  name: keyof EditableProfileFields | 'email';
  icon: React.FC<{ className?: string }>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder?: string;
  isTextArea?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
};

// ------------------------------
// 2️⃣ Memoized ProfileInput (Refined for theme)
// ------------------------------
const ProfileInput: React.FC<ProfileInputProps> = memo(
  ({
    label,
    name,
    icon: Icon,
    value,
    onChange,
    type = 'text',
    placeholder,
    isTextArea = false,
    readOnly = false,
    disabled = false,
  }) => {
    const stringValue = String(value ?? '');
    const isDisabled = disabled || readOnly;

    return (
      <div>
        <label
          htmlFor={String(name)}
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          {label}{' '}
          {readOnly && <span className="text-red-400 text-xs">(Read-Only)</span>}
        </label>
        <div className="relative">
          {!isTextArea && (
            <Icon
              className={`absolute left-3 top-3.5 w-5 h-5 ${
                readOnly ? 'text-blue-500' : 'text-slate-500'
              }`}
            />
          )}
          {isTextArea ? (
            <textarea
              id={String(name)}
              name={String(name)}
              value={stringValue}
              onChange={onChange}
              disabled={isDisabled}
              rows={name === 'bio' ? 4 : 3}
              className={`w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                isDisabled ? 'opacity-75 cursor-default' : ''
              }`}
              placeholder={placeholder}
            />
          ) : (
            <input
              id={String(name)}
              type={type}
              name={String(name)}
              value={stringValue}
              onChange={onChange}
              disabled={isDisabled}
              className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                isDisabled ? 'opacity-75 cursor-default' : ''
              }`}
              placeholder={placeholder}
            />
          )}
        </div>
      </div>
    );
  }
);
ProfileInput.displayName = 'ProfileInput';

// ------------------------------
// 3️⃣ Main Profile Component (Themed)
// ------------------------------
const Profile: React.FC = () => {
  const { currentUser, updateProfile, refreshUserData, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false); // Added isEditing state
  
  const [profileData, setProfileData] = useState<EditableProfileFields>({
    first_name: '',
    last_name: '',
    photoURL: '',
    institute: '',
    course: '',
    bio: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  // Load user data into local state
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        photoURL: currentUser.photoURL || '',
        institute: currentUser.institute || '',
        course: currentUser.course || '',
        bio: currentUser.bio || '',
      });
    }
  }, [currentUser]);

  // Stable input handler
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      // We rely on the name property matching the keyof EditableProfileFields
      setProfileData((prev) => ({ ...prev, [name]: value })); 
    },
    []
  );

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await updateProfile(
        profileData.first_name,
        profileData.last_name,
        profileData.photoURL,
        profileData.institute,
        profileData.course,
        profileData.bio
      );
      // We rely on updateProfile's internal call to refreshUserData
      // to update currentUser, triggering the useEffect above.
      toast.success('Profile updated successfully! 🎉');
      setIsEditing(false); // Disable editing on successful save
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  }, [profileData, updateProfile]);

  const handleCancel = useCallback(() => {
      // Re-sync local state with the last known good context state
      if (currentUser) {
        setProfileData({
          first_name: currentUser.first_name || '',
          last_name: currentUser.last_name || '',
          photoURL: currentUser.photoURL || '',
          institute: currentUser.institute || '',
          course: currentUser.course || '',
          bio: currentUser.bio || '',
        });
      }
      setIsEditing(false);
  }, [currentUser]);

  if (loading) {
    return (
        <div className="min-h-screen pt-24 flex justify-center items-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
        </div>
    );
  }
  
  // Guard for unauthenticated/missing data (for consistency with ProtectedRoute logic)
  if (!currentUser) {
      // NOTE: In a production app, ProtectedRoute usually handles this redirect.
      return <div className="min-h-screen text-red-400 p-20 bg-slate-950">Error: User data not found.</div>
  }
  
  const isDisabled = isSaving || !isEditing;

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-24 pb-16">
        <motion.div
            className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* --- Header and Action Buttons --- */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                            My Profile
                        </h1>
                        <p className="text-slate-400">Manage your personal information, {currentUser.displayName || currentUser.email}.</p>
                    </div>
                    
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-cyan-600"
                        >
                            <User className="w-4 h-4 inline mr-1" /> Edit Profile
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleCancel}
                                disabled={isSaving}
                                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-green-500/25 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSaving && <Loader2 className="animate-spin w-4 h-4" />}
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>

                {/* --- Status Tags --- */}
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
                        <Sparkles className="w-3 h-3"/> Paras Stones: {currentUser.parasStones.toLocaleString()}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                        <Gem className="w-3 h-3"/> Coins: {currentUser.coins.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* --- Profile Form Container --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 shadow-2xl"
            >
                <div className="space-y-8">
                    
                    {/* Personal Information */}
                    <div>
                        <h2 className="text-xl font-semibold text-white border-b border-slate-800 pb-3 mb-6">Personal Identity</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ProfileInput
                                label="First Name"
                                name="first_name"
                                icon={User}
                                value={profileData.first_name}
                                onChange={handleInputChange}
                                placeholder="Enter your first name"
                                disabled={!isEditing}
                            />
                            <ProfileInput
                                label="Last Name"
                                name="last_name"
                                icon={User}
                                value={profileData.last_name}
                                onChange={handleInputChange}
                                placeholder="Enter your last name"
                                disabled={!isEditing}
                            />
                            <ProfileInput
                                label="Email Address"
                                name="email"
                                icon={Mail}
                                value={currentUser.email}
                                onChange={() => {}} // Read-only, so handler is a no-op
                                readOnly
                            />
                            <ProfileInput
                                label="Photo URL"
                                name="photoURL"
                                icon={User}
                                type="url"
                                value={profileData.photoURL || ''}
                                onChange={handleInputChange}
                                placeholder="Link to profile photo"
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                    
                    {/* Academic Information */}
                    <div className="pt-6 border-t border-slate-800">
                        <h2 className="text-xl font-semibold text-white border-b border-slate-800 pb-3 mb-6">Academic Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ProfileInput
                                label="Institute"
                                name="institute"
                                icon={BookOpen}
                                value={profileData.institute || ''}
                                onChange={handleInputChange}
                                placeholder="e.g., IISER Berhampur"
                                disabled={!isEditing}
                            />
                            <ProfileInput
                                label="Course"
                                name="course"
                                icon={GraduationCap}
                                value={profileData.course || ''}
                                onChange={handleInputChange}
                                placeholder="e.g., BS-MS Dual Degree"
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="pt-6 border-t border-slate-800">
                        <h2 className="text-xl font-semibold text-white border-b border-slate-800 pb-3 mb-6">Bio / About Me</h2>
                        <ProfileInput
                            label="Bio"
                            name="bio"
                            icon={FileText}
                            value={profileData.bio || ''}
                            onChange={handleInputChange}
                            isTextArea
                            placeholder="Tell us something about yourself"
                            disabled={!isEditing}
                        />
                    </div>
                </div>
                
                {/* Save/Cancel Buttons (Mobile/Bottom) */}
                {isEditing && (
                    <div className="mt-8 flex justify-end gap-3">
                         <button
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="px-6 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSaving && <Loader2 className="animate-spin w-4 h-4" />}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </motion.div>
        </motion.div>
        <Footer />
    </div>
    </>
  );
};

export default Profile;