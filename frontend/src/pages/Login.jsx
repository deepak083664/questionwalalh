import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { GraduationCap, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, loginWithGoogle, isAuthenticated, loading: authLoading, isServerWakingUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Handle premium restoring session visual state
  if (authLoading && localStorage.getItem('token')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f6fa] px-4 font-sans bg-grid-pattern">
        <div className="clay-card bg-white/80 p-8 rounded-3xl text-center max-w-sm flex flex-col items-center gap-4">
          <div className="h-14 w-14 relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-650/20 border-t-indigo-650 animate-spin"></div>
            <GraduationCap className="h-6 w-6 text-indigo-600 animate-pulse" />
          </div>
          <p className="text-sm font-extrabold text-slate-800">Restoring your session...</p>
          {isServerWakingUp && (
            <p className="text-xs text-amber-600 font-bold animate-pulse mt-1">
              Waking up backend server (Render free tier can take up to a minute)...
            </p>
          )}
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError('Please enter both email and password.');
    }
    
    setError('');
    setLoading(true);
    const result = await login(email, password);
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
    setError('Google authentication failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#eef2f6] px-4 py-16 font-sans bg-grid-pattern">
      <div className="w-full max-w-[390px] space-y-6 clay-animate-fade">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 bg-white text-indigo-600 border border-slate-200/50 flex items-center justify-center rounded-2xl shadow-sm mb-3 clay-badge">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Sign in to Question Wallah
          </h2>
          <p className="text-xs text-slate-450 mt-1 font-semibold">
            Enter your credentials or use single sign-on.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 border border-slate-200/60 p-8 rounded-3xl space-y-6 backdrop-blur-md clay-card">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 text-rose-650 text-xs font-semibold border border-rose-100">
              <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-1.5 ml-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@school.edu"
                className="w-full px-4 py-2.5 text-xs font-semibold placeholder-slate-400"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 ml-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450">
                  Password
                </label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 text-xs font-semibold placeholder-slate-400"
                required
              />
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
                  Sign In
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-grow border-t border-slate-200/50"></div>
            <span className="px-3.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">Or</span>
            <div className="flex-grow border-t border-slate-200/50"></div>
          </div>

          {/* Google Login Wrapper */}
          <div className="flex justify-center border border-slate-200/50 p-2.5 bg-slate-50/50 rounded-2xl clay-input">
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
        </div>

        {/* Footer Registration Redirect */}
        <p className="text-center text-xs text-slate-500 font-semibold">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-indigo-650 hover:underline"
          >
            Create teacher account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
