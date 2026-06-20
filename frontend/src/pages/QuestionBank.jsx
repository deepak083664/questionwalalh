import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Database,
  Search,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [chapter, setChapter] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Autocomplete choices
  const [filterChoices, setFilterChoices] = useState({
    classes: [],
    subjects: [],
    chapters: [],
  });

  const fetchFiltersChoices = async () => {
    try {
      const res = await api.get('/api/bank/filters');
      if (res.data.success) {
        setFilterChoices({
          classes: res.data.classes,
          subjects: res.data.subjects,
          chapters: res.data.chapters,
        });
      }
    } catch (err) {
      console.error('Failed to load dynamic filters:', err.message);
    }
  };

  const fetchBankQuestions = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (subject) queryParams.append('subject', subject);
      if (classLevel) queryParams.append('classLevel', classLevel);
      if (chapter) queryParams.append('chapter', chapter);
      if (type) queryParams.append('type', type);
      queryParams.append('page', page);
      queryParams.append('limit', 6);

      const res = await api.get(`/api/bank?${queryParams.toString()}`);
      if (res.data.success) {
        setQuestions(res.data.questions);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch bank questions:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiltersChoices();
  }, []);

  // Reset page on filter update
  useEffect(() => {
    setPage(1);
  }, [search, subject, classLevel, chapter, type]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchBankQuestions();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, subject, classLevel, chapter, type, page]);

  const handleRemoveFromBank = async (qId) => {
    try {
      const res = await api.post('/api/bank/save', { questionId: qId });
      if (res.data.success) {
        setQuestions(questions.filter((q) => q._id !== qId));
        fetchFiltersChoices();
      }
    } catch (err) {
      console.error('Failed to remove question:', err.message);
    }
  };

  const handleCopyToClipboard = (text, qId) => {
    navigator.clipboard.writeText(text);
    setCopiedId(qId);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, page - 2);
      let end = Math.min(totalPages, page + 2);
      
      if (start === 1) {
        end = maxVisible;
      } else if (end === totalPages) {
        start = totalPages - maxVisible + 1;
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Question Bank
        </h1>
        <p className="text-slate-500 mt-1 font-semibold text-xs leading-relaxed">
          Search, filter, and compile assessment questions saved from historical sheets or document scans.
        </p>
      </div>

      {/* Filter panel */}
      <div className="bg-white/80 border border-slate-200/50 p-5 space-y-4 clay-card">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions by keyword..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600/10 placeholder-slate-400"
          />
        </div>

        {/* Categories Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none text-slate-700"
            >
              <option value="">All Subjects ({filterChoices.subjects.length})</option>
              {filterChoices.subjects.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Class / Grade</label>
            <select
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none text-slate-700"
            >
              <option value="">All Classes ({filterChoices.classes.length})</option>
              {filterChoices.classes.map((cls) => (
                <option key={cls} value={cls}>Class {cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Chapter</label>
            <select
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none text-slate-700"
            >
              <option value="">All Chapters ({filterChoices.chapters.length})</option>
              {filterChoices.chapters.map((ch) => (
                <option key={ch} value={ch}>{ch}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Question Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none text-slate-700"
            >
              <option value="">All Types</option>
              <option value="MCQ">MCQ (Multiple Choice)</option>
              <option value="Short">Short Answer</option>
              <option value="Long">Long Answer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-white border border-slate-150 rounded-2xl"></div>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white border border-slate-200/50 rounded-2xl p-16 text-center flex flex-col items-center">
          <Database className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-base font-bold text-slate-800">No questions found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm font-semibold">
            Reset parameters or generate new ones using AI to expand your question bank indices.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {questions.map((q) => (
            <div key={q._id} className="bg-white/70 p-5 flex flex-col justify-between clay-card">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-slate-100 text-[9px] font-bold text-slate-500 rounded">
                      Class {q.class}
                    </span>
                    <span className="px-2 py-0.5 bg-indigo-50 text-[9px] font-bold text-indigo-650 rounded">
                      {q.subject}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-[9px] font-bold text-slate-500 rounded">
                      {q.type}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">{q.marks} Mark{q.marks > 1 ? 's' : ''}</span>
                </div>

                <p className="text-xs font-semibold text-slate-800 leading-relaxed line-clamp-3">
                  {q.text}
                </p>

                {q.type === 'MCQ' && q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 pb-2">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="bg-slate-50 border border-slate-100 p-2 text-[10px] rounded-lg text-slate-500 font-semibold truncate">
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold truncate max-w-[150px]">
                  Ch: {q.chapter || 'General'}
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyToClipboard(q.text, q._id)}
                    className="p-2 text-slate-450 hover:bg-slate-100 rounded-xl clay-btn clay-btn-flat"
                    title="Copy Question Text"
                  >
                    {copiedId === q._id ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleRemoveFromBank(q._id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl clay-btn clay-btn-flat"
                    title="Remove from Bank"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200/60 bg-white/80 px-4 py-4 sm:px-6 mt-6 clay-card">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`relative inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all ${
                page === 1 ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`relative ml-3 inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all ${
                page === totalPages ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">
                Showing page <span className="font-extrabold text-slate-900">{page}</span> of{' '}
                <span className="font-extrabold text-slate-900">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-xl gap-1.5" aria-label="Pagination">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className={`relative inline-flex items-center rounded-xl p-2 text-slate-500 hover:bg-slate-50 transition-all ${
                    page === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-indigo-650'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {getPageNumbers().map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => setPage(pNum)}
                    className={`relative inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-150 ${
                      page === pNum
                        ? 'z-10 text-white clay-btn clay-btn-indigo px-3 py-1.5 shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-650 clay-btn clay-btn-flat px-3 py-1.5'
                    }`}
                  >
                    {pNum}
                  </button>
                ))}

                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`relative inline-flex items-center rounded-xl p-2 text-slate-500 hover:bg-slate-50 transition-all ${
                    page === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:text-indigo-650'
                  }`}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
