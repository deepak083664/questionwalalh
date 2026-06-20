import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { GraduationCap, Mail, Lock, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import Mascot from '../components/Mascot';

const Register = () => {
  const { register, loginWithGoogle, isAuthenticated, loading: authLoading, isServerWakingUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Entrance sequencing
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCard(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Handle premium restoring session visual state
  if (authLoading && localStorage.getItem('token')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-[#F5F3FF] via-[#EEF2FF] to-[#E0F2FE] dark:from-[#020617] dark:via-[#0f172a] dark:to-[#1e1b4b] px-4 font-sans bg-grid-pattern overflow-hidden relative">
        {/* Floating aurora blobs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-indigo-400/20 dark:bg-indigo-500/10 aurora-blur animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-400/20 dark:bg-cyan-500/10 aurora-blur animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="clay-card bg-white/80 dark:bg-slate-900/80 p-8 rounded-3xl text-center max-w-sm flex flex-col items-center gap-6 relative z-10">
          <Mascot state="working" />
          <div>
            <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Restoring your session...</p>
            {isServerWakingUp && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-bold animate-pulse mt-2">
                Waking up backend server (Render free tier can take up to a minute)...
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return setError('Please fill in all fields.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setError('');
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const handleGoogleSuccess = async (response) => {
    setError('');
    setLoading(true);
    const result = await loginWithGoogle(response.credential);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const handleGoogleError = () => {
    setError('Google registration failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-[#F5F3FF] via-[#EEF2FF] to-[#E0F2FE] dark:from-[#020617] dark:via-[#0f172a] dark:to-[#1e1b4b] px-4 py-16 font-sans bg-grid-pattern relative overflow-hidden">
      {/* Floating particles/shapes in background */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-indigo-400/30 rounded-full animate-bounce" style={{ animationDuration: '6s' }}></div>
      <div className="absolute bottom-10 right-10 w-6 h-6 bg-cyan-400/30 rounded-full animate-bounce" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-12 w-3 h-3 bg-purple-400/30 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
      <div className="absolute bottom-1/3 left-12 w-5 h-5 bg-pink-400/20 rounded-lg rotate-45 animate-pulse"></div>

      {/* Floating aurora blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-300/15 dark:bg-indigo-950/10 aurora-blur"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-cyan-300/15 dark:bg-cyan-950/10 aurora-blur"></div>

      <div className="w-full max-w-[850px] grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        
        {/* Left Side: Mascot Welcomer */}
        <div className="flex flex-col items-center text-center md:text-left md:items-start space-y-6 px-4">
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 px-3 py-1.5 rounded-full clay-badge">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <span className="text-[10px] font-extrabold text-indigo-650 dark:text-indigo-350 uppercase tracking-wider">Join Us Today</span>
          </div>
          
          <div className="transition-transform duration-500 hover:scale-105">
            <Mascot state="happy" message="Let's sign up!" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Empower your teaching with <span className="text-indigo-600 dark:text-indigo-400">AI</span>.
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              Create a secure teacher profile and start auto-formatting professional, curriculum-aligned exam papers today.
            </p>
          </div>
        </div>

        {/* Right Side: Register Card */}
        <div className={`transition-all duration-700 transform ${showCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/80 p-8 rounded-3xl space-y-5 backdrop-blur-md clay-card">
            {/* Header */}
            <div className="text-center">
              <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center rounded-2xl shadow-sm mx-auto mb-2 clay-badge">
                <GraduationCap className="h-5.5 w-5.5 text-indigo-650 dark:text-indigo-450" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                Teacher Signup
              </h2>
              <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-0.5 font-semibold">
                Set up your account in under a minute.
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-650 dark:text-rose-450 text-xs font-semibold border border-rose-100 dark:border-rose-900/50">
                <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-1.5 ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. Sarah Connor"
                    className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold placeholder-slate-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-1.5 ml-1">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teacher@school.edu"
                    className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold placeholder-slate-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-455 dark:text-slate-400 mb-1.5 ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold placeholder-slate-400"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 clay-btn clay-btn-indigo"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    Register Account
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center">
              <div className="flex-grow border-t border-slate-200/50 dark:border-slate-800/50"></div>
              <span className="px-3.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">Or</span>
              <div className="flex-grow border-t border-slate-200/50 dark:border-slate-800/50"></div>
            </div>

            {/* Google Login Wrapper */}
            <div className="flex justify-center border border-slate-200/50 dark:border-slate-800/50 p-2.5 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl clay-input">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="outline"
                shape="circle"
                size="medium"
                width="260"
              />
            </div>

            {/* Footer Redirect */}
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-semibold pt-2">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-indigo-650 dark:text-indigo-400 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
