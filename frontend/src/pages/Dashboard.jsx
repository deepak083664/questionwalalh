import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Mascot from '../components/Mascot';
import {
  FileText,
  Database,
  BrainCircuit,
  ScanLine,
  Download,
  Edit3,
  Calendar,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentPapers, setRecentPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/api/papers/dashboard/stats');
        if (res.data.success) {
          setStats(res.data.stats);
          setRecentPapers(res.data.recentPapers);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleDownloadPDF = (paperId) => {
    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_API_URL || '';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    window.open(`${cleanBase}/api/papers/${paperId}/pdf?token=${token}`, '_blank');
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-96 bg-slate-100 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white border border-slate-100 rounded-2xl shadow-premium"></div>
          ))}
        </div>
        <div className="h-48 bg-white border border-slate-100 rounded-2xl shadow-premium"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Generated Papers',
      value: stats?.totalPapers || 0,
      icon: FileText,
      color: 'text-indigo-650 bg-white border border-indigo-150',
      clay: 'bg-indigo-50 border-indigo-100/50 shadow-sm',
    },
    {
      title: 'Total AI Questions',
      value: stats?.totalQuestionsCount || 0,
      icon: BrainCircuit,
      color: 'text-cyan-650 bg-white border border-cyan-150',
      clay: 'bg-cyan-50 border-cyan-100/50 shadow-sm',
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto clay-animate-fade">
      {/* Welcome Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/30 dark:border-slate-800/40">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user?.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-semibold">
            Manage your classroom papers and digitize materials using Question Wallah AI.
          </p>
        </div>
        <button
          onClick={() => navigate('/generate')}
          className="px-5 py-3 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md clay-btn clay-btn-indigo"
        >
          Generate Paper
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stat Card 1 */}
        <div className="clay-card bg-white/60 dark:bg-indigo-950/20 border-white/40 dark:border-indigo-900/30 p-6 flex items-center justify-between hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(99,102,241,0.1)] dark:hover:shadow-[0_8px_30px_rgba(99,102,241,0.05)] transition-all duration-300">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-400">Total Generated Papers</span>
            <p className="text-2xl font-black text-slate-850 dark:text-white">{stats?.totalPapers || 0}</p>
          </div>
          <div className="h-11 w-11 rounded-2xl flex items-center justify-center border shadow-sm clay-badge bg-indigo-50 dark:bg-indigo-900/50 border-indigo-150 dark:border-indigo-850 text-indigo-550 dark:text-indigo-400">
            <FileText className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="clay-card bg-white/60 dark:bg-cyan-950/20 border-white/40 dark:border-cyan-900/30 p-6 flex items-center justify-between hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(6,182,212,0.1)] dark:hover:shadow-[0_8px_30px_rgba(6,182,212,0.05)] transition-all duration-300">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-400">Total AI Questions</span>
            <p className="text-2xl font-black text-slate-850 dark:text-white">{stats?.totalQuestionsCount || 0}</p>
          </div>
          <div className="h-11 w-11 rounded-2xl flex items-center justify-center border shadow-sm clay-badge bg-cyan-50 dark:bg-cyan-900/50 border-cyan-150 dark:border-cyan-850 text-cyan-550 dark:text-cyan-400">
            <BrainCircuit className="h-5.5 w-5.5" />
          </div>
        </div>
      </div>

      {/* AI Usage & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions Panel */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-400">Creation Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* AI Generator Panel */}
            <Link
              to="/generate"
              className="group bg-white/60 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:scale-[1.02] transition-all duration-300 clay-card"
            >
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 text-indigo-500 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-sm clay-badge">
                  <BrainCircuit className="h-5.5 w-5.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    AI Question Generator
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-semibold leading-relaxed">
                    Instantly draft exam questions based on class syllabus, chapters, and languages.
                  </p>
                </div>
              </div>
            </Link>

            {/* OCR Panel */}
            <Link
              to="/ocr-import"
              className="group bg-white/60 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:scale-[1.02] transition-all duration-300 clay-card"
            >
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/40 text-purple-500 dark:text-purple-400 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-650 dark:group-hover:bg-purple-550 group-hover:text-white transition-all shadow-sm clay-badge">
                  <ScanLine className="h-5.5 w-5.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    Scan Existing Paper (OCR)
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-semibold leading-relaxed">
                    Upload snapshots of worksheets or book chapters. Extract text and auto-generate duplicates.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* AI Quota Card (SaaS Detail) */}
        <div className="space-y-6">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-400">Subscription & Quota</h2>
          <div className="clay-card bg-white/70 dark:bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-150 dark:border-teal-900/45 shadow-sm clay-badge">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Question Wallah AI Usage</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Teacher Pro Tier</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <span>AI Generations Used</span>
                <span>{stats?.totalQuestionsCount || 0} / 500 Qs</span>
              </div>
              <div className="w-full bg-slate-100/80 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200/30 dark:border-slate-700/50 clay-input">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(((stats?.totalQuestionsCount || 0) / 500) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-indigo-50/50 dark:bg-indigo-950/30 p-3.5 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
              <p className="text-[10px] text-indigo-750 dark:text-indigo-300 font-bold leading-normal">
                Need more generations or priority AI access? Reach out to support to upgrade to School Enterprise licensing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Question Papers Table */}
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-slate-200/30 dark:border-slate-800/40 pb-3">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-400">Recent Papers</h2>
          {recentPapers.length > 0 && (
            <Link to="/history" className="text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:underline">
              View Archives
            </Link>
          )}
        </div>

        {recentPapers.length === 0 ? (
          <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-12 text-center flex flex-col items-center justify-center clay-card max-w-lg mx-auto">
            <Mascot state="happy" message="Let's build your first paper!" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-4">No question papers created yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm font-semibold leading-relaxed">
              Draft assessment papers by configuring lesson criteria or scanning worksheet images.
            </p>
          </div>
        ) : (
          <div className="clay-card bg-white/60 dark:bg-slate-900/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/80 border-b border-slate-200/30 dark:border-slate-800/40 text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                    <th className="py-3.5 px-6">Paper details</th>
                    <th className="py-3.5 px-6">Subject</th>
                    <th className="py-3.5 px-6">Class</th>
                    <th className="py-3.5 px-6">Marks</th>
                    <th className="py-3.5 px-6">Questions</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/40 bg-white/20 dark:bg-slate-900/20">
                  {recentPapers.map((paper) => (
                    <tr key={paper._id} className="hover:bg-indigo-55/20 dark:hover:bg-indigo-950/20 transition-all font-semibold text-xs text-slate-700 dark:text-slate-300">
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 dark:text-white truncate max-w-xs">{paper.title}</span>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-1 font-semibold">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            {new Date(paper.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">{paper.subject}</td>
                      <td className="py-4 px-6">Class {paper.classLevel}</td>
                      <td className="py-4 px-6 font-extrabold">{paper.totalMarks}</td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-0.5 bg-slate-100/80 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 rounded-lg text-[9px] font-bold clay-badge">
                          {paper.questionCount} Questions
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/builder/${paper._id}`)}
                            className="p-1.5 text-slate-450 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all"
                            title="Edit Paper"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(paper._id)}
                            className="p-1.5 text-slate-450 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all"
                            title="Download PDF"
                          >
                            <Download className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
