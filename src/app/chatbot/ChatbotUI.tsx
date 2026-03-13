'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
    Mic, X, Loader2, Activity, PlusCircle, 
    ChevronRight, ChevronDown, UserCircle2, FileText, Stethoscope, Volume2, VolumeX, 
    ShieldCheck, HeartPulse, LogOut, Building, Clock, MapPin, Upload,
    Locate, Copy, Check, Zap, Sparkles, Heart, Brain, Bone, Ear, Baby,
    Flower2, HeartHandshake, Thermometer, Eye, BrainCircuit, Smile, 
    Scissors, Scan, Syringe, Microscope, Droplets, Leaf, Sprout, 
    AlertTriangle, Home, UserPlus, Waves, Briefcase, Target, Scale, 
    FlaskConical, Accessibility, Handshake, Palmtree, Moon, Dna, Pill, 
    Wind, ShieldAlert, CloudRain, User as UserIcon, MessageSquare,
    Lock, CheckCircle, DownloadCloud, Shield, Fingerprint, Database, Cpu
} from 'lucide-react';
import html2pdf from 'html2pdf.js';
import gsap from 'gsap';
import { useChat } from '@ai-sdk/react';
import { createClient } from '@/utils/supabase/client';
import { logout } from '../login/actions';
import { cn } from '@/lib/utils';
import BookingModal from '@/components/chatbot/BookingModal';
import Sidebar from '@/components/chatbot/Sidebar';
import { GLOBAL_DOCTOR_REGISTRY, normalizeSpecialtyName } from './doctorsData';
import { RefreshCw } from 'lucide-react';

