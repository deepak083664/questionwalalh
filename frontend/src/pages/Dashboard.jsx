import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
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
      color: 'text-indigo-700 bg-white border border-indigo-200',
      gradient: 'from-indigo-50 to-indigo-100/60 border-indigo-300/80 hover:border-indigo-400',
    },
    {
      title: 'Question Bank Count',
      value: stats?.savedQuestionsCount || 0,
      icon: Database,
      color: 'text-violet-750 bg-white border border-violet-200',
      gradient: 'from-violet-50 to-violet-100/60 border-violet-300/80 hover:border-violet-400',
    },
    {
      title: 'Total AI Questions',
      value: stats?.totalQuestionsCount || 0,
      icon: BrainCircuit,
      color: 'text-teal-750 bg-white border border-teal-200',
      gradient: 'from-teal-50 to-teal-100/60 border-teal-300/80 hover:border-teal-400',
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-semibold">
            Manage your classroom papers and digitize materials using Gemini AI.
          </p>
        </div>
        <button
          onClick={() => navigate('/generate')}
          className="px-4.5 py-2.5 bg-gradient-to-r from-indigo-650 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/10 hover:shadow-lg transition-all"
        >
          Generate Paper
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br ${card.gradient} p-6 rounded-2xl border border-slate-200/70 shadow-premium hover:shadow-[0_12px_24px_-4px_rgba(99,102,241,0.06)] hover:translate-y-[-2px] transition-all-custom flex items-center justify-between`}
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450">{card.title}</span>
                <p className="text-2xl font-extrabold text-slate-900">{card.value}</p>
              </div>
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${card.color}`}>
                <Icon className="h-5.5 w-5.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Usage & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions Panel */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Creation Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* AI Generator Panel */}
            <Link
              to="/generate"
              className="group bg-gradient-to-br from-white via-white to-indigo-50/10 p-5 rounded-2xl border border-slate-200/50 shadow-premium hover:border-indigo-300 hover:shadow-[0_12px_24px_-4px_rgba(99,102,241,0.06)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex gap-4 items-start">
                <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    AI Question Generator
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 font-semibold leading-relaxed">
                    Instantly draft exam questions based on class syllabus, chapters, and languages.
                  </p>
                </div>
              </div>
            </Link>

            {/* OCR Panel */}
            <Link
              to="/ocr-import"
              className="group bg-gradient-to-br from-white via-white to-violet-50/10 p-5 rounded-2xl border border-slate-200/50 shadow-premium hover:border-violet-300 hover:shadow-[0_12px_24px_-4px_rgba(139,92,246,0.06)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex gap-4 items-start">
                <div className="h-9 w-9 rounded-lg bg-violet-50 text-violet-650 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-600 group-hover:text-white transition-all">
                  <ScanLine className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    Scan Existing Paper (OCR)
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 font-semibold leading-relaxed">
                    Upload snapshots of worksheets or book chapters. Extract text and auto-generate duplicates.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* AI Quota Card (SaaS Detail) */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Subscription & Quota</h2>
          <div className="premium-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-teal-50 text-teal-650 flex items-center justify-center border border-teal-100">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Gemini AI Usage</h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Teacher Pro Tier</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-500">
                <span>AI Generations Used</span>
                <span>{stats?.totalQuestionsCount || 0} / 500 Qs</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(((stats?.totalQuestionsCount || 0) / 500) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100">
              <p className="text-[10px] text-indigo-750 font-bold leading-normal">
                Need more generations or priority AI access? Reach out to support to upgrade to School Enterprise licensing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Question Papers Table */}
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Recent Papers</h2>
          {recentPapers.length > 0 && (
            <Link to="/history" className="text-xs font-bold text-indigo-650 hover:underline">
              View Archives
            </Link>
          )}
        </div>

        {recentPapers.length === 0 ? (
          <div className="bg-white border border-slate-200/50 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <FileText className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-base font-bold text-slate-800">No question papers created yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm font-semibold">
              Draft assessment papers by configuring lesson criteria or scanning worksheet images.
            </p>
          </div>
        ) : (
          <div className="premium-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-slate-100 text-[10px] font-extrabold uppercase tracking-wider border-b border-slate-700">
                    <th className="py-3 px-6">Paper details</th>
                    <th className="py-3 px-6">Subject</th>
                    <th className="py-3 px-6">Class</th>
                    <th className="py-3 px-6">Marks</th>
                    <th className="py-3 px-6">Questions</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {recentPapers.map((paper) => (
                    <tr key={paper._id} className="hover:bg-indigo-50/40 transition-all font-semibold text-xs text-slate-700">
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 truncate max-w-xs">{paper.title}</span>
                          <span className="text-[9px] text-slate-400 flex items-center gap-1 mt-1 font-semibold">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            {new Date(paper.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">{paper.subject}</td>
                      <td className="py-4 px-6">Class {paper.classLevel}</td>
                      <td className="py-4 px-6 font-bold">{paper.totalMarks}</td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">
                          {paper.questionCount} Questions
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/builder/${paper._id}`)}
                            className="p-1.5 text-slate-450 hover:text-indigo-650 hover:bg-slate-50 rounded-lg transition-all"
                            title="Edit Paper"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(paper._id)}
                            className="p-1.5 text-slate-450 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition-all"
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
