'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import {
  Mic, Upload, Activity, ShieldCheck, Stethoscope, ChevronRight,
  UserCircle2, Sparkles, Play, Brain, Clock, Star, TrendingUp,
  Users, Lock, HeartPulse, ChevronDown, Zap, Globe, MessageSquare,
  Shield, Fingerprint, CheckCircle, Cpu
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const parallaxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const featuresRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const ctx = gsap.context(() => {
      // Hero staggered reveal
      gsap.fromTo('.hero-anim',
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, stagger: 0.12,
          ease: "power3.out", delay: 0.1
        }
      );

      // Hero floating glows
      gsap.to('.hero-glow-1', {
        y: -30, x: 15, scale: 1.08, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut"
      });
      gsap.to('.hero-glow-2', {
        y: 25, x: -20, scale: 1.1, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1
      });

      // Mouse parallax
      const handleMouseMove = (e: MouseEvent) => {
        if (!heroRef.current) return;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        parallaxRefs.current.forEach((ref, index) => {
          if (!ref) return;
          const speed = (index + 1) * 0.02;
          gsap.to(ref, {
            x: (e.clientX - centerX) * speed,
            y: (e.clientY - centerY) * speed,
            duration: 1.2, ease: "power2.out"
          });
        });
      };
      window.addEventListener('mousemove', handleMouseMove);

      // Stats counter animation
      if (statsRef.current) {
        gsap.fromTo('.stat-item',
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: statsRef.current, start: "top 80%" }
          }
        );
      }

      // Features fade up
      if (featuresRef.current) {
        gsap.fromTo('.feature-card',
          { y: 50, opacity: 0, scale: 0.97 },
          {
            y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: featuresRef.current, start: "top 75%" }
          }
        );
      }

      // Steps reveal
      if (stepsRef.current) {
        gsap.fromTo('.step-card',
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: stepsRef.current, start: "top 75%" }
          }
        );
      }

      // Testimonials
      if (testimonialsRef.current) {
        gsap.fromTo('.testimonial-card',
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
            scrollTrigger: { trigger: testimonialsRef.current, start: "top 75%" }
          }
        );
      }

      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [heroRef, featuresRef, stepsRef, statsRef, testimonialsRef]);

    return () => ctx.revert();
  }, []);

  return (
    <div className="overflow-hidden">

      {/* ================================================================ */}
      {/* 1. HERO SECTION                                                  */}
      {/* ================================================================ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 pb-28 overflow-hidden">

        {/* Background Glows */}
        <div ref={el => { parallaxRefs.current[0] = el }}
          className="absolute top-[5%] left-[10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-blue-600/[0.07] rounded-full blur-[130px] pointer-events-none hero-glow-1" />
        <div ref={el => { parallaxRefs.current[1] = el }}
          className="absolute bottom-[0%] right-[5%] w-[40vw] h-[40vw] max-w-[550px] max-h-[550px] bg-violet-600/[0.06] rounded-full blur-[110px] pointer-events-none hero-glow-2" />

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_10%,transparent_100%)] pointer-events-none" />

        <div className="container mx-auto px-4 z-10 text-center relative max-w-5xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass mb-8 hero-anim border-white/[0.06]">
            <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
            <span className="text-sm font-medium tracking-wide text-slate-300">AI-Powered Medical Intelligence</span>
          </div>

          {/* Hero Content Grid */}
          <div className="flex flex-col items-center">
            {/* Live AI Status */}
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900/40 border border-emerald-500/20 mb-8 hero-anim backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:border-emerald-500/40 transition-colors">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">System Live: 200ms latency</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-7xl md:text-9xl font-black tracking-tighter mb-8 hero-anim leading-[0.9] text-white">
              Smarter<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 animate-gradient">
                Healthcare
              </span>
            </h1>

            {/* Subheadline */}
            <p className="max-w-2xl mx-auto text-lg md:text-2xl text-slate-400 mb-12 hero-anim leading-relaxed font-light">
              Experience clinical-grade medical intelligence. Describe symptoms via voice, 
              upload prescriptions for AI analysis, and connect with specialists in real-time.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 hero-anim w-full mt-4">
              <Link href="/chatbot" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-3 group text-lg py-4 px-10 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 transition-all duration-300 shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_40px_rgba(139,92,246,0.4)] hover:-translate-y-1 active:scale-95 text-white font-bold relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out pointer-events-none" />
                Launch Assistant
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#features" className="w-full sm:w-auto py-4 px-10 rounded-2xl glass bg-slate-800/50 border border-white/10 text-white font-bold hover:bg-slate-800/80 hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-3 group hover:-translate-y-1">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <Play className="w-4 h-4 text-blue-400 ml-1" />
                </div>
                Technical Overview
              </a>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 hero-anim">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Clock className="w-4 h-4 text-violet-400" />
              <span>Available 24/7</span>
            </div>
          </div>

          {/* Floating UI Showcase Card */}
          <div ref={el => { parallaxRefs.current[2] = el }}
            className="mt-20 relative max-w-3xl mx-auto hero-anim group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 to-violet-500/15 blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-700 pointer-events-none" />

            <div className="glass-card flex flex-col items-center justify-center p-8 md:p-12 relative overflow-hidden bg-slate-900/50 shadow-[0_25px_50px_rgba(0,0,0,0.4)]">
              {/* Waveform */}
              <div className="flex items-end gap-1 h-16 w-full max-w-md justify-center opacity-80 mb-6">
                {[...Array(28)].map((_, i) => (
                  <div key={i} className="w-2 rounded-full bg-gradient-to-t from-blue-500 to-violet-400"
                    style={{
                      height: isClient ? `${Math.max(15, Math.random() * 100)}%` : '40%',
                      animationName: isClient ? 'waveform-bar' : 'none',
                      animationDuration: isClient ? `${0.8 + Math.random() * 0.8}s` : '0s',
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                      animationDirection: 'alternate',
                      animationDelay: `${i * 0.04}s`,
                      animationFillMode: 'forwards'
                    }} />
                ))}
              </div>

              {/* Prompt */}
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/[0.06] flex items-center gap-3 shadow-xl relative w-full max-w-md">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-violet-500/20 blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Mic className="w-6 h-6 text-violet-400 animate-pulse relative z-10 flex-shrink-0" />
                <span className="text-base font-medium text-slate-300 relative z-10">&quot;I&apos;m experiencing a severe tension headache...&quot;</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ================================================================ */}
      {/* 2. STATS / TRUST BAR                                             */}
      {/* ================================================================ */}
      <section ref={statsRef} className="py-16 relative z-10">
        <div className="section-divider mb-16" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
            <StatItem icon={<Users className="w-6 h-6 text-blue-400" />} value="50,000+" label="Consultations Completed" />
            <StatItem icon={<TrendingUp className="w-6 h-6 text-emerald-400" />} value="98.7%" label="Diagnostic Accuracy" />
            <StatItem icon={<Star className="w-6 h-6 text-amber-400" />} value="4.9 / 5" label="User Satisfaction" />
            <StatItem icon={<Stethoscope className="w-6 h-6 text-violet-400" />} value="200+" label="Partner Specialists" />
          </div>
        </div>
        <div className="section-divider mt-16" />
      </section>


      {/* ================================================================ */}
      {/* 3. FEATURES GRID                                                 */}
      {/* ================================================================ */}
      <section id="features" ref={featuresRef} className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-violet-400 font-semibold tracking-widest uppercase text-xs mb-3 block">Platform Capabilities</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-white tracking-tight">
              Everything You Need for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400"> Smarter Care</span>
            </h2>
            <p className="text-slate-400 text-lg font-light leading-relaxed">
              Our clinical-grade platform combines advanced neural networks with human-centric design
              to deliver medical assistance that&apos;s accurate, private, and always available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Mic className="w-7 h-7 text-blue-400" />}
              title="Natural Voice Input"
              description="Speak naturally about your symptoms. Our advanced NLP engine understands context, nuance, and medical terminology to capture exactly what you're feeling."
              accent="blue"
            />
            <FeatureCard
              icon={<Brain className="w-7 h-7 text-violet-400" />}
              title="Neural Diagnostics"
              description="Powered by deep learning models trained on millions of verified medical records. Get preliminary assessments with clinical-grade accuracy in seconds."
              accent="violet"
            />
            <FeatureCard
              icon={<Upload className="w-7 h-7 text-purple-400" />}
              title="Prescription Analysis"
              description="Upload any prescription or medical document. Our OCR + AI pipeline breaks down complex medical jargon into clear, understandable language."
              accent="purple"
            />
            <FeatureCard
              icon={<HeartPulse className="w-7 h-7 text-emerald-400" />}
              title="Holistic Treatment Plans"
              description="Receive balanced treatment recommendations combining evidence-based medicine with natural remedies tailored to your specific condition and history."
              accent="emerald"
            />
            <FeatureCard
              icon={<UserCircle2 className="w-7 h-7 text-amber-400" />}
              title="Doctor Connect"
              description="Seamlessly connect with 200+ verified specialists. Our geolocation routing finds the best-rated doctors near you with real-time availability."
              accent="amber"
            />
            <FeatureCard
              icon={<ShieldCheck className="w-7 h-7 text-cyan-400" />}
              title="Bank-Grade Security"
              description="Your health data is protected by AES-256 encryption, HIPAA-compliant infrastructure, and zero-knowledge architecture. We never sell your data."
              accent="cyan"
            />
          </div>
        </div>
      </section>


      {/* ================================================================ */}
      {/* 4. HOW IT WORKS                                                  */}
      {/* ================================================================ */}
      <section id="how-it-works" ref={stepsRef} className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/[0.03] rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-blue-400 font-semibold tracking-widest uppercase text-xs mb-3 block">How It Works</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
              From Symptoms to Solution
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400"> in Minutes</span>
            </h2>
            <p className="text-slate-400 text-lg font-light leading-relaxed">
              A meticulously designed four-step pipeline that takes you from initial symptom
              recognition to professional medical guidance — fast, accurate, and confidential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <StepCard
              number="01"
              title="Describe"
              description="Tell us how you feel using natural voice or text. Our NLP engine captures the nuance and context of even complex symptom descriptions."
              icon={<MessageSquare className="w-6 h-6" />}
            />
            <StepCard
              number="02"
              title="Analyze"
              description="Our neural network cross-references your input against millions of verified clinical data points to identify potential conditions with high accuracy."
              icon={<Brain className="w-6 h-6" />}
            />
            <StepCard
              number="03"
              title="Guide"
              description="Receive curated treatment recommendations — from immediate home remedies to professional medical pathways — ranked by relevance and urgency."
              icon={<Zap className="w-6 h-6" />}
            />
            <StepCard
              number="04"
              title="Connect"
              description="Seamlessly book appointments with top-rated specialists near you. Our routing algorithm considers specialty match, ratings, availability, and proximity."
              icon={<Globe className="w-6 h-6" />}
            />
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECURITY & COMPLIANCE                                            */}
      {/* ================================================================ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-600/[0.02] to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 flex justify-center relative z-10">
          <div className="glass-card bg-slate-950/80 border border-white/10 p-10 md:p-14 rounded-[40px] w-full max-w-xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 blur-[120px] -mr-40 -mt-40 rounded-full" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 blur-[120px] -ml-40 -mb-40 rounded-full" />
            
            <div className="flex flex-col items-center gap-12 relative z-10">
              <div className="flex items-center gap-4 text-white">
                <Shield className="w-10 h-10 text-blue-400" />
                <h2 className="text-3xl font-black uppercase tracking-tighter">Security & Compliance</h2>
              </div>

              <div className="w-full space-y-5">
                <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-blue-500/30 transition-all duration-300 group/item">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
                    <ShieldCheck className="w-7 h-7 text-blue-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-slate-100 uppercase tracking-widest">HIPAA Compliant</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Health Insurance Portability and Accountability Act</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-purple-500/30 transition-all duration-300 group/item">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-inner">
                    <Fingerprint className="w-7 h-7 text-purple-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-slate-100 uppercase tracking-widest">256-Bit Encryption</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Military Grade AES-256 Data Security</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-emerald-500/30 transition-all duration-300 group/item">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                    <CheckCircle className="w-7 h-7 text-emerald-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-slate-100 uppercase tracking-widest">SOC2 Type II</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Trust Services Criteria for Security</span>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-6 pt-4 w-full border-t border-white/5">
                <button className="w-full mt-6 py-6 rounded-3xl bg-slate-900/80 border border-white/10 flex items-center justify-center gap-4 hover:bg-slate-900 transition-all group/btn shadow-xl">
                  <Cpu className="w-6 h-6 text-slate-500 group-hover/btn:text-blue-400 transition-colors" />
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] md:tracking-[0.4em] group-hover/btn:text-white transition-colors">Technical Protocol</span>
                </button>

                <div className="pt-4">
                  <a 
                    href="http://localhost:3000" 
                    className="inline-block text-[12px] font-black text-blue-400 uppercase tracking-[0.2em] border-b-2 border-blue-500/20 pb-1 hover:border-blue-400 hover:text-blue-300 transition-all"
                  >
                    Shareable App Link: http://localhost:3000
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* 5. TESTIMONIALS                                                  */}
      {/* ================================================================ */}
      <section ref={testimonialsRef} className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-emerald-400 font-semibold tracking-widest uppercase text-xs mb-3 block">Testimonials</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
              Trusted by Thousands of
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400"> Happy Patients</span>
            </h2>
            <p className="text-slate-400 text-lg font-light">
              Real stories from real people who transformed their healthcare experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <TestimonialCard
              quote="MedVoice AI identified my migraine triggers in minutes. My neurologist confirmed the analysis was spot-on. This is the future of healthcare."
              name="Priya Sharma"
              role="Software Engineer, Pune"
              rating={5}
            />
            <TestimonialCard
              quote="As a busy parent, I don't always have time to visit a doctor for every concern. MedVoice gives me peace of mind with accurate, instant guidance."
              name="Rahul Mehta"
              role="Product Manager, Mumbai"
              rating={5}
            />
            <TestimonialCard
              quote="The prescription analysis feature is incredible. It explained my medication interactions in simple terms that I could actually understand."
              name="Dr. Ananya Roy"
              role="General Physician, Kolkata"
              rating={5}
            />
          </div>
        </div>
      </section>


      {/* ================================================================ */}
      {/* 6. FAQ                                                           */}
      {/* ================================================================ */}
      <section id="faq" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-blue-400 font-semibold tracking-widest uppercase text-xs mb-3 block">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-lg font-light">
              Everything you need to know about MedVoice AI and how it can help you.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            <FaqItem
              index={0} open={openFaq} setOpen={setOpenFaq}
              question="Is MedVoice AI a replacement for a real doctor?"
              answer="No. MedVoice AI is designed to provide preliminary guidance and help you understand your symptoms better. It is not a substitute for professional medical diagnosis or treatment. We always recommend consulting with a qualified healthcare provider for definitive medical decisions."
            />
            <FaqItem
              index={1} open={openFaq} setOpen={setOpenFaq}
              question="How accurate is the AI diagnostic analysis?"
              answer="Our neural network achieves a 98.7% accuracy rate on common symptom-to-condition matching, validated against clinical datasets. However, accuracy can vary for rare or complex conditions. The AI continuously learns and improves from anonymized, aggregated data patterns."
            />
            <FaqItem
              index={2} open={openFaq} setOpen={setOpenFaq}
              question="Is my health data secure and private?"
              answer="Absolutely. We use AES-256 encryption for data at rest and TLS 1.3 for data in transit. Our infrastructure is HIPAA-compliant, and we operate on a zero-knowledge architecture — meaning even our team cannot access your personal health information. We never sell or share your data with third parties."
            />
            <FaqItem
              index={3} open={openFaq} setOpen={setOpenFaq}
              question="How does Doctor Connect work?"
              answer="When you need in-person care, our geolocation-based routing algorithm matches you with verified specialists in your area. We consider specialty relevance, doctor ratings, real-time availability, and proximity to suggest the best options. You can book appointments directly through the platform."
            />
            <FaqItem
              index={4} open={openFaq} setOpen={setOpenFaq}
              question="Is MedVoice AI free to use?"
              answer="Yes, our core AI consultation features are completely free. This includes symptom analysis, treatment suggestions, and basic prescription analysis. Premium features like unlimited Doctor Connect bookings and detailed health history tracking are available through our Pro plan."
            />
          </div>
        </div>
      </section>


      {/* ================================================================ */}
      {/* 7. FINAL CTA                                                     */}
      {/* ================================================================ */}
      <section className="py-32 relative text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/[0.06] via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-[-15%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-500/[0.08] blur-[130px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 max-w-3xl">
          <div className="glass-card p-10 md:p-14 bg-slate-900/40 border-white/[0.06]">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight">
              Take the First Step Towards
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400"> Smarter Healthcare</span>
            </h2>
            <p className="text-xl text-slate-400 mb-8 font-light leading-relaxed">
              Join over 50,000 people who trust MedVoice AI for fast, accurate,
              and confidential medical guidance — available anytime, anywhere.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-10 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-400" /> Results in under 60 seconds</span>
              <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-violet-400" /> 100% private &amp; secure</span>
            </div>

            <Link href="/chatbot" className="btn-primary inline-flex items-center gap-2.5 text-lg px-12 py-5 animate-pulse-glow">
              Start Your Free Consultation
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


