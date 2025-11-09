import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import {
  fetchRootThreadsAPI as fetchThreadsAPI,
  fetchThreadDetailAPI as fetchThreadRepliesAPI,
  createThreadAPI,
} from "../api/threadApi";
import ThreadCard from "../components/ThreadCard";
import NewThreadModal from "../components/NewThreadModal";
import { Thread } from "../types";
import { Lightbulb } from "lucide-react";
import { HiSparkles } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

const ThreadView: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [openReplies, setOpenReplies] = useState<Record<number, Thread[]>>({});
  const [expandedThreads, setExpandedThreads] = useState<Record<number, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalParentId, setModalParentId] = useState<number | null>(null);
  const [modalParentTitle, setModalParentTitle] = useState<string | undefined>(undefined);

  // --- LOAD MAIN THREADS ---
  const loadData = useCallback(async (page: number = 1, category: string | null = null, query: string = "") => {
    try {
      setLoading(true);
  const data = await fetchThreadsAPI(page, category ?? '', query);
      const result = data?.threads || data?.results || data || [];
      setThreads(result);
      setCurrentPage(page);
    } catch (err) {
      toast.error("Failed to load threads.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- TOGGLE REPLIES ---
  const toggleReplies = async (threadId: number) => {
    const isOpen = expandedThreads[threadId];
    setExpandedThreads((prev) => ({ ...prev, [threadId]: !isOpen }));

    if (openReplies[threadId]) return; // already fetched

    try {
      toast.loading("Loading replies...", { id: `replies-${threadId}` });
      console.log('[toggleReplies] fetching replies for', threadId);
      const res = await fetchThreadRepliesAPI(threadId);
      console.log('[toggleReplies] fetch response for', threadId, res);

      const replies =
        Array.isArray(res)
          ? res
          : Array.isArray(res?.results)
          ? res.results
          : Array.isArray(res?.threads)
          ? res.threads
          : res?.replies && Array.isArray(res.replies)
          ? res.replies
          : [];

      if (replies.length === 0) {
        toast("No replies found for this thread", { icon: "💬" });
      }

      setOpenReplies((prev) => ({ ...prev, [threadId]: replies }));
      toast.success("Replies loaded!", { id: `replies-${threadId}` });
    } catch (error) {
      console.error("Error loading replies:", error);
      // Show more details when available
      // @ts-ignore
      const errResp = error?.response?.data || error?.message;
      console.error('[toggleReplies] error response:', errResp);
      toast.error("Failed to load replies", { id: `replies-${threadId}` });
    }
  };

  // --- HANDLE POST REPLY ---
  const handleReply = async (parentId: number, content: string) => {
    try {
      const newReply = await createThreadAPI({ parent_thread: parentId, content });
      setOpenReplies((prev) => ({
        ...prev,
        [parentId]: [...(prev[parentId] || []), newReply],
      }));
      toast.success("Reply added!");
    } catch (error) {
      toast.error("Failed to post reply");
      console.error(error);
    }
  };

  // Recursive renderer for nested replies
  const renderReplies = (parentId: number, level = 1) => {
    const replies = openReplies[parentId];
    if (!replies || replies.length === 0) return null;

    return (
      <div style={{ paddingLeft: level * 18 }} className="mt-3">
        <AnimatePresence initial={false}>
          {replies.map((reply) => (
            <motion.div
              key={reply.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="mb-3"
            >
              <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-3">
                <ThreadCard
                  thread={reply}
                  onReply={(id: number) => {
                    setModalParentId(id);
                    setModalParentTitle(reply.title || reply.content.slice(0, 120));
                    setIsModalOpen(true);
                  }}
                  onToggleReplies={() => toggleReplies(reply.id)}
                  isRepliesOpen={expandedThreads[reply.id]}
                  isReply={true}
                />
              </div>

              {/* recursively render child replies */}
              {expandedThreads[reply.id] && renderReplies(reply.id, level + 1)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-cyan-900 relative overflow-hidden flex flex-col items-center py-20">
      {/* 🔵 Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -top-20 -left-20 animate-blob"></div>
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -bottom-20 -right-20 animate-blob animation-delay-2000"></div>
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-blob animation-delay-4000"></div>
      </div>

      {/* 🔹 Header with Glow */}
      <motion.div
        className="relative flex flex-col items-center justify-center space-y-3 mb-14"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-400 rounded-xl blur-md opacity-50"></div>
          <div className="relative bg-gradient-to-br from-cyan-400 to-blue-500 p-3 rounded-xl shadow-lg">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-white">
            Sangyan Discussions
          </h1>
          <p className="mt-1 text-sm lg:text-base text-slate-300/90 max-w-2xl">
            A friendly place to ask, learn and share — discussions, doubts and peer help from the Sangyan community.
          </p>
        </div>
        <HiSparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
      </motion.div>

      {/* Create Thread Button */}
      <div className="w-full max-w-7xl mx-auto px-6 mb-6 flex justify-end">
        <button
          onClick={() => { setModalParentId(null); setModalParentTitle(undefined); setIsModalOpen(true); }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all"
        >
          + Create New Thread
        </button>
      </div>

      {/* 🔹 Threads Container */}
      <div className="relative w-full max-w-7xl mx-auto bg-gradient-to-br from-slate-800/60 to-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-600/10 p-8 animate-fade-in-up animation-delay-200">
        {loading && <p className="text-center text-gray-400">Loading threads...</p>}
        {threads.length === 0 && !loading && (
          <p className="text-center text-gray-400">No threads available.</p>
        )}

        <div className="space-y-6">
          {threads.map((thread) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32 }}
              className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-6 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-slate-700/50"
            >
              <ThreadCard
                thread={thread}
                onReply={(id: number) => {
                  setModalParentId(id);
                  setModalParentTitle(thread.title || thread.content.slice(0, 120));
                  setIsModalOpen(true);
                }}
                onToggleReplies={() => toggleReplies(thread.id)}
                isRepliesOpen={expandedThreads[thread.id]}
              />

              {expandedThreads[thread.id] && openReplies[thread.id] && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.36 }}
                  className="pl-6 border-l-2 border-cyan-700/30 mt-4"
                >
                  <AnimatePresence initial={false}>
                    {openReplies[thread.id].map((reply) => (
                      <motion.div
                        key={reply.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="mb-3"
                      >
                        <div className="pl-2">
                          <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-3">
                            <ThreadCard
                          key={reply.id}
                          thread={reply}
                          onReply={(id: number) => {
                            setModalParentId(id);
                            setModalParentTitle(reply.title || reply.content.slice(0, 120));
                            setIsModalOpen(true);
                          }}
                          onToggleReplies={() => toggleReplies(reply.id)}
                          isRepliesOpen={expandedThreads[reply.id]}
                          isReply={true}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* 🔹 Pagination */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50"
            onClick={() => loadData(currentPage - 1, selectedCategory, searchQuery)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105"
            onClick={() => loadData(currentPage + 1, selectedCategory, searchQuery)}
          >
            Next
          </button>
        </div>
      </div>
      {/* New Thread Modal */}
      <NewThreadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => { loadData(1, selectedCategory, searchQuery); }}
        parentThreadId={modalParentId}
        parentThreadTitle={modalParentTitle}
      />
    </div>
  );
};

export default ThreadView;