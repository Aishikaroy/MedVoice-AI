'use client';

import React, { useState, useEffect } from 'react';
import nextDynamic from 'next/dynamic';

// Import ChatbotUI dynamically with SSR disabled
const ChatbotUI = nextDynamic(() => import('./ChatbotUI'), { 
    ssr: false,
    loading: () => (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse">Loading Medical AI...</p>
            </div>
        </div>
    )
});

export default function ChatbotPage() {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    return (
        <div className="min-h-screen relative flex flex-col bg-slate-950 overflow-hidden">
            {/* Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Main Content Area */}
            <div className="flex-1 transition-all duration-500 relative z-10 w-full text-white">
                <ChatbotUI 
                    selectedConversationId={selectedConversationId}
                    onConversationChangeAction={(id: string | null) => setSelectedConversationId(id)}
                />
            </div>
        </div>
    );
}

