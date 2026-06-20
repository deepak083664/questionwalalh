import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  FileText,
  Download,
  Edit3,
  Trash2,
  Calendar
} from 'lucide-react';

import Mascot from '../components/Mascot';

const History = () => {
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPapers = async () => {
    try {
      const res = await api.get('/api/papers');
      if (res.data.success) {
        setPapers(res.data.papers);
      }
    } catch (err) {
      console.error('Failed to fetch historical papers:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  const handleDownloadPDF = (paperId) => {
    const token = localStorage.getItem('token');
    const baseUrl = import.meta.env.VITE_API_URL || '';
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    window.open(`${cleanBase}/api/papers/${paperId}/pdf?token=${token}`, '_blank');
  };

  const handleDeletePaper = async (paperId) => {
    if (!window.confirm('Are you sure you want to delete this question paper? This action is permanent.')) {
      return;
    }
    
    try {
      const res = await api.delete(`/api/papers/${paperId}`);
      if (res.data.success) {
        setPapers(papers.filter(p => p._id !== paperId));
      }
    } catch (err) {
      console.error('Delete paper failed:', err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans clay-animate-fade">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200/30 dark:border-slate-800/40">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Saved Papers & Archives
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-semibold">
          Open, duplicate, and download your previously generated question sheets.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-white/50 border border-slate-150 rounded-3xl"></div>
          ))}
        </div>
      ) : papers.length === 0 ? (
        <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-12 text-center flex flex-col items-center justify-center clay-card max-w-lg mx-auto">
          <Mascot state="happy" message="Let's create your first paper!" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mt-4">No question papers archived</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs font-semibold leading-relaxed">
            Create assessment question sheets using the AI Generator or scan print sheets to archive them here.
          </p>
          <button
            onClick={() => navigate('/generate')}
            className="mt-6 px-6 py-3 text-white font-bold rounded-xl text-xs shadow-md clay-btn clay-btn-indigo"
          >
            Create Paper
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((paper) => (
            <div
              key={paper._id}
              className="bg-white/60 dark:bg-slate-900/60 p-5 flex flex-col justify-between hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(99,102,241,0.1)] dark:hover:shadow-[0_8px_30px_rgba(99,102,241,0.05)] transition-all duration-300 clay-card"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/50 border border-indigo-150 dark:border-indigo-850 text-[9px] font-extrabold text-indigo-650 dark:text-indigo-400 rounded-lg clay-badge">
                      Class {paper.class}
                    </span>
                    <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[9px] font-extrabold text-slate-550 dark:text-slate-400 rounded-lg clay-badge">
                      {paper.subject}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-450 dark:text-slate-500 font-bold flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {new Date(paper.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug truncate">
                    {paper.title}
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1 truncate uppercase tracking-wider">
                    {paper.schoolName || 'St. Xavier Institution'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 text-xs font-bold border-t border-slate-100 dark:border-slate-800/40">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Total Marks</span>
                    <span className="text-slate-800 dark:text-slate-200 font-black text-sm">{paper.totalMarks} Marks</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Questions</span>
                    <span className="text-slate-800 dark:text-slate-200 font-black text-sm">{paper.questions?.length || 0} Items</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/40">
                <button
                  onClick={() => navigate(`/builder/${paper._id}`)}
                  className="flex-1 py-2 text-indigo-650 dark:text-indigo-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all clay-btn clay-btn-flat"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
                
                <button
                  onClick={() => handleDownloadPDF(paper._id)}
                  className="p-2 text-slate-450 hover:text-emerald-600 rounded-xl transition-all clay-btn clay-btn-flat"
                  title="Download PDF"
                >
                  <Download className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => handleDeletePaper(paper._id)}
                  className="p-2 text-slate-450 hover:text-rose-500 rounded-xl transition-all clay-btn clay-btn-flat"
                  title="Delete Paper"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
