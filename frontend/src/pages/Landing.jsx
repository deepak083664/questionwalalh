import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  Globe
} from 'lucide-react';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: BrainCircuit,
      title: 'Gemini AI Generator',
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
    <div className="min-h-screen bg-white text-slate-800 antialiased font-sans">
      {/* Top Navbar Header */}
      <header className="border-b border-slate-100 bg-white/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 text-indigo-650" />
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900">
              Question<span className="text-indigo-650">Wallah</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-650 transition-colors">Features</a>
            <a href="#faq" className="hover:text-indigo-650 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/')}
                className="px-3 sm:px-4.5 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span className="hidden sm:inline">Go to </span>Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <>
                <Link to="/login" className="px-2.5 sm:px-4 py-2 text-xs font-bold text-slate-650 hover:text-slate-900 transition-colors">
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 sm:px-4.5 py-2 bg-indigo-650 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
                >
                  <span className="hidden sm:inline">Get Started Free</span>
                  <span className="inline sm:hidden">Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-slate-50">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[400px] w-[600px] bg-indigo-600/5 rounded-full blur-3xl -z-10"></div>
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold tracking-wider uppercase">
            <Zap className="h-3 w-3" /> Modern Assessment Engine
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Create professional question papers <br />
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">in seconds with Gemini AI</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Designed for teachers, coaching classes, and schools. Generate questions instantly, scan textbooks using OCR, customize layouts, and export high-fidelity PDFs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={() => navigate(isAuthenticated ? '/' : '/register')}
              className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-2 text-sm"
            >
              Start Generating Free
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60 font-bold rounded-xl text-sm text-center"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              SaaS Assessment Features
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Everything you need to write, manage, and download curriculum tests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div key={index} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-premium hover:shadow-hoverCard hover:border-slate-200 transition-all duration-300 space-y-4">
                  <div className="h-10 w-10 bg-indigo-50 text-indigo-650 rounded-xl flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">{feat.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Created to save teachers hours of workload
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                No more writing questions from scratch or manually aligning margins in Microsoft Word. Question Wallah automates assessment drafting, so you can focus on helping students.
              </p>
              <div className="space-y-3">
                {[
                  '100% Mobile Responsive - generate papers on your phone.',
                  'Bilingual settings (English & Hindi support).',
                  'Instant print-ready formatted A4 layouts.'
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                    <CheckCircle className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 space-y-4 shadow-inner">
              <div className="flex gap-2">
                <div className="h-3 w-3 bg-red-400 rounded-full"></div>
                <div className="h-3 w-3 bg-yellow-400 rounded-full"></div>
                <div className="h-3 w-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="border border-slate-200/50 bg-white rounded-xl p-4 shadow-sm space-y-2">
                <span className="text-[9px] font-bold text-indigo-600 block uppercase">Generated MCQ Preview</span>
                <p className="text-xs font-bold text-slate-950">Q1. Which of the following is the powerhouse of cell?</p>
                <div className="grid grid-cols-2 gap-2 text-[9px] font-semibold text-slate-500">
                  <span>A) Ribosome</span>
                  <span>B) Mitochondria</span>
                  <span>C) Golgi body</span>
                  <span>D) Lysosome</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ accordions */}
      <section id="faq" className="py-20 bg-slate-50/20 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 font-medium">Got questions? We have answers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-2">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-start gap-2">
                  <HelpCircle className="h-4 w-4 text-indigo-650 mt-0.5 flex-shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12 bg-white text-slate-500 font-medium text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-indigo-650" />
            <span className="font-extrabold text-slate-900">Question Wallah</span>
          </div>
          
          <p>© {new Date().getFullYear()} Question Wallah SaaS. All rights reserved.</p>
          
          <div className="flex gap-4">
            <span className="hover:text-indigo-650 cursor-pointer">Terms</span>
            <span className="hover:text-indigo-650 cursor-pointer">Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
