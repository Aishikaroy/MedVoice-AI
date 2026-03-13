'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare, Plus, Trash2, ChevronLeft, Clock, MessageCircle, CalendarCheck, CheckCircle, Activity, ShieldCheck, Building } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { cn } from '@/lib/utils';

export default function Sidebar({ 
    currentId, 
    onSelect, 
    onNew,
    history = [],
    isOpen,
    setIsOpen
}: { 
    currentId: string | null, 
    onSelect: (id: string) => void, 
    onNew: () => void,
    history?: any[],
    isOpen: boolean,
    setIsOpen: (open: boolean) => void
}) {
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);

    const deleteEntry = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        // Since history is purely local for now (or passed from parent), 
        // normally we'd delete from parent's state. 
        // For now, let's keep it simple.
        if (confirm('Are you sure you want to remove this from your history?')) {
            // Placeholder: In a real app, notify parent to remove from state/db
        }
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg text-white"
            >
                {isOpen ? <ChevronLeft /> : <MessageSquare />}
            </button>

            {/* Sidebar Container - Fixed on mobile, Relative on desktop */}
            <aside className={cn(
                "fixed lg:relative h-screen transition-all duration-500 z-40 bg-slate-950/50 border-r border-white/5",
                isOpen ? "w-72 lg:w-80 opacity-100" : "w-0 overflow-hidden opacity-0 pointer-events-none lg:pointer-events-auto"
            )}>
                <div className="h-full glass-card bg-slate-900/80 border border-white/10 shadow-2xl flex flex-col overflow-hidden rounded-[40px]">
                    {/* Header */}
                    <div className="p-8 border-b border-white/5 space-y-6">
                        <div className="flex items-center gap-3">
                            <Activity className="w-6 h-6 text-blue-400" />
                            <h2 className="text-xl font-bold text-white tracking-tight">Recent Sessions</h2>
                        </div>
                        
                        {/* New Consultation Button - Clean & Sidebar Aligned */}
                        <button 
                            onClick={onNew}
                            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-95 group cursor-pointer"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            NEW CONSULTATION
                        </button>
                    </div>

                    {/* History List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                        {history.length === 0 ? (
                            <div className="py-20 text-center px-4 opacity-40">
                                <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-4" />
                                <p className="text-xs text-slate-400 italic">No past consultations found yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {history.map((item) => (
                                    <div 
                                        key={item.id}
                                        onClick={() => item.type === 'consultation' && onSelect(item.id)}
                                        className={cn(
                                            "p-4 rounded-2xl flex flex-col gap-1 transition-all border",
                                            currentId === item.id 
                                                ? "bg-blue-600/20 border-blue-500/30 shadow-lg" 
                                                : item.type === 'booking'
                                                    ? "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10"
                                                    : "bg-white/5 border-white/5 hover:bg-white/10",
                                            item.type === 'booking' ? "cursor-default" : "cursor-pointer"
                                        )}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                {item.type === 'booking' ? (
                                                    <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
                                                ) : (
                                                    <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
                                                )}
                                                <span className="text-[11px] font-bold text-slate-100 truncate max-w-[120px]">
                                                    {item.title}
                                                </span>
                                            </div>
                                            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter shrink-0">{item.date}</span>
                                        </div>
                                        
                                        {item.type === 'booking' ? (
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-[9px] text-slate-400 flex items-center gap-1">
                                                    <Building className="w-2.5 h-2.5" />
                                                    {item.details?.hospital || 'Medical Center'}
                                                </p>
                                                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest border border-emerald-500/30 flex items-center gap-1">
                                                    <CheckCircle className="w-2 h-2" /> Confirmed
                                                </span>
                                            </div>
                                        ) : (
                                            item.summary && <p className="text-[10px] text-slate-400 line-clamp-1 italic">"{item.summary}"</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                    {/* Footer Info */}
                    <div className="p-6 text-[9px] text-slate-600 font-bold uppercase tracking-widest text-center border-t border-white/5">
                        <ShieldCheck className="w-3 h-3 text-emerald-500 inline mr-2" /> HIPAA SECURE SESSION
                    </div>
                </div>
            </aside>
            
            {/* Mobile Overlay */}
            <div 
                onClick={() => setIsOpen(false)}
                className={cn(
                    "lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
            />
        </>
    );
}
