'use client';

import React, { useState } from 'react';
import dynamicImport from 'next/dynamic';

// skip server-side rendering for browser-specific APIs
const ChatbotUI = dynamicImport(() => import('./ChatbotUI'), { ssr: false });

export const dynamic = 'force-dynamic';

export default function ChatbotPage() {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen relative flex flex-col bg-slate-950 overflow-hidden">
            {/* Background Glows */}
            <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Main Content Area */}
            <div className="flex-1 transition-all duration-500 relative z-10 w-full">
                <ChatbotUI 
                    selectedConversationId={selectedConversationId}
                    onConversationChange={(id) => setSelectedConversationId(id)}
                />
            </div>
        </div>
    );
}
