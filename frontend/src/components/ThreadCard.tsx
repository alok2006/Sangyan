// src/components/ThreadCard.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Thread, ThreadColor } from '../types';
import { MessageSquare, ChevronUp, ChevronDown, Reply } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Props Definition ---
interface ThreadCardProps {
    thread: Thread;
    // CRITICAL REFACTOR: onReply only needs to pass the thread ID.
    onReply: (threadId: number) => void;
    onToggleReplies?: (threadId: number) => void; 
    
    isRepliesOpen?: boolean; 
    overrideColor?: ThreadColor;
    isReply?: boolean;
}

const ThreadCard: React.FC<ThreadCardProps> = ({
    thread,
    onReply,
    onToggleReplies,
    isRepliesOpen = false,
    overrideColor,
    isReply = false,
}) => {
    const threadColor = overrideColor || thread.color;
    
    const hasReplies = thread.reply_count > 0;
    
    const timeAgo = (dateString: string) => {
        const diffInDays = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24));
        if (diffInDays === 0) return 'today';
        if (diffInDays === 1) return 'yesterday';
        return `${diffInDays} days ago`;
    };

    // Handler to safely call onToggleReplies
    const handleToggleReplies = () => {
        if (onToggleReplies) {
            onToggleReplies(thread.id);
        }
    };

    return (
        <motion.div
            layout 
            variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
            }}
            className={`w-full bg-slate-900/70 backdrop-blur-sm rounded-xl shadow-lg 
                       ${isReply ? 'p-4 border-l-4' : 'p-6 border-l-8 border-t-2 mb-4'} 
                       border-t-slate-800 transition-all duration-300 hover:shadow-2xl hover:bg-slate-900/90`}
            style={{ 
                borderColor: threadColor, // Apply the primary color border
            }}
        >
            {/* Header / Meta Info */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                    <img
                        className="w-8 h-8 rounded-full object-cover border-2"
                        style={{ borderColor: threadColor }}
                        src={thread.user.photoURL || 'https://via.placeholder.com/150/0000FF/FFFFFF?text=A'}
                        alt={thread.user.displayName}
                    />
                    <div>
                        <p className="text-sm font-semibold text-white">{thread.user.displayName}</p>
                        <p className="text-xs text-slate-400">{thread.user.institute}</p>
                    </div>
                </div>
                <div className="text-xs text-slate-500 italic">
                    {timeAgo(thread.created_at)}
                </div>
            </div>

            {/* Title and Content */}
            <Link to={`/thread/${thread.id}`} className="group block">
                {/* Conditionally show title for root threads */}
                {thread.title && !isReply && (
                    <h3 
                        className={`text-xl font-bold transition-colors group-hover:text-cyan-400`}
                        style={{ color: threadColor }}
                    >
                        {thread.title}
                    </h3>
                )}
                <p className={`mt-2 text-sm text-slate-400 line-clamp-3 ${!thread.title || isReply ? 'text-base' : 'text-sm'}`}>
                    {thread.content}
                </p>
            </Link>

            {/* Footer / Actions */}
            <div className={`flex justify-between items-center text-sm mt-4 pt-4 border-t border-slate-700/50`}>
                
                {/* Reply Button - only show for non-reply (root) threads */}
                {!isReply && (
                    <button
                        // FIX: Only pass thread.id
                        onClick={() => onReply(thread.id)}
                        className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors group"
                    >
                        <Reply className="w-4 h-4 text-cyan-400 group-hover:text-white transition-colors" />
                        <span className='font-medium text-slate-300'>Reply</span>
                    </button>
                )}
                
                {/* Show/Hide Replies Button */}
                {!isReply && hasReplies && onToggleReplies && (
                    <button
                        onClick={handleToggleReplies}
                        className={`text-sm text-cyan-400 hover:text-cyan-300 font-semibold transition-colors flex items-center gap-1`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        {isRepliesOpen ? (
                            <>
                                Hide Replies <ChevronUp className="w-4 h-4" />
                            </>
                        ) : (
                            <>
                                Show {thread.reply_count} Replies <ChevronDown className="w-4 h-4" />
                            </>
                        )}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default ThreadCard;