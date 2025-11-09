// src/api/threadApi.ts

import axios from 'axios';
import { Thread, ThreadDetail, ThreadColor } from '../types'; 

interface ThreadCreatePayload {
    title?: string;
    content: string;
    subject?: string; // Required for root threads
    color: ThreadColor;
    parent_thread: number | null; // null for a root thread
}

export const fetchRootThreadsAPI = async (
    page: number, 
    category: string, 
    searchQuery: string
): Promise<{ threads: Thread[], totalPages: number }> => {
    
    const params = new URLSearchParams({ 
        page: page.toString(), 
        // category: category, 
        search: searchQuery || '',
        parent_thread: 'null' 
    });

    const response = await axios.get(`/api/threads/?${params.toString()}`);
    console.log('Fetched root threads:', response.data); // ✅ DEBUG
    return { 
        threads: response.data.threads || [], 
        totalPages: response.data.total_pages || 1
    };
};
export const fetchThreadDetailAPI = async (
    threadId: number
): Promise<ThreadDetail> => {
    const response = await axios.get(`/api/threads/${threadId}/`); 
    return response.data as ThreadDetail; 
};


export const createThreadAPI = async (
    payload: ThreadCreatePayload, 
    authToken: string
): Promise<Thread> => {

    const response = await axios.post(`/api/threads/`, payload, {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
        }
    });

    // The backend should return the newly created thread object
    return response.data as Thread;
};