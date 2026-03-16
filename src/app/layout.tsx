import type { Metadata } from "next";
import "@fontsource/inter";
import "@fontsource/outfit";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Activity } from "lucide-react";
import FooterYear from "@/components/layout/FooterYear";

export const metadata: Metadata = {
  title: "MedVoice AI - Your Medical Voice Assistant",
  description: "Get instant medical guidance with voice-enabled AI responses and connect with top doctors. Powered by advanced neural networks for accurate, personalized healthcare assistance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans min-h-screen flex flex-col antialiased selection:bg-violet-500/30 selection:text-violet-200`}>
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>

        {/* Premium Footer */}
        <footer className="glass-nav mt-auto pt-16 pb-8 border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
              {/* Brand Column */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-blue-500/15 p-1.5 rounded-lg">
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                    MedVoice AI
                  </span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Transforming healthcare with intelligent voice-powered AI assistance. Fast, accurate, and always available.
                </p>
              </div>

              {/* Product */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Product</h4>
                <ul className="space-y-2.5">
                  <li><Link href="/#features" className="text-sm text-slate-500 hover:text-blue-400 transition-colors">Features</Link></li>
                  <li><Link href="/#how-it-works" className="text-sm text-slate-500 hover:text-blue-400 transition-colors">How It Works</Link></li>
                  <li><Link href="/chatbot" className="text-sm text-slate-500 hover:text-blue-400 transition-colors">AI Assistant</Link></li>
                  <li><Link href="/#faq" className="text-sm text-slate-500 hover:text-blue-400 transition-colors">FAQ</Link></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Company</h4>
                <ul className="space-y-2.5">
                  <li><Link href="/" className="text-sm text-slate-500 hover:text-blue-400 transition-colors">About Us</Link></li>
                  <li><Link href="/" className="text-sm text-slate-500 hover:text-blue-400 transition-colors">Careers</Link></li>
                  <li><Link href="/" className="text-sm text-slate-500 hover:text-blue-400 transition-colors">Blog</Link></li>
                  <li><Link href="/" className="text-sm text-slate-500 hover:text-blue-400 transition-colors">Contact</Link></li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Legal</h4>
                <ul className="space-y-2.5">
                  <li><Link href="/" className="text-sm text-slate-500 hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/" className="text-sm text-slate-500 hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                  <li><Link href="/" className="text-sm text-slate-500 hover:text-blue-400 transition-colors">HIPAA Compliance</Link></li>
                  <li><Link href="/" className="text-sm text-slate-500 hover:text-blue-400 transition-colors">Data Security</Link></li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-slate-600 text-xs">
                &copy; <FooterYear /> MedVoice AI. All rights reserved. This is an AI assistant and does not replace professional medical advice.
              </p>
              <div className="flex items-center gap-6">
                <span className="text-xs text-slate-600">Made with ❤️ for better healthcare</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
