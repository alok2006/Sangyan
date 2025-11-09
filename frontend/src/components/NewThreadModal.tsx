// src/components/NewThreadModal.tsx

import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { X, CornerUpLeft, BookOpen, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThreadColor } from '../types'; 
import toast from 'react-hot-toast';
import axios, { AxiosError } from 'axios';

// Map of categories and their default colors
const CATEGORY_COLORS: { [key: string]: ThreadColor } = {
    'Physics': ThreadColor.INDIGO,
    'Chemistry': ThreadColor.EMERALD,
    'Maths': ThreadColor.ROSE,
    'Biology': ThreadColor.AMBER,
    'Computer Science': ThreadColor.SKY,
    'Site Feedback': ThreadColor.SLATE,
    'General': ThreadColor.SLATE,
};
const CATEGORIES = ['Physics', 'Chemistry', 'Maths', 'Biology', 'Computer Science', 'Site Feedback', 'General'];


interface NewThreadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    parentThreadId?: number | null; 
    // NEW PROP: To display the parent context when replying
    parentThreadTitle?: string; 
}

const NewThreadModal: React.FC<NewThreadModalProps> = ({ isOpen, onClose, onSuccess, parentThreadId = null, parentThreadTitle }) => {
    const { getAuthToken } = useAuth();
    const isReply = !!parentThreadId;

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        subject: isReply ? '' : 'General', 
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    
    const getThreadColor = (subject: string): ThreadColor => {
        return CATEGORY_COLORS[subject] || ThreadColor.SLATE;
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = getAuthToken();
        if (!token) {
            toast.error("Authentication required. Please log in first.");
            setLoading(false);
            return;
        }

        const payload: any = {
            content: formData.content,
            parent_thread: parentThreadId,
            color: getThreadColor(formData.subject), 
        };
        
        if (!isReply) {
            if (!formData.title || !formData.content) {
                toast.error("Title and content are required for a new thread.");
                setLoading(false);
                return;
            }
            payload.title = formData.title;
            payload.subject = formData.subject; 
        } else {
            if (!formData.content) {
                toast.error("Reply content cannot be empty.");
                setLoading(false);
                return;
            }
            // If reply includes a title, include it in the payload (optional)
            if (formData.title && formData.title.trim().length > 0) {
                payload.title = formData.title.trim();
            }
        }
        
        try {
            await axios.post(`/api/threads/`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            toast.success(isReply ? 'Reply posted successfully! 🎉' : 'Thread created successfully! 🎉');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Thread submission error:', error);
            const axiosError = error as AxiosError;
            
            const errorData = axiosError.response?.data;
            let errorMessage = 'Failed to submit post.';

            if (errorData) {
                if (errorData.detail) errorMessage = errorData.detail;
                else if (errorData.subject) errorMessage = `Subject error: ${errorData.subject[0]}`;
                else if (errorData.title) errorMessage = `Title error: ${errorData.title[0]}`;
                else if (errorData.non_field_errors) errorMessage = errorData.non_field_errors[0];
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 30 } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15 } }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <motion.div
                key="modal"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-slate-800 rounded-xl shadow-2xl border border-cyan-500/20 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="text-white text-2xl font-bold flex items-center gap-3">
                        {isReply ? (
                            <>
                                <CornerUpLeft className="w-6 h-6 text-cyan-400" /> Post a Reply
                            </>
                        ) : (
                            <>
                                <MessageSquare className="w-6 h-6 text-cyan-400" /> Start a New Thread
                            </>
                        )}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Parent Thread Context (CRITICALLY ADDED) */}
                {isReply && parentThreadTitle && (
                    <div className="p-4 bg-slate-900 border-b border-slate-700">
                        <p className="text-xs font-medium text-cyan-400 mb-1">Replying to:</p>
                        <h3 className="text-base font-semibold text-white truncate">{parentThreadTitle}</h3>
                    </div>
                )}


                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    
                    {!isReply && (
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                                Category *
                            </label>
                            <div className="relative">
                                <BookOpen className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all appearance-none"
                                    required
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                    
                    {/* Title Input (Only for root threads) */}
                    {/* Title Input - show for both threads and replies (optional for replies) */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                            {isReply ? 'Title (optional)' : 'Thread Title *'}
                        </label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder={isReply ? 'Optional short title for your reply' : 'A concise summary of your question or discussion'}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                            {...(!isReply ? { required: true } : {})}
                        />
                    </div>

                    {/* Content/Body Input */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
                            {isReply ? 'Your Reply *' : 'Content/Details *'}
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder={isReply ? "Type your detailed reply here..." : "Describe your question or start the discussion..."}
                            rows={isReply ? 4 : 6}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Posting...
                            </span>
                        ) : (
                            isReply ? 'Submit Reply' : 'Create Thread'
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default NewThreadModal;