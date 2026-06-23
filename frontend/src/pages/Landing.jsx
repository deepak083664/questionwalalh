import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  GraduationCap,
  BrainCircuit,
  ScanLine,
  Database,
  Download,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Sun,
  Moon
} from 'lucide-react';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Terms, Policy & About Modal States
  const [isTermsOpen, setIsTermsOpen] = React.useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = React.useState(false);
  const [isAboutOpen, setIsAboutOpen] = React.useState(false);

  const features = [
    {
      icon: BrainCircuit,
      title: 'Question Wallah AI Generator',
      description: 'Generate syllabus-aligned questions (MCQ, Short, Long) across subjects and classes in seconds.'
    },
    {
      icon: ScanLine,
      title: 'OCR Scanning (Image/PDF)',
      description: 'Upload printed books or sheets. Extract text instantly and let AI write similar/complementary questions.'
    },
    {
      icon: Database,
      title: 'Centralized Question Bank',
      description: 'Curate your custom question bank. Search, filter, and reuse your best questions in future papers.'
    },
    {
      icon: Download,
      title: 'Professional PDF Export',
      description: 'Download print-ready layouts with custom school headers, exam instructions, and marks distribution.'
    }
  ];

  const faqs = [
    {
      q: 'Does it support Hindi language questions?',
      a: 'Yes, Question Wallah generates high-quality bilingual questions in both English and Hindi. The PDF generator embeds special Unicode fonts to render Hindi Devanagari script perfectly.'
    },
    {
      q: 'How accurate is the OCR Question Scanner?',
      a: 'Very accurate. For scanned text PDFs, we pull text directly with 100% precision. For images/photos, we run server-side OCR via Tesseract.js to digitize worksheets.'
    },
    {
      q: 'Can I customize the generated exam papers?',
      a: 'Absolutely. The Interactive Workspace lets you drag/reorder questions, edit text in-place, modify marks weight, delete questions, and append custom questions manually.'
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-200 antialiased font-sans">
      {/* Top Navbar Header */}
      <header className="sticky top-0 z-50 w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-850/50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 text-indigo-500 animate-pulse" />
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
              Question<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500">Wallah</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-650 dark:text-slate-300">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
            <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="h-7.5 w-7.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg flex items-center justify-center transition-all shadow-sm clay-badge"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-slate-650" />
              )}
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="clay-btn clay-btn-indigo px-3 py-2 text-xs"
              >
                <span className="hidden sm:inline">Go to </span>Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <Link
                to="/register"
                className="clay-btn clay-btn-indigo px-3.5 py-2 text-xs"
              >
                Sign Up
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-8 sm:pb-12 overflow-hidden border-b border-slate-800 bg-grid-pattern min-h-[400px] sm:min-h-[500px] flex items-end justify-center">
        {/* Full-width Banner Image Background */}
        <div 
          className="absolute inset-0 bg-cover bg-[position:center_bottom] sm:bg-center bg-no-repeat opacity-[0.97] transition-all duration-300 scale-102"
          style={{ 
            backgroundImage: "url('/banner.jpg')",
          }}
        ></div>
        {/* Gradient Tint Overlay to ensure text readability in both Light and Dark modes */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/80 mix-blend-normal"></div>

        {/* Floating background decorative clay circles and aurora glows */}
        <div className="absolute top-12 left-10 h-24 w-24 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-xl clay-floating -z-10"></div>
        <div className="absolute bottom-12 right-12 h-32 w-32 bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-xl clay-floating [animation-delay:2.5s] -z-10"></div>
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-indigo-400/15 dark:bg-indigo-500/5 aurora-blur animate-pulse -z-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-400/15 dark:bg-cyan-500/5 aurora-blur animate-pulse [animation-delay:3s] -z-20"></div>

        {/* Educational Quote in Glass Box */}
        <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-2xl bg-slate-950/40 border border-white/5 backdrop-blur-sm shadow-inner w-[calc(100%-3rem)] max-w-md sm:max-w-lg">
          <p className="text-[10px] sm:text-[11px] italic text-indigo-200 font-bold tracking-wide leading-relaxed">
            "Empowering Educators: Create syllabus-aligned bilingual tests, scan worksheets with OCR, and export print-ready PDFs in seconds."
          </p>
        </div>

        {/* Hero Content aligned at the bottom over the Banner */}
        <div className="relative z-10 space-y-4 max-w-2xl mx-auto px-6 text-center flex flex-col items-center clay-animate-fade w-full">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-[1.3] text-white">
            Create professional question papers in seconds with <br className="hidden sm:inline" />
            <span className="text-3d-glowing whitespace-nowrap inline-block mt-2 sm:mt-1 font-black">
              Question Wallah AI
            </span>
          </h1>

          <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full">
            <button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
              className="px-4 py-2.5 sm:px-6 sm:py-3 clay-btn clay-btn-indigo text-[10px] sm:text-xs active:scale-95 transition-all shadow-lg flex items-center justify-center gap-1.5"
            >
              Start Generating Free
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <a
              href="#features"
              className="px-4 py-2.5 sm:px-6 sm:py-3 clay-btn clay-btn-flat text-[10px] sm:text-xs active:scale-95 transition-all shadow-md flex items-center justify-center"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="pt-10 pb-16 bg-slate-50/30 dark:bg-slate-950/20 border-b border-indigo-50/20 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              QuestionWallah Features
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Everything you need to write, manage, and download curriculum tests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div key={index} className="clay-card p-6 space-y-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm clay-animate-fade" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="h-11 w-11 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/40 text-indigo-500 dark:text-indigo-400 rounded-2xl flex items-center justify-center shadow-sm clay-badge">
                    <Icon className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">{feat.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 border-b border-indigo-50/20 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Created to save teachers hours of workload
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                No more writing questions from scratch or manually aligning margins in Microsoft Word. Question Wallah automates assessment drafting, so you can focus on helping students.
              </p>
              <div className="space-y-3">
                {[
                  '100% Mobile Responsive - generate papers on your phone.',
                  'Bilingual settings (English & Hindi support).',
                  'Instant print-ready formatted A4 layouts.'
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-350">
                    <CheckCircle className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-8 space-y-4 shadow-inner clay-input">
              <div className="flex gap-2">
                <div className="h-3 w-3 bg-rose-400 rounded-full border border-rose-500"></div>
                <div className="h-3 w-3 bg-amber-400 rounded-full border border-amber-500"></div>
                <div className="h-3 w-3 bg-emerald-450 rounded-full border border-emerald-500"></div>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl shadow-sm space-y-2 border border-white dark:border-slate-850 clay-card">
                <span className="text-[9px] font-bold text-indigo-500 dark:text-indigo-400 block uppercase tracking-wide">Generated MCQ Preview</span>
                <p className="text-xs font-extrabold text-slate-900 dark:text-white">Q1. Which of the following is the powerhouse of cell?</p>
                <div className="grid grid-cols-2 gap-2.5 text-[9px] font-semibold text-slate-500 dark:text-slate-450 mt-2">
                  <span className="bg-slate-50/70 dark:bg-slate-950/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800">A) Ribosome</span>
                  <span className="bg-indigo-50/70 dark:bg-indigo-950/40 p-2 rounded-lg border border-indigo-100/50 dark:border-indigo-900/30 text-indigo-500 dark:text-indigo-400 font-bold">B) Mitochondria</span>
                  <span className="bg-slate-50/70 dark:bg-slate-950/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800">C) Golgi body</span>
                  <span className="bg-slate-50/70 dark:bg-slate-950/40 p-2 rounded-lg border border-slate-100 dark:border-slate-800">D) Lysosome</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ accordions */}
      <section id="faq" className="py-20 bg-slate-50/20 dark:bg-slate-950/10 border-b border-indigo-50/20 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Got questions? We have answers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="clay-card p-6 space-y-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-start gap-2">
                  <HelpCircle className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-semibold pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative mt-20 border-t border-slate-850 bg-gradient-to-r from-[#111827] to-[#1E293B] py-16 text-slate-450 font-semibold text-xs overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 bg-slate-800/80 border border-slate-700/50 flex items-center justify-center rounded-xl shadow-inner clay-badge">
              <GraduationCap className="h-5 w-5 text-indigo-400 animate-pulse" />
            </div>
            <span className="font-extrabold text-white text-sm tracking-tight">
              Question<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Wallah</span>
            </span>
          </div>
          
          <div className="text-center md:text-left space-y-2 text-slate-400">
            <p className="font-semibold text-xs">
              © {new Date().getFullYear()} Question Wallah. All rights reserved.
            </p>
            <p className="text-[11px] text-slate-500 font-semibold flex items-center justify-center md:justify-start gap-1">
              <span>Designed & Developed by</span>
              <a 
                href="https://deepakintro.netlify.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 hover:underline transition-all duration-300 hover:scale-105 transform inline-block"
              >
                Deepak
              </a>
            </p>
          </div>
          
          <div className="flex gap-6 text-slate-400 font-bold">
            <span 
              onClick={() => setIsAboutOpen(true)}
              className="hover:text-indigo-450 transition-all cursor-pointer hover:underline hover:-translate-y-0.5 transform"
            >
              About
            </span>
            <span 
              onClick={() => setIsTermsOpen(true)}
              className="hover:text-indigo-450 transition-all cursor-pointer hover:underline hover:-translate-y-0.5 transform"
            >
              Terms
            </span>
            <span 
              onClick={() => setIsPolicyOpen(true)}
              className="hover:text-indigo-450 transition-all cursor-pointer hover:underline hover:-translate-y-0.5 transform"
            >
              Privacy Policy
            </span>
          </div>
        </div>
      </footer>

      {/* Terms Modal */}
      {isTermsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all duration-300">
          <div className="clay-card max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl relative clay-animate-fade">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Terms of Service (नियम और शर्तें)
            </h3>
            <div className="text-xs text-slate-650 dark:text-slate-350 space-y-3 font-semibold leading-relaxed overflow-y-auto max-h-[300px] pr-2">
              <p>Welcome to Question Wallah. By using our platform, you agree to these terms:</p>
              <div className="space-y-2.5">
                <p><strong>1. Use License:</strong> The question papers generated are for educational use by teachers, schools, or students. You may download, print, and distribute them.</p>
                <p><strong>2. Fair AI Usage:</strong> Do not abuse the AI generation features to produce spam, malicious content, or copyrighted materials.</p>
                <p><strong>3. Content Policy:</strong> The user retains rights to their own questions, but Question Wallah is not responsible for the accuracy of AI-generated answers.</p>
                <p><strong>4. Service Updates:</strong> We reserve the right to limit, modify, or suspend features of the platform at our discretion.</p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setIsTermsOpen(false)}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
              >
                I Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {isPolicyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all duration-300">
          <div className="clay-card max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl relative clay-animate-fade">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              Privacy Policy (गोपनीयता नीति)
            </h3>
            <div className="text-xs text-slate-650 dark:text-slate-350 space-y-3 font-semibold leading-relaxed overflow-y-auto max-h-[300px] pr-2">
              <p>Your privacy is important to us. Here is how we manage your information:</p>
              <div className="space-y-2.5">
                <p><strong>1. Information Collection:</strong> We collect your name, email address, and school details upon registration to customize your exam PDF headers.</p>
                <p><strong>2. OCR & File Privacy:</strong> Any files (Images/PDFs) uploaded for OCR scanning are processed securely and deleted immediately after text extraction.</p>
                <p><strong>3. Data Security:</strong> We do not share your personal data or generated question papers with any third-party marketing companies.</p>
                <p><strong>4. Account Deletion:</strong> You can completely delete your profile, history, and papers from your dashboard at any time.</p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setIsPolicyOpen(false)}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all duration-300">
          <div className="clay-card max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl relative clay-animate-fade">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
              About Question Wallah (हमारे बारे में)
            </h3>
            <div className="text-xs text-slate-650 dark:text-slate-350 space-y-3 font-semibold leading-relaxed overflow-y-auto max-h-[300px] pr-2">
              <p>
                <strong>Question Wallah</strong> is an AI-powered SaaS platform designed specifically for teachers, educators, and schools to streamline test paper creation.
              </p>
              <div className="space-y-2.5">
                <p>💡 <strong>Our Mission:</strong> Automate the tedious process of assessment drafting, saving educators hours of layout formatting and question writing.</p>
                <p>🌐 <strong>Bilingual by Design:</strong> Native support for English and Hindi (Devanagari) scripts, enabling perfect formatting for local and global curriculums.</p>
                <p>⚙️ <strong>OCR Scanning:</strong> Instantly digitize legacy worksheets, books, or notes using server-side optical character recognition.</p>
                <p>👨‍💻 <strong>Designed & Developed by:</strong> Deepak. Visit my portfolio at <a href="https://deepakintro.netlify.app" target="_blank" rel="noopener noreferrer" className="text-indigo-500 dark:text-indigo-400 hover:underline">deepakintro.netlify.app</a>.</p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setIsAboutOpen(false)}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
