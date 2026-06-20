import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { GraduationCap, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register, loginWithGoogle, isAuthenticated, loading: authLoading, isServerWakingUp } = useAuth();
  const [name, setName] = useState('');
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100/40 via-slate-50 to-violet-100/40 px-4 font-sans bg-grid-pattern">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-sm font-semibold text-slate-700">Restoring your session...</p>
          {isServerWakingUp && (
            <p className="text-xs text-amber-600 font-semibold animate-pulse mt-2">
              Waking up backend server (Render free tier can take up to a minute)...
            </p>
          )}
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100/40 via-slate-50 to-violet-100/40 px-4 py-16 font-sans bg-grid-pattern">
      <div className="w-full max-w-[380px] space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="h-11 w-11 bg-indigo-600 text-white flex items-center justify-center rounded-xl shadow-md mb-3">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Create teacher account
          </h2>
          <p className="text-xs text-slate-450 mt-1 font-semibold">
            Join Question Wallah to compile exams instantly.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-200/60 shadow-premium p-8 rounded-2xl space-y-6">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 text-red-650 text-xs font-semibold border border-red-100">
              <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Sarah Connor"
                className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 placeholder-slate-400 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@school.edu"
                className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 placeholder-slate-400 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-3.5 py-2 border border-slate-250 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 placeholder-slate-400 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 transition-all"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  Register
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="px-3.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">Or</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          {/* Google Login Wrapper */}
          <div className="flex justify-center">
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

        {/* Footer Redirect */}
        <p className="text-center text-xs text-slate-500 font-semibold">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-indigo-650 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