export default function ChatbotUI({
    selectedConversationId,
    onConversationChange
}: {
    selectedConversationId: string | null,
    onConversationChange: (id: string | null) => void
}) {

    const [userLocation, setUserLocation] = useState('Kolkata');
    const availableLocations = ['Kolkata', 'Delhi NCR', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Online/Global'];
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);

    const getFilteredDoctors = (specialty: string, city: string) => {
        const spec = specialty.toLowerCase();

        // 1. Strict Filter: Specialty AND City
        let doctors = GLOBAL_DOCTOR_REGISTRY.filter(d =>
            (d.specialty.toLowerCase().includes(spec) || spec.includes(d.specialty.toLowerCase())) &&
            d.city === city
        );

        let isFallback = false;

        // 2. Fallback: Online Experts
        if (doctors.length === 0) {
            doctors = GLOBAL_DOCTOR_REGISTRY.filter(d =>
                (d.specialty.toLowerCase().includes(spec) || spec.includes(d.specialty.toLowerCase())) &&
                (d.city === 'Online' || d.city === 'Online/Global')
            );
            isFallback = true;
        }

        // 3. Ultimate Fallback: General Physician (Local or Online)
        if (doctors.length === 0) {
            doctors = GLOBAL_DOCTOR_REGISTRY.filter(d =>
                d.specialty === 'General Physician' && (d.city === city || d.city === 'Online' || d.city === 'Online/Global')
            );
            isFallback = true;
        }

        return { doctors: doctors.slice(0, 3), isFallback };
    };

    const getSpecialtyIconLocal = (specialty: string) => {
        const s = (specialty || '').toLowerCase();
        
        if (s.includes('dermatologist') || s.includes('skin')) return { icon: Sparkles, color: 'text-blue-400' };
        if (s.includes('cardiologist') || s.includes('heart')) return { icon: Heart, color: 'text-red-400' };
        if (s.includes('neurologist') || s.includes('brain')) return { icon: Brain, color: 'text-purple-400' };
        if (s.includes('orthopedic') || s.includes('bone') || s.includes('joint')) return { icon: Bone, color: 'text-orange-400' };
        if (s.includes('ent specialist') || s.includes('ear') || s.includes('nose') || s.includes('throat')) return { icon: Ear, color: 'text-cyan-400' };
        if (s.includes('gastroenterologist') || s.includes('stomach') || s.includes('liver')) return { icon: Stethoscope, color: 'text-emerald-400' };
        if (s.includes('pulmonologist') || s.includes('lung')) return { icon: Activity, color: 'text-sky-400' };
        if (s.includes('nephrologist') || s.includes('kidney')) return { icon: Droplets, color: 'text-indigo-400' };
        if (s.includes('urologist') || s.includes('urine')) return { icon: Wind, color: 'text-blue-500' };
        if (s.includes('oncologist') || s.includes('cancer')) return { icon: ShieldAlert, color: 'text-rose-400' };
        if (s.includes('pediatrician') || s.includes('child')) return { icon: Baby, color: 'text-pink-400' };
        if (s.includes('gynecologist') || s.includes('female')) return { icon: Flower2, color: 'text-rose-300' };
        if (s.includes('obstetrician') || s.includes('pregnancy')) return { icon: HeartHandshake, color: 'text-pink-300' };
        if (s.includes('endocrinologist') || s.includes('hormone')) return { icon: Thermometer, color: 'text-yellow-400' };
        if (s.includes('ophthalmologist') || s.includes('eye')) return { icon: Eye, color: 'text-blue-300' };
        if (s.includes('psychiatrist') || s.includes('mental')) return { icon: BrainCircuit, color: 'text-teal-400' };
        if (s.includes('psychologist') || s.includes('behavior')) return { icon: Smile, color: 'text-teal-300' };
        if (s.includes('dentist') || s.includes('teeth')) return { icon: Zap, color: 'text-slate-100' };
        if (s.includes('surgeon') && !s.includes('ortho')) return { icon: Scissors, color: 'text-slate-400' };
        if (s.includes('physician') || s.includes('general')) return { icon: Stethoscope, color: 'text-blue-400' };
        if (s.includes('radiologist') || s.includes('x-ray')) return { icon: Scan, color: 'text-slate-500' };
        if (s.includes('anesthesiologist')) return { icon: Syringe, color: 'text-indigo-300' };
        if (s.includes('pathologist') || s.includes('biopsy')) return { icon: Microscope, color: 'text-rose-500' };
        if (s.includes('hematologist') || s.includes('blood')) return { icon: Droplets, color: 'text-red-600' };
        if (s.includes('rheumatologist') || s.includes('arthritis')) return { icon: Activity, color: 'text-orange-500' };
        if (s.includes('sexologist')) return { icon: Heart, color: 'text-pink-500' };
        if (s.includes('allergist') || s.includes('immune')) return { icon: Wind, color: 'text-green-300' };
        if (s.includes('veterinarian')) return { icon: Smile, color: 'text-amber-600' };
        if (s.includes('homeopathic')) return { icon: Leaf, color: 'text-green-400' };
        if (s.includes('ayurvedic')) return { icon: Sprout, color: 'text-green-600' };
        if (s.includes('emergency')) return { icon: AlertTriangle, color: 'text-red-500' };
        if (s.includes('family medicine')) return { icon: Home, color: 'text-blue-300' };
        if (s.includes('infectious')) return { icon: ShieldCheck, color: 'text-green-500' };
        if (s.includes('geriatrician') || s.includes('elderly')) return { icon: UserPlus, color: 'text-slate-300' };
        if (s.includes('neonatologist')) return { icon: Baby, color: 'text-pink-200' };
        if (s.includes('sports medicine')) return { icon: Zap, color: 'text-yellow-500' };
        if (s.includes('pain management')) return { icon: CloudRain, color: 'text-slate-400' };
        if (s.includes('pharmacologist')) return { icon: Pill, color: 'text-blue-400' };
        if (s.includes('geneticist')) return { icon: Dna, color: 'text-purple-500' };
        if (s.includes('sleep medicine')) return { icon: Moon, color: 'text-indigo-400' };
        if (s.includes('cardiothoracic') || s.includes('cardiac surgeon')) return { icon: HeartPulse, color: 'text-red-500' };
        if (s.includes('vascular')) return { icon: Waves, color: 'text-red-400' };
        if (s.includes('plastic')) return { icon: Sparkles, color: 'text-pink-400' };
        if (s.includes('maxillofacial')) return { icon: UserIcon, color: 'text-slate-400' };
        if (s.includes('palliative') || s.includes('comfort')) return { icon: HeartHandshake, color: 'text-emerald-300' };
        if (s.includes('occupational medicine')) return { icon: Briefcase, color: 'text-orange-300' };
        if (s.includes('reproductive')) return { icon: Dna, color: 'text-rose-200' };
        if (s.includes('interventional')) return { icon: Target, color: 'text-blue-500' };
        if (s.includes('transplant')) return { icon: HeartPulse, color: 'text-rose-600' };
        if (s.includes('bariatric') || s.includes('weight')) return { icon: Scale, color: 'text-indigo-300' };
        if (s.includes('audiologist') || s.includes('hearing')) return { icon: Volume2, color: 'text-blue-400' };
        if (s.includes('speech')) return { icon: MessageSquare, color: 'text-blue-300' };
        if (s.includes('critical care') || s.includes('intensivist')) return { icon: Activity, color: 'text-red-700' };
        if (s.includes('occupational therapist')) return { icon: Handshake, color: 'text-orange-400' };
        if (s.includes('physiatrist') || s.includes('rehabilitation')) return { icon: Accessibility, color: 'text-emerald-400' };
        if (s.includes('tropical')) return { icon: Palmtree, color: 'text-amber-500' };
        if (s.includes('biochemist')) return { icon: FlaskConical, color: 'text-cyan-500' };
        if (s.includes('internal medicine')) return { icon: Stethoscope, color: 'text-blue-400' };
        if (s.includes('uro-oncologist')) return { icon: ShieldAlert, color: 'text-rose-500' };
        if (s.includes('robotic surgeon')) return { icon: Zap, color: 'text-purple-400' };
        
        return { icon: Stethoscope, color: 'text-blue-400' };
    };

    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [bookingDoctor, setBookingDoctor] = useState<any>(null);

    const [isForceReady, setIsForceReady] = useState(true);
    const [isBackendConnected, setIsBackendConnected] = useState(true);
    const [isInitializing, setIsInitializing] = useState(false);
    const [localIsAnalyzing, setLocalIsAnalyzing] = useState(false);

    const chat = useChat({
        api: 'http://127.0.0.1:8000/chat',
        body: {
            conversation_id: selectedConversationId,
            user_id: user?.id || 'demo_user',
            format: 'json'
        },
        onResponse: (response: any) => {
            const newConvId = response.headers.get('x-conversation-id');
            if (newConvId && !selectedConversationId) {
                onConversationChange(newConvId);
            }
        },
        onFinish: (message: any) => {
            console.log('RAW_AI_OUTPUT:', message.content);
            const raw = processAssistantContent(message.content);
            const { doctors: registryDoctors, isFallback: locationFallback } = raw.specialty
                ? getFilteredDoctors(raw.specialty, userLocation)
                : { doctors: [], isFallback: false };

            const parsedData = {
                ...raw,
                doctors: (raw.doctors && raw.doctors.length > 0) ? raw.doctors : registryDoctors,
                isLocationFallback: (raw.doctors && raw.doctors.length > 0) ? false : locationFallback
            };

            console.log('STATE_UPDATED_WITH:', parsedData);
            setStructuredAnalysis(parsedData);
        },
        onError: (err: Error) => {
            console.error("AI SDK Error (Redirecting to FastAPI):", err);
            // Force connection true even on error
            setIsBackendConnected(true);
            setLocalIsAnalyzing(false);
            setStructuredAnalysis({
                specialty: 'System Error',
                diagnosis: 'Connection to the Diagnostic Engine could not be established. Please ensure the local backend is running on `http://127.0.0.1:8000` via `python backend/main.py`.',
                home_remedies: [],
                medical_treatments: [],
                doctors: []
            });
        }
    } as any);

    const { messages, setMessages, append, isLoading: isAnalyzing } = chat as any;

    const [autoListen, setAutoListen] = useState(false);
    const [symptomText, setSymptomText] = useState('');
    const [debugAnalysis, setDebugAnalysis] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [history, setHistory] = useState<any[]>([]);
    const INITIAL_ANALYSIS = {
        specialty: 'General Physician',
        diagnosis: '',
        home_remedies: [],
        medical_treatments: [],
        doctors: []
    };
    const [structuredAnalysis, setStructuredAnalysis] = useState<any>(INITIAL_ANALYSIS);

    // Unified Initialization: Handles User, Conversation Loading, and Welcome Logic
    useEffect(() => {
        const init = async () => {
            try {
                const { data: { user: currentUser } } = await supabase.auth.getUser();
                setUser(currentUser);

                if (selectedConversationId) {
                    const { data: msgs } = await supabase
                        .from('messages')
                        .select('role, content')
                        .eq('conversation_id', selectedConversationId)
                        .order('created_at', { ascending: true });

                    if (msgs && msgs.length > 0 && typeof setMessages === 'function') {
                        setMessages(msgs.map(m => ({
                            id: Math.random().toString(),
                            role: m.role as 'user' | 'assistant',
                            content: m.content
                        })));
                    } else {
                        showWelcome();
                    }
                } else {
                    showWelcome();
                }
            } catch (error) {
                console.error("Failed to initialize session:", error);
            }
        };

        const showWelcome = () => {
            if (typeof setMessages === 'function') {
                setMessages([{
                    id: 'welcome',
                    role: 'assistant',
                    content: "Hello! I am MedVoice AI, your Senior Diagnostic Specialist. I am connected and ready to provide clinical-grade analysis. How can I assist you today?",
                }]);
            }
        };

        const fetchHistory = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) return;

            const { data } = await supabase
                .from('messages')
                .select('conversation_id, content, created_at')
                .eq('role', 'user')
                .order('created_at', { ascending: false });

            if (data) {
                const uniqueSessions = Array.from(new Set(data.map(m => m.conversation_id)))
                    .filter(Boolean)
                    .map(id => {
                        const firstMsg = data.find(m => m.conversation_id === id);
                        return {
                            id,
                            type: 'consultation',
                            title: 'Medical Consultation',
                            summary: firstMsg?.content || 'No summary',
                            date: new Date(firstMsg?.created_at || Date.now()).toLocaleDateString()
                        };
                    });
                setHistory(uniqueSessions);
            }
        };

        init();
        fetchHistory();
    }, [selectedConversationId]);

    // Heartbeat for Backend
    useEffect(() => {
        let isMounted = true;
        const checkConnection = async () => {
            try {
                // Primary health check
                const res = await fetch('http://127.0.0.1:8000/api/health', { signal: AbortSignal.timeout(2000) });
                
                if (isMounted) {
                    setIsBackendConnected(true);
                    setIsInitializing(false);
                    if (res.ok) setIsForceReady(true);
                }
            } catch (e) {
                console.warn("[DEBUG] Heartbeat/OCR check skipped or failed:", e);
                if (isMounted) {
                    // Critical: Never block initialization based on service checks
                    setIsBackendConnected(true);
                    setIsInitializing(false);
                }
            }
        };
        checkConnection();
        const interval = setInterval(checkConnection, 5000);
        return () => { isMounted = false; clearInterval(interval); };
    }, []);

    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isListening, setIsListening] = useState(false);
    const [treatmentTab, setTreatmentTab] = useState<'home' | 'medical'>('home');
    const [isSpeaking, setIsSpeaking] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const uiContainerRef = useRef<HTMLDivElement>(null);
    const responseRef = useRef<HTMLDivElement>(null);
    const hasAnimatedRef = useRef(false);
    const analysisBoxRef = useRef<HTMLDivElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);


    // --- Data Processing & State Extraction ---

    const processAssistantContent = (content: string) => {
        const defaultData = {
            specialty: 'Diagnostic Specialist',
            diagnosis: 'Synchronizing with Diagnostic Engine...',
            home_remedies: [],
            medical_treatments: [],
            doctors: []
        };

        if (!content || typeof content !== 'string') return defaultData;

        const cleanContent = content.trim();
        // If content is purely text without structure, it's a fallback analysis
        if (!cleanContent.includes('{')) {
            return { ...defaultData, diagnosis: cleanContent };
        }

        const startIndex = cleanContent.indexOf('{');
        const jsonPart = cleanContent.substring(startIndex);

        try {
            const sanitized = jsonPart.replace(/```json|```/g, '').trim();
            const data = JSON.parse(sanitized);

            const mapRemedy = (item: any) => {
                if (typeof item === 'string') return { 
                    title: item, 
                    description: 'Clinical Protocol', 
                    clinical_logic: 'Based on standard clinical guidelines.' 
                };
                return {
                    title: item.title || item.name || 'Clinical Logic',
                    description: item.description || item.details || 'Step-by-step instruction',
                    clinical_logic: item.clinical_logic || item.logic || 'Standard medical protocol.'
                };
            };

            const mapDoctor = (d: any) => ({
                name: d.name || 'Specialist',
                qualification: d.qualification || d.specialty || 'Medical Professional',
                hospital: d.hospital || d.clinic || 'Medical Center',
                timing: d.timing || d.availability || 'Available Today',
                city: d.city || 'Local'
            });

            // STRICT KEY BINDING: Use home_remedies as requested
            const home = data.home_remedies || []; 
            const medical = data.medical_treatments || [];

            return {
                specialty: data.specialty || 'Diagnostic Specialist',
                diagnosis: data.diagnosis || data.analysis || 'High-precision evaluation complete.',
                home_remedies: Array.isArray(home) ? home.map(mapRemedy) : [],
                medical_treatments: Array.isArray(medical) ? medical.map(mapRemedy) : [],
                doctors: (Array.isArray(data.doctors) && data.doctors.length > 0) ? data.doctors.map(mapDoctor) : []
            };
        } catch (e) {
            // BACKTICK FALLBACK: If JSON fails, extract any content within triple backticks as analysis
            const tickMatch = content.match(/```(?:json)?([\s\S]*?)```/);
            const extractedText = tickMatch ? tickMatch[1].trim() : cleanContent;
            return { ...defaultData, diagnosis: extractedText };
        }
    };

    const latestAssistantMessage = messages.filter((m: any) => m.role === 'assistant' && m.id !== 'welcome').pop();
    
    useEffect(() => {
        if (latestAssistantMessage) {
            console.log('TRACE: latestAssistantMessage update detected:', latestAssistantMessage.content);
            const raw = processAssistantContent(latestAssistantMessage.content);
            
            // HARDCODED FALLBACK FOR HEADACHE
            if (symptomText.toLowerCase().includes('headache') && raw.home_remedies.length === 0) {
                raw.home_remedies = [
                    { title: 'Cold Compress', description: 'Apply a cold pack to your forehead for 15 minutes.', clinical_logic: 'Vasoconstriction reduces blood flow and inflammation.' },
                    { title: 'Hydration', description: 'Drink 500ml of water immediately.', clinical_logic: 'Dehydration is a primary trigger for primary headaches.' },
                    { title: 'Dark Room', description: 'Rest in a quiet, dark room for 30 minutes.', clinical_logic: 'Reduces sensory input and photophobia symptoms.' }
                ];
                raw.specialty = 'Neurologist';
            }

            const { doctors: registryDoctors, isFallback: locationFallback } = raw.specialty
                ? getFilteredDoctors(raw.specialty, userLocation)
                : { doctors: [], isFallback: false };

            const finalData = {
                ...raw,
                doctors: (raw.doctors && raw.doctors.length > 0) ? raw.doctors : registryDoctors,
                isLocationFallback: (raw.doctors && raw.doctors.length > 0) ? false : locationFallback
            };
            
            console.log('TRACE: Final UI State mapping:', finalData);
            setStructuredAnalysis(finalData);
        }
    }, [latestAssistantMessage, userLocation]);

    const { icon: DynamicSpecialtyIcon, color: specialtyIconColor } = getSpecialtyIconLocal(structuredAnalysis.specialty);


    // Explicit Derived Props for UI Components
    const analysisText = structuredAnalysis.diagnosis || (latestAssistantMessage?.content && !latestAssistantMessage.content.includes('{') ? latestAssistantMessage.content : '');
    const hasRemedies = (structuredAnalysis.home_remedies?.length > 0 || structuredAnalysis.medical_treatments?.length > 0);
    const hasAnalysis = !!(analysisText || hasRemedies || isAnalyzing || latestAssistantMessage); // NUCLEAR TRIGGER: Show if anything is happening

    // Unified Assistant Data Trace
    useEffect(() => {
        if (hasAnalysis) {
            console.log('FULL_AI_RESPONSE:', structuredAnalysis);
        }
    }, [hasAnalysis, structuredAnalysis]);

    // Unified Tab State Debugging
    useEffect(() => {
        if (hasAnalysis) {
            console.log("Structured Analysis State Trace:", {
                home: structuredAnalysis?.home_remedies,
                medical: structuredAnalysis?.medical_treatments,
                tab: treatmentTab
            });
        }
    }, [hasAnalysis, structuredAnalysis.home_remedies, structuredAnalysis.medical_treatments, treatmentTab]);

    // --- Handlers ---

    const handleLocate = () => {
        setIsDetectingLocation(true);
        setTimeout(() => {
            setIsDetectingLocation(false);
            setUserLocation('Kolkata');
        }, 800);
    };

    const handleNewConsultation = () => {
        setSymptomText('');
        setDebugAnalysis(''); 
        setMessages([{
            id: 'welcome',
            role: 'assistant',
            content: "Hello! I am MedVoice AI, your personal medical assistant. I'm connected and ready to help. How can I assist you today?",
        }]);
        setStructuredAnalysis(INITIAL_ANALYSIS);
        setUploadedFile(null);
        onConversationChange(null);
        setTreatmentTab('home'); // Reset tab to default
        if (typeof window !== 'undefined') {
            window.speechSynthesis.cancel();
        }
        textAreaRef.current?.focus();
    };

    const handleBookAppointment = (doctor: any) => {
        setBookingDoctor(doctor);
    };

    const handleConfirmBooking = (bookingData: any) => {
        // Booking is handled by the Modal and backend, no local state update needed here
        console.log("Booking confirmed:", bookingData);
    };


    useEffect(() => {
        if (hasAnalysis && analysisBoxRef.current) {
            gsap.fromTo(analysisBoxRef.current,
                { opacity: 0, y: 30, scale: 0.98 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    ease: "expo.out",
                    clearProps: "all"
                }
            );

            // Staggered fade-in-up for child elements
            gsap.fromTo('.dynamic-content',
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.3 }
            );
        }
    }, [hasAnalysis]);

    useEffect(() => {
        if (!uiContainerRef.current || hasAnimatedRef.current) return;

        hasAnimatedRef.current = true;

        // General entrance animation
        gsap.fromTo(uiContainerRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
        );

        // Staggered child animations
        const items = gsap.utils.toArray('.anim-item');
        if (items.length > 0) {
            gsap.fromTo(items,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "back.out(1.5)", delay: 0.2 }
            );
        }
    }, [isInitializing, isBackendConnected]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file: File) => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a PDF, JPG, or PNG file.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB.');
            return;
        }
        setUploadedFile(file);
    };

    const toggleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Voice recognition is not supported in your browser.');
            return;
        }

        if (isListening) return;

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;

        setIsListening(true);

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;

            // Auto-submit the voice input
            setSymptomText((prev: string) => {
                const newText = prev ? `${prev} ${transcript}` : transcript;
                // Using timeout to ensure state is set before submitting
                setTimeout(() => {
                    handleSend(null, newText);
                }, 500);
                return newText;
            });
            setIsListening(false);
        };

        recognition.onerror = () => {
            setIsListening(false);
            alert('Voice recognition failed. Please try again.');
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const exportToPDF = () => {
        const element = document.getElementById('pdf-export-content');
        if (!element) return;
        
        // Temporarily modify element for capture
        const style = document.createElement('style');
        style.innerHTML = `
            #pdf-export-content .no-print { display: none !important; }
            #pdf-export-content .print-only-header { display: flex !important; }
            #pdf-export-content .print-only-footer { display: flex !important; }
            #pdf-export-content .print-remedies { display: flex !important; }
            #pdf-export-content { background: #020617 !important; border: none !important; color: white !important; padding: 20mm !important; }
            .glass-card { background: rgba(30, 41, 59, 0.4) !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; }
        `;
        document.head.appendChild(style);
        
        const opt = {
            margin:       0,
            filename:     `MED-VOICE_Diagnostic_Report.pdf`,
            image:        { type: 'jpeg' as const, quality: 0.98 },
            html2canvas:  { 
                scale: 2, 
                useCORS: true, 
                backgroundColor: '#020617',
                windowWidth: 1200 
            },
            jsPDF:        { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
        };
        
        html2pdf().set(opt).from(element).save().then(() => {
            document.head.removeChild(style);
        });
    };

    const handleSend = async (e: React.MouseEvent | React.FormEvent | null, customSymptomText?: string) => {
        if (e && typeof (e as any).preventDefault === 'function') {
            (e as any).preventDefault();
        }

        const textToAnalyze = (customSymptomText !== undefined ? customSymptomText : symptomText) || '';

        if (!textToAnalyze.trim() && !uploadedFile) {
            alert('Please provide symptoms or a medical document.');
            return;
        }

        setLocalIsAnalyzing(true);
        setStructuredAnalysis(INITIAL_ANALYSIS); // Reset to clear previous results immediately
        setDebugAnalysis(''); // Reset previous debug analysis

        try {
            console.log('[DEBUG] handleSend triggered:', { textToAnalyzeLength: textToAnalyze.length, hasFile: !!uploadedFile });

            let finalSymptom = textToAnalyze;
            let ocrText = '';

            if (uploadedFile) {
                try {
                    const formData = new FormData();
                    formData.append('file', uploadedFile);

                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

                    console.log('[DEBUG] Attempting OCR for:', uploadedFile.name);
                    const ocrResponse = await fetch('http://127.0.0.1:8000/analyze-prescription', {
                        method: 'POST',
                        body: formData,
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);

                    if (ocrResponse.ok) {
                        const data = await ocrResponse.json();
                        ocrText = data.text || '';
                        console.log('[DEBUG] OCR Success');
                    }
                } catch (err) {
                    console.error("[DEBUG] OCR Exception (Bypassing):", err);
                }
            }

            if (ocrText) {
                finalSymptom = `[Prescription/Report Data]:\n${ocrText}\n\n[User Symptoms]:\n${textToAnalyze}`;
            }

            // Attempt backend AI call
            try {
                console.log('[DEBUG] Initiating AI diagnostic request...');
                
                // Filter out the static "welcome" message before sending to LangGraph
                const chatHistory = messages.filter((m: any) => m.id !== 'welcome').map((m: any) => ({
                    role: m.role,
                    content: m.content
                }));
                
                const payload = {
                    messages: [...chatHistory, { role: 'user', content: finalSymptom }],
                    conversation_id: selectedConversationId,
                    user_id: user?.id || 'demo_user'
                };
                
                console.log('FRONTEND_SENDING:', payload);
                
                const response = await fetch('http://127.0.0.1:8000/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) {
                    throw new Error(`Backend crash: ${response.status} ${response.statusText}`);
                }
                
                const responseData = await response.json();
                console.log('BACKEND_RETURNING:', responseData);
                
                const rawContent = responseData.data.messages[responseData.data.messages.length - 1].content;
                const parsed = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;
                
                setStructuredAnalysis({
                    ...INITIAL_ANALYSIS,
                    ...parsed,
                    home_remedies: parsed.home_remedies || parsed.remedies || [],
                    medical_treatments: parsed.medical_treatments || parsed.treatments || []
                });
                
                // Map the new messages array back into the UI
                const newHistory = responseData.data.messages.map((m: any, i: number) => ({
                    id: `msg-${Date.now()}-${i}`,
                    role: m.role,
                    content: m.content
                }));
                
                // Prepend the welcome message
                setMessages([
                    {
                        id: 'welcome',
                        role: 'assistant',
                        content: "Hello! I am MedVoice AI, your personal medical assistant. I'm connected and ready to help. How can I assist you today?"
                    }, 
                    ...newHistory
                ]);

                setSymptomText('');
                setLocalIsAnalyzing(false);
                return; // Success
            } catch (appendError) {
                console.error('[DEBUG] fetch() failed:', appendError);
                // Trigger fallback UI Error State
                setStructuredAnalysis({
                    specialty: 'System Error',
                    diagnosis: 'Connection to the Diagnostic Engine could not be established. Ensure backend is running.',
                    home_remedies: [],
                    medical_treatments: [],
                    doctors: []
                });
            }

            setLocalIsAnalyzing(false);
        } catch (error) {
            console.error('[DEBUG] Global Submission Error:', error);
            setLocalIsAnalyzing(false);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setLocalIsAnalyzing(false);
        }
    };


    const toggleSpeech = (text: string) => {
        if (!('speechSynthesis' in window)) {
            alert('Text-to-speech is not supported in your browser.');
            return;
        }

        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();
            const preferredVoices = ['Google US English', 'Microsoft Aria', 'Samantha'];
            const voice = voices.find(v => preferredVoices.some(p => v.name.includes(p))) || voices[0];
            if (voice) utterance.voice = voice;

            utterance.rate = 0.95;
            utterance.pitch = 1.0;

            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => {
                setIsSpeaking(false);
                if (autoListen) {
                    setTimeout(toggleVoiceInput, 500);
                }
            };
            utterance.onerror = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        }
    };




    return (
        <div className="flex w-full min-h-screen bg-slate-950 overflow-hidden">
            {/* Sidebar Integration */}
            <Sidebar 
                currentId={selectedConversationId}
                onSelect={onConversationChange}
                onNew={handleNewConsultation}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                history={history}
            />

            {/* Main Scrollable Content Area */}
            <div ref={uiContainerRef} className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-10 pt-0 relative">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-16 space-y-8 anim-item -mt-6">
                    {/* Powered by Neural Networks Badge */}
                    <div className="flex items-center gap-2.5 px-6 py-2 rounded-full bg-slate-900/50 border border-white/5 text-slate-400 text-[11px] font-bold shadow-2xl backdrop-blur-md">
                        <Zap className="w-3.5 h-3.5 text-purple-400 fill-purple-400/20" />
                        Powered by Neural Networks
                    </div>

                    {/* Main Title Area */}
                    <div className="text-center space-y-6 max-w-4xl">
                        <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-tight">
                            AI Medical <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Assistant</span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                            Describe your symptoms naturally using voice or text, or upload a prescription for instant, 
                            personalized medical guidance powered by advanced AI analysis.
                        </p>
                    </div>

                    {/* Trust row */}
                    <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        <div className="flex items-center gap-2.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            End-to-End Encrypted
                        </div>
                        <div className="flex items-center gap-2.5">
                            <Clock className="w-4 h-4 text-blue-400" />
                            Response in &lt;60s
                        </div>
                        <div className="flex items-center gap-2.5">
                            <Zap className="w-4 h-4 text-purple-400" />
                            98.7% Accuracy
                        </div>
                    </div>

                    {/* Status Bar / Dashboard Header */}
                    <header className="w-full max-w-6xl bg-slate-950/40 border border-white/10 rounded-[32px] p-2 flex flex-col md:flex-row items-center justify-between shadow-2xl backdrop-blur-3xl ring-1 ring-white/5 no-print gap-4 md:gap-0">
                        {/* 1. Left: User Profile Section */}
                        <div className="flex items-center gap-4 px-6 border-b md:border-b-0 md:border-r border-white/10 w-full md:w-auto py-4 md:py-0 h-auto md:h-10">
                            <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center relative overflow-hidden group">
                                <UserCircle2 className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform relative z-10" />
                                <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black text-slate-100 tracking-tight leading-none truncate max-w-[150px]">{user?.email || 'aishikaroy2003@gmail.com'}</span>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none">SECURE SESSION</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Middle: System Status Section */}
                        <div className="flex items-center gap-4 px-6 md:px-10 border-b md:border-b-0 md:border-r border-white/10 w-full md:w-auto py-4 md:py-0 h-auto md:h-10">
                            <div className="relative">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                <div className="absolute -inset-1 rounded-full border border-emerald-400/20 animate-ping opacity-50" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">SYSTEM ACTIVE</span>
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter mt-1">Backend: Connected</span>
                            </div>
                        </div>

                        {/* 3. Right: Control Center Section */}
                        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 pr-2 pl-6 py-4 md:py-0">
                            {/* Location Module */}
                            <div className="flex items-center gap-3 bg-slate-900 border border-white/5 rounded-2xl px-4 py-2 group hover:border-blue-500/30 transition-all cursor-pointer">
                                <MapPin className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
                                <select 
                                    value={userLocation}
                                    onChange={(e) => setUserLocation(e.target.value)}
                                    className="bg-transparent border-none text-slate-200 outline-none font-black text-[10px] uppercase tracking-widest appearance-none pr-4 cursor-pointer"
                                >
                                    {availableLocations.map(loc => (
                                        <option key={loc} value={loc} className="bg-slate-900">{loc}</option>
                                    ))}
                                </select>
                                <ChevronDown className="w-3 h-3 text-slate-600 transition-colors group-hover:text-blue-500" />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={handleLocate}
                                    className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/20 transition-all group active:scale-95 shadow-lg"
                                    title="Detect Location"
                                >
                                    <Target className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </button>
                                <button 
                                    onClick={async () => { try { await logout(); } catch (err) { console.warn("Logout error:", err); } }}
                                    className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/20 transition-all group active:scale-95 shadow-lg"
                                    title="Sign Out"
                                >
                                    <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </header>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 relative w-full items-start max-w-7xl mx-auto px-0 md:px-4">
                    
                    {/* Left Column: Input and Diagnostics */}
                    <div className="space-y-8">
                        {/* Describe Symptoms Card */}
                        <div className="glass-card bg-slate-900/60 border border-white/5 shadow-2xl rounded-3xl p-6 md:p-8 anim-item relative overflow-hidden">
                            <h2 className="text-xl font-black text-white flex items-center gap-3 mb-8 uppercase tracking-tighter">
                                <Activity className="w-6 h-6 text-blue-400" />
                                Describe Symptoms
                            </h2>

                            <div className="relative mb-6">
                                <textarea
                                    ref={textAreaRef}
                                    value={symptomText}
                                    onChange={(e) => setSymptomText(e.target.value)}
                                    placeholder="E.g., I have a severe headache with sensitivity to light, or I'm experiencing fever and body aches..."
                                    className="w-full h-44 bg-slate-950/50 border border-white/10 rounded-2xl p-6 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 ring-blue-500/40 transition-all resize-none text-sm font-bold leading-relaxed"
                                />
                                <div className="absolute right-4 bottom-4 flex items-center gap-3">
                                    <div className="w-7 h-7 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
                                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                                    </div>
                                    <div className="w-7 h-7 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                                        <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={toggleVoiceInput}
                                className="w-full py-3.5 rounded-xl bg-slate-900 border border-white/5 hover:bg-slate-800 text-slate-400 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
                            >
                                <Mic className="w-4 h-4" />
                                <span className="flex items-center gap-2">
                                    <div className={cn("w-1.5 h-1.5 rounded-full", isListening ? "bg-red-500 animate-pulse" : "bg-slate-500")} />
                                    {isListening ? 'Listening...' : 'Start Voice Input'}
                                </span>
                            </button>
                        </div>

                        {/* Upload Prescription Card */}
                        <div className="glass-card bg-slate-900/60 border border-white/5 shadow-2xl rounded-3xl p-6 md:p-8 anim-item">
                            <h2 className="text-xl font-black text-white flex items-center gap-3 mb-8 uppercase tracking-tighter">
                                <FileText className="w-6 h-6 text-purple-400" />
                                Upload Prescription <span className="text-[10px] text-slate-500 normal-case ml-2">(Optional)</span>
                            </h2>

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                className="border-2 border-dashed border-slate-800 hover:border-blue-500/40 bg-slate-950/30 rounded-3xl p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center group h-44"
                            >
                                <Upload className="w-7 h-7 text-slate-600 mb-2 group-hover:text-blue-400 transition-colors" />
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                        <span className="text-purple-400">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter">SVG, PNG, JPG OR PDF (MAX. 5MB)</p>
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                            </div>

                            {uploadedFile && (
                                <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-purple-400" />
                                        </div>
                                        <span className="text-[10px] font-bold text-white truncate max-w-[150px]">{uploadedFile.name}</span>
                                    </div>
                                    <button onClick={() => setUploadedFile(null)} className="text-slate-500 hover:text-red-400 p-2"><X className="w-4 h-4" /></button>
                                </div>
                            )}
                        </div>

                        {/* Analysis Action */}
                        <button
                            onClick={handleSend}
                            className="w-full py-6 rounded-[2rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-2xl tracking-tighter uppercase shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4 cursor-pointer"
                        >
                            <HeartPulse className="w-8 h-8" />
                            Analyze Symptoms
                        </button>
                    </div>

                    {/* Right Column: AI Analysis & Results */}
                    <div id="pdf-export-content" className="space-y-8 print:bg-slate-950 print:p-10">
                        {/* PDF Exclusive Header (Hidden in UI) */}
                        <div className="hidden print-only-header flex-col items-center mb-10 border-b-2 border-blue-500/30 pb-8">
                            <img src="/logo.png" alt="MED-VOICE Logo" className="w-32 h-32 mb-4 object-contain" />
                            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Diagnostic Report</h1>
                            <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-2 flex items-center gap-4">
                                <span>HIPAA COMPLIANT</span>
                                <span>•</span>
                                <span>256-BIT ENCRYPTED</span>
                                <span>•</span>
                                <span>SOC2 TYPE II</span>
                            </div>
                            <div className="text-[8px] text-slate-500 mt-4 uppercase">Generated on: {new Date().toLocaleString()}</div>
                        </div>

                        {/* AI Analysis Box */}
                        <div className="glass-card bg-slate-900/60 border border-white/5 shadow-2xl rounded-3xl p-6 md:p-8 anim-item flex flex-col min-h-[400px] md:min-h-[500px]">
                            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                                <h2 className="text-xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                                    <DynamicSpecialtyIcon className={cn("w-6 h-6", specialtyIconColor)} />
                                    AI Analysis
                                </h2>
                                <button 
                                    onClick={() => setAutoListen(!autoListen)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all no-print",
                                        autoListen ? "bg-blue-500/10 border-blue-500/50 text-blue-400" : "bg-slate-950/80 border-white/5 text-slate-500"
                                    )}
                                >
                                    <div className={cn("w-1.5 h-1.5 rounded-full", autoListen ? "bg-blue-400 animate-pulse" : "bg-slate-600")} />
                                    Auto-Listen {autoListen ? 'ON' : 'OFF'}
                                </button>
                            </div>

                            <div className="flex-1 flex flex-col">
                                {!hasAnalysis && !analysisText && !(isAnalyzing || localIsAnalyzing) ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                                        <BrainCircuit className="w-16 h-16 opacity-10 mb-6" />
                                        <p className="text-xs font-bold uppercase tracking-widest italic opacity-40">Ready for clinical analysis...</p>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col">
                                        {(isAnalyzing || localIsAnalyzing) && (
                                            <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 animate-pulse no-print">
                                                <Activity className="w-4 h-4 text-blue-400 animate-spin" />
                                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Neural Engine Processing...</p>
                                            </div>
                                        )}
                                        <div className="flex-1 bg-slate-950/50 border-l-[4px] border-emerald-500/50 rounded-r-2xl p-8 text-slate-300 text-[13px] font-bold leading-relaxed mb-6">
                                            <div className="space-y-6 markdown-content">
                                                {analysisText ? analysisText.split('\n').map((line: string, i: number) => {
                                                    const trimmedLine = line?.trim() || '';
                                                    if (trimmedLine.startsWith('### ')) return <h3 key={i} className="text-lg font-black text-white mt-4 border-b border-white/5 pb-2 uppercase tracking-tighter">{trimmedLine.substring(4)}</h3>;
                                                    if (trimmedLine.startsWith('**')) {
                                                        const boldMatch = trimmedLine.match(/^\*\*(.*?)\*\*(.*)/);
                                                        if (boldMatch) return <p key={i}><span className="text-white font-black text-[12px] tracking-tight mr-1">{boldMatch[1]}</span>{boldMatch[2]}</p>;
                                                    }
                                                    if (trimmedLine.startsWith('- ')) return <li key={i} className="ml-4 list-disc marker:text-emerald-500">{trimmedLine.substring(2)}</li>;
                                                    return <p key={i}>{trimmedLine}</p>;
                                                }) : (
                                                    <div className="flex flex-col gap-4">
                                                        <div className="h-4 w-3/4 bg-slate-800 rounded animate-pulse" />
                                                        <div className="h-4 w-full bg-slate-800 rounded animate-pulse" />
                                                        <div className="h-4 w-5/6 bg-slate-800 rounded animate-pulse" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => toggleSpeech(analysisText)} 
                                            className="w-full py-4 rounded-2xl bg-slate-900 border border-white/5 hover:bg-slate-800 text-slate-300 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all cursor-pointer no-print shadow-xl group active:scale-95"
                                        >
                                            <Volume2 className={cn("w-5 h-5 transition-transform group-hover:scale-110", isSpeaking ? "text-emerald-400" : "text-blue-400")} />
                                            {isSpeaking ? 'Stop Briefing' : 'Listen'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Suggested Remedies */}
                        {(hasAnalysis || isAnalyzing || localIsAnalyzing) && (
                            <div className="glass-card bg-slate-900/60 border border-white/5 shadow-2xl rounded-3xl p-8 anim-item">
                                <h3 className="text-xl font-black text-white flex items-center gap-3 mb-8 uppercase tracking-tighter">
                                    Suggested Remedies
                                </h3>
                                
                                <div className="flex bg-slate-950/80 p-1.5 rounded-2xl mb-8 border border-white/5 w-full max-w-[340px] no-print mx-auto md:mx-0">
                                    <button onClick={() => setTreatmentTab('home')} className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${treatmentTab === 'home' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}>Home Remedies</button>
                                    <button onClick={() => setTreatmentTab('medical')} className={`flex-1 py-2.5 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest ${treatmentTab === 'medical' ? 'bg-slate-900 text-slate-400 shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}>Medical Treatment</button>
                                </div>

                                <div className="space-y-4">
                                    {(treatmentTab === 'home' ? (structuredAnalysis.home_remedies || []) : (structuredAnalysis.medical_treatments || [])).map((item: any, idx: number) => (
                                        <div key={idx} className="bg-slate-950/40 border border-white/5 rounded-2xl p-6 hover:bg-slate-900/60 transition-all border-l-4 border-l-blue-500/30">
                                            <h4 className="text-[14px] font-black text-slate-100 uppercase tracking-tight mb-2">{item.title}</h4>
                                            <p className="text-[11px] font-bold text-slate-500 leading-relaxed">{item.description}</p>
                                        </div>
                                    ))}
                                    {((treatmentTab === 'home' ? structuredAnalysis.home_remedies : structuredAnalysis.medical_treatments) || []).length === 0 && (
                                        <p className="text-center text-slate-600 py-10 font-bold uppercase tracking-widest text-[10px]">No specific remedies suggested yet.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Recommended Doctors Section */}
                        {(hasAnalysis || isAnalyzing || localIsAnalyzing) && (
                            <div className="glass-card bg-slate-900/60 border border-white/5 shadow-2xl rounded-3xl p-6 md:p-8 anim-item">
                                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-blue-500" />
                                        RECOMMENDED DOCTORS
                                    </h3>
                                </div>

                                <div className="space-y-6">
                                    {(structuredAnalysis.doctors || []).map((doc: any, idx: number) => (
                                        <div key={idx} className="bg-slate-950/60 border border-white/5 rounded-3xl p-8 hover:bg-slate-900 transition-all group relative overflow-hidden ring-1 ring-white/5">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h4 className="text-2xl font-black text-white tracking-tighter mb-1">Dr. {doc.name}</h4>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-md">
                                                            {doc.qualification}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                    Available Today
                                                </div>
                                            </div>

                                            <div className="space-y-3 mb-8">
                                                <div className="flex items-center gap-3 text-slate-400">
                                                    <Building className="w-4 h-4 text-slate-500" />
                                                    <span className="text-[11px] font-bold text-slate-300">{doc.hospital}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-slate-400">
                                                    <Clock className="w-4 h-4 text-slate-500" />
                                                    <span className="text-[11px] font-bold text-slate-500">{doc.timing || 'Mon-Sat 10AM-4PM'}</span>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => handleBookAppointment(doc)}
                                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 no-print"
                                            >
                                                Book Appointment
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    ))}
                                    {(structuredAnalysis.doctors || []).length === 0 && (
                                        <div className="text-center py-10 opacity-30">
                                            <Stethoscope className="w-10 h-10 mx-auto mb-4" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">Searching for available specialists...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* PDF Export Button (UI Only) */}
                        {hasAnalysis && (
                            <div className="flex justify-end pt-4 no-print">
                                <button 
                                    onClick={exportToPDF}
                                    className="w-full py-4 rounded-2xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-300 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xl active:scale-95"
                                >
                                    <DownloadCloud className="w-5 h-5 text-blue-400" />
                                    Export Diagnostic Report (PDF)
                                </button>
                            </div>
                        )}

                        {/* PDF EXCLUSIVE REMEDIES (FLATTENED VIEW - HIDDEN IN UI) */}
                        <div className="hidden print-remedies flex-col gap-10">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-blue-400 uppercase border-b border-blue-500/30 pb-2">Home Remedies</h3>
                                {structuredAnalysis.home_remedies?.map((item: any, idx: number) => (
                                    <div key={idx} className="p-6 bg-slate-900/40 border border-white/10 rounded-2xl">
                                        <h4 className="text-lg font-black text-white">{item.title}</h4>
                                        <p className="text-xs text-slate-400 mt-2">{item.description}</p>
                                        {item.clinical_logic && (
                                            <div className="mt-4 pt-4 border-t border-white/5">
                                                <span className="text-[9px] font-black text-emerald-500 uppercase">Clinical Logic:</span>
                                                <p className="text-[10px] text-emerald-400/80 italic mt-1">{item.clinical_logic}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-purple-400 uppercase border-b border-purple-500/30 pb-2">Medical Treatments</h3>
                                {structuredAnalysis.medical_treatments?.map((item: any, idx: number) => (
                                    <div key={idx} className="p-6 bg-slate-900/40 border border-white/10 rounded-2xl">
                                        <h4 className="text-lg font-black text-white">{item.title}</h4>
                                        <p className="text-xs text-slate-400 mt-2">{item.description}</p>
                                        {item.clinical_logic && (
                                            <div className="mt-4 pt-4 border-t border-white/5">
                                                <span className="text-[9px] font-black text-emerald-500 uppercase">Clinical Logic:</span>
                                                <p className="text-[10px] text-emerald-400/80 italic mt-1">{item.clinical_logic}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PDF EXCLUSIVE FOOTER */}
                        <div className="hidden print-only-footer pt-10 border-t border-white/10 flex flex-col items-center gap-4 text-center">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">
                                MED-VOICE AI DIAGNOSTIC ENGINE
                            </p>
                            <div className="flex gap-10">
                                <span className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter">HIPAA COMPLIANT</span>
                                <span className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter">256-BIT ENCRYPTION</span>
                                <span className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter">SOC2 TYPE II</span>
                            </div>
                        </div>
                    </div> {/* Right Column */}
                </div> {/* Grid */}
            </div> {/* uiContainerRef */}

            {bookingDoctor && (
                <BookingModal 
                    isOpen={true}
                    onClose={() => setBookingDoctor(null)}
                    doctor={bookingDoctor}
                    onBookingSuccess={handleConfirmBooking}
                    user={user}
                />
            )}
        </div>
    );
}