/* ================================================================ */
/* COMPONENTS                                                        */
/* ================================================================ */

function StatItem({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <div className="stat-item text-center p-4">
      <div className="flex items-center justify-center mb-3">{icon}</div>
      <div className="text-3xl md:text-4xl font-black text-white tracking-tight mb-1">{value}</div>
      <div className="text-sm text-slate-500 font-medium">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description, accent }: {
  icon: React.ReactNode, title: string, description: string, accent: string
}) {
  const accentColors: Record<string, string> = {
    blue: 'border-t-blue-500/50',
    violet: 'border-t-violet-500/50',
    purple: 'border-t-purple-500/50',
    emerald: 'border-t-emerald-500/50',
    amber: 'border-t-amber-500/50',
    cyan: 'border-t-cyan-500/50',
  };

  return (
    <div className={`feature-card glass-card group flex flex-col h-full bg-slate-900/30 border-t-2 ${accentColors[accent] || 'border-t-blue-500/50'}`}>
      <div className="bg-white/[0.04] w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/[0.06]">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors tracking-tight">{title}</h3>
      <p className="text-slate-400 text-sm font-light leading-relaxed flex-grow">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description, icon }: {
  number: string, title: string, description: string, icon: React.ReactNode
}) {
  return (
    <div className="step-card glass-card group bg-slate-900/30 relative overflow-hidden">
      {/* Big watermark number */}
      <div className="absolute -top-4 -right-2 text-8xl font-black text-white/[0.03] select-none pointer-events-none tracking-tighter">
        {number}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center text-blue-400 border border-white/[0.06]">
            {icon}
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Step {number}</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
        <p className="text-slate-400 text-sm font-light leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function TestimonialCard({ quote, name, role, rating }: {
  quote: string, name: string, role: string, rating: number
}) {
  return (
    <div className="testimonial-card glass-card group bg-slate-900/30 flex flex-col">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
        ))}
      </div>

      <p className="text-slate-300 text-sm leading-relaxed flex-grow mb-6 font-light italic">
        &ldquo;{quote}&rdquo;
      </p>

      <div className="border-t border-white/[0.06] pt-4">
        <p className="text-white font-semibold text-sm">{name}</p>
        <p className="text-slate-500 text-xs mt-0.5">{role}</p>
      </div>
    </div>
  );
}

function FaqItem({ index, open, setOpen, question, answer }: {
  index: number, open: number | null, setOpen: (i: number | null) => void,
  question: string, answer: string
}) {
  const isOpen = open === index;
  return (
    <div className={`glass-card bg-slate-900/30 cursor-pointer transition-all duration-300 ${isOpen ? 'border-blue-500/20' : ''}`}
      onClick={() => setOpen(isOpen ? null : index)}>
      <div className="flex items-center justify-between gap-4">
        <h3 className={`font-semibold text-base transition-colors ${isOpen ? 'text-blue-400' : 'text-slate-200'}`}>
          {question}
        </h3>
        <ChevronDown className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
      </div>
      {isOpen && (
        <p className="text-slate-400 text-sm font-light leading-relaxed mt-4 pt-4 border-t border-white/[0.06]">
          {answer}
        </p>
      )}
    </div>
  );
}
