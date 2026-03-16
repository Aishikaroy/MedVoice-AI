'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { login, signup } from './actions'
import { Activity, ShieldCheck, Mail, Lock, UserPlus, LogIn, AlertCircle, Loader2, Phone, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useFormStatus } from 'react-dom'

function SubmitButton({ mode }: { mode: 'signIn' | 'signUp' }) {
  const { pending } = useFormStatus()
  
  return (
    <button 
      formAction={mode === 'signIn' ? login : signup}
      disabled={pending}
      className={`w-full py-4 rounded-xl font-black text-lg text-white transition-all duration-500 shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden ${
        mode === 'signIn' 
          ? 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 hover:shadow-[0_10px_30px_rgba(37,99,235,0.4)]' 
          : 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 hover:shadow-[0_10px_30px_rgba(16,185,129,0.4)]'
      }`}
    >
      <div className="absolute inset-0 bg-white/20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out pointer-events-none" />
      {pending ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : mode === 'signIn' ? (
        <LogIn className="w-5 h-5" />
      ) : (
        <UserPlus className="w-5 h-5" />
      )}
      {pending 
        ? (mode === 'signIn' ? 'Signing in...' : 'Creating account...') 
        : (mode === 'signIn' ? 'Sign in to MedVoice UI' : 'Create Account')}
    </button>
  )
}

function LoginContent() {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn')
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')

  const toggleMode = () => {
    setMode(prev => prev === 'signIn' ? 'signUp' : 'signIn')
  }

  const router = useRouter()

  return (
    <div className="min-h-[calc(100vh-80px)] py-10 px-4 relative flex items-center justify-center">
      {/* Gold/Black Luxury Back Button */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-6 py-3 rounded-full border border-amber-500/30 bg-black/80 backdrop-blur-md text-amber-500 text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-black transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>

      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-blue-600/[0.04] rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-violet-600/[0.04] rounded-full blur-[110px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 anim-item">
        <div className="glass-card bg-slate-900/60 border-white/10 shadow-2xl relative overflow-hidden rounded-3xl p-8 sm:p-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 rounded-2xl mb-6 shadow-inner border border-white/5">
                {mode === 'signIn' ? (
                  <Activity className="w-8 h-8 text-blue-400" />
                ) : (
                  <UserPlus className="w-8 h-8 text-violet-400" />
                )}
            </div>
            <h1 className="text-3xl font-black mb-2 tracking-tight text-white">
              {mode === 'signIn' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-slate-400 text-sm font-light">
              {mode === 'signIn' 
                ? 'Securely access your medical history and AI assistant.' 
                : 'Join MedVoice AI to start managing your health better.'}
            </p>
          </div>

          {(error || message) && (
            <div className={`mb-6 p-4 rounded-xl border flex items-start gap-4 ${
              error ? 'bg-red-500/10 border-red-500/30 text-red-200' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
            }`}>
              {error ? <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />}
              <p className="text-sm font-medium">{error || message}</p>
            </div>
          )}

          <form className="space-y-6">
            <div className="space-y-2 relative group">
              <label htmlFor="email" className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required 
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-transparent transition-all duration-300 shadow-inner group-hover:border-white/20 hover:bg-slate-900/70"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2 relative group">
              <label htmlFor="password" className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
                  required 
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-transparent transition-all duration-300 shadow-inner group-hover:border-white/20 hover:bg-slate-900/70"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {mode === 'signUp' && (
              <div className="space-y-2 relative group anim-item">
                <label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <ShieldCheck className="h-5 w-5 text-slate-500 group-focus-within:text-violet-400 transition-colors" />
                  </div>
                  <input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password" 
                    autoComplete="new-password"
                    required 
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/70 focus:border-transparent transition-all duration-300 shadow-inner group-hover:border-white/20 hover:bg-slate-900/70"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {mode === 'signUp' && (
              <div className="space-y-2 relative group anim-item mt-4">
                <label htmlFor="phone" className="text-xs font-semibold text-slate-300 uppercase tracking-wider ml-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  </div>
                  <input 
                    id="phone" 
                    name="phone" 
                    type="tel" 
                    autoComplete="tel"
                    required 
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-transparent transition-all duration-300 shadow-inner group-hover:border-white/20 hover:bg-slate-900/70"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-col gap-3">
                <SubmitButton mode={mode} />
                
                <p className="text-center text-sm text-slate-400 mt-2">
                  {mode === 'signIn' ? "Don't have an account?" : "Already have an account?"}{' '}
                  <button 
                    type="button"
                    onClick={toggleMode}
                    className={`${mode === 'signIn' ? 'text-blue-400 hover:text-blue-300' : 'text-violet-400 hover:text-violet-300'} font-semibold transition-colors`}
                  >
                    {mode === 'signIn' ? 'Create one' : 'Sign In'}
                  </button>
                </p>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>End-to-End Encrypted & HIPAA Compliant</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-80px)] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}>
      <LoginContent />
    </Suspense>
  )
}
