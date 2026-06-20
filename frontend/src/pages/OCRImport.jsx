import React, { useState } from 'react';
import api from '../services/api';
import {
  UploadCloud,
  FileText,
  ScanLine,
  BrainCircuit,
  Save,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const OCRImport = () => {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('eng');
  const [progressStatus, setProgressStatus] = useState(''); // 'uploading', 'ocr', 'ai', ''
  const [progressPercent, setProgressPercent] = useState(0);
  const [error, setError] = useState('');
  
  const [extractedText, setExtractedText] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [showRawText, setShowRawText] = useState(false);
  const [savedQuestionIds, setSavedQuestionIds] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const allowed = ['.jpg', '.jpeg', '.png', '.pdf'];
      const ext = droppedFile.name.substring(droppedFile.name.lastIndexOf('.')).toLowerCase();
      if (allowed.includes(ext)) {
        setFile(droppedFile);
        setError('');
      } else {
        setError('Only JPG, PNG, and PDF files are allowed.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a file to upload.');

    setError('');
    setProgressStatus('uploading');
    setProgressPercent(10);
    setExtractedText('');
    setGeneratedQuestions([]);
    setSavedQuestionIds([]);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);

    try {
      setProgressPercent(30);
      setProgressStatus('ocr');

      const res = await api.post('/api/uploads/ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setProgressPercent(75);
        setProgressStatus('ai');
        setTimeout(() => {
          setExtractedText(res.data.extractedText);
          setGeneratedQuestions(res.data.questions);
          setProgressPercent(100);
          setProgressStatus('');
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'OCR processing failed. Check file resolution or script languages.');
      setProgressStatus('');
      setProgressPercent(0);
    }
  };

  const handleSaveToBank = async (qId) => {
    try {
      const res = await api.post('/api/bank/save', { questionId: qId });
      if (res.data.success) {
        if (res.data.saved) {
          setSavedQuestionIds([...savedQuestionIds, qId]);
        } else {
          setSavedQuestionIds(savedQuestionIds.filter(id => id !== qId));
        }
      }
    } catch (err) {
      console.error('Toggle save question error:', err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          OCR Question Scanner
        </h1>
        <p className="text-slate-500 mt-1 font-semibold text-xs leading-relaxed">
          Scan papers or textbooks. Extract curriculum topics and generate similar evaluation items.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 text-red-650 text-xs font-semibold border border-red-100 flex items-center gap-2">
          <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Panel */}
      {progressStatus === '' && generatedQuestions.length === 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
            {/* Drag Drop Box */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-350 bg-white/70 p-10 text-center flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-all duration-300 min-h-[260px] clay-card"
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <div className="h-12 w-12 bg-indigo-50 border border-indigo-100 rounded-2xl text-slate-400 flex items-center justify-center mb-3 shadow-sm clay-badge">
                  <UploadCloud className="h-6 w-6 text-indigo-600 animate-bounce" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-xs">
                  {file ? file.name : 'Select or drag book pages/worksheets'}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                  {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Supports JPG, PNG, PDF files (Max 10MB)'}
                </p>
              </label>
            </div>

            {/* Language & Actions */}
            <div className="bg-white/80 border border-slate-200/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-sm clay-card">
              <div className="flex-1">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5 ml-1">
                  OCR Scanner Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full sm:max-w-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                >
                  <option value="eng">English Only</option>
                  <option value="hin">Hindi Only (Devanagari)</option>
                  <option value="eng+hin">English + Hindi (Mixed)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!file}
                className="px-6 py-3.5 text-white font-bold rounded-xl text-xs shadow-sm disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5 self-end clay-btn clay-btn-indigo"
              >
                <ScanLine className="h-4.5 w-4.5" />
                Scan Document
              </button>
            </div>
          </form>

          {/* Guidelines info card */}
          <div className="bg-white/80 border border-slate-200/50 p-6 space-y-4 shadow-sm self-start clay-card">
            <h3 className="font-extrabold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider">
              OCR Best Practices
            </h3>
            <ul className="space-y-3.5 text-[11px] font-semibold text-slate-500 list-disc list-inside leading-relaxed">
              <li>Use high-resolution photos with uniform lighting.</li>
              <li>Flatten skewed or curved printed sheets.</li>
              <li>Text-based PDFs scan instantly with 100% precision.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Progress display */}
      {progressStatus !== '' && (
        <div className="premium-card p-12 text-center max-w-lg mx-auto flex flex-col items-center justify-center min-h-[300px]">
          <div className="h-12 w-12 relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-indigo-650/20 border-t-transparent animate-spin"></div>
            <ScanLine className="h-6 w-6 text-indigo-650 animate-pulse" />
          </div>

          <h3 className="text-sm font-extrabold text-slate-800">
            {progressStatus === 'uploading' && 'Uploading worksheet...'}
            {progressStatus === 'ocr' && 'Extracting scanned text...'}
            {progressStatus === 'ai' && 'Gemini is drafting similar questions...'}
          </h3>

          <div className="w-full bg-slate-100 h-2 rounded-full mt-6 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span className="text-[10px] font-bold text-indigo-600 mt-2">{progressPercent}%</span>
        </div>
      )}

      {/* Output Grid */}
      {progressStatus === '' && generatedQuestions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Left Questions pool */}
          <div className="lg:col-span-2 space-y-4">
            <div className="pb-3 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-indigo-600" />
                  Gemini Generated Questions
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Matching topics scanned</p>
              </div>
            </div>

            <div className="space-y-4">
              {generatedQuestions.map((q, idx) => {
                const isSaved = savedQuestionIds.includes(q._id);
                return (
                  <div key={q._id} className="bg-white/70 p-5 flex gap-4 clay-card">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>Scanned Similar {idx + 1} • {q.type}</span>
                        <span className="bg-white/85 border border-slate-250 px-2.5 py-0.5 rounded-lg text-slate-650 font-bold clay-badge">{q.marks} Marks</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 leading-relaxed">{q.text}</p>
                      
                      {q.type === 'MCQ' && q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="bg-slate-100/50 border border-slate-200/50 p-2 text-[10px] rounded-lg text-slate-500 font-semibold shadow-inner">
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="bg-white/80 border border-slate-150 p-3 rounded-2xl text-[10px] text-slate-655 mt-3 font-semibold leading-relaxed shadow-inner">
                        <span className="font-bold text-[8px] uppercase tracking-wider block text-slate-400 mb-1">Answer / Scheme:</span>
                        {q.answer}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSaveToBank(q._id)}
                      className={`h-9 w-9 flex items-center justify-center rounded-xl flex-shrink-0 border transition-all clay-btn ${
                        isSaved
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm'
                          : 'clay-btn-flat text-slate-500'
                      }`}
                      title={isSaved ? 'Saved to Question Bank' : 'Save to Question Bank'}
                    >
                      {isSaved ? <CheckCircle className="h-4.5 w-4.5" /> : <Save className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                setFile(null);
                setGeneratedQuestions([]);
              }}
              className="px-5 py-2.5 text-slate-700 font-bold rounded-xl text-[10px] clay-btn clay-btn-flat"
            >
              Scan new worksheet
            </button>
          </div>

          {/* Right Raw text details logs */}
          <div>
            <div className="premium-card p-5 space-y-4">
              <button
                onClick={() => setShowRawText(!showRawText)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-800 pb-2 border-b border-slate-100"
              >
                <span className="flex items-center gap-1.5">
                  <FileText className="h-4.5 w-4.5 text-indigo-650" />
                  Extracted Raw Text
                </span>
                {showRawText ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              {(!showRawText) ? (
                <p className="text-[10px] text-slate-400 font-semibold line-clamp-3 leading-relaxed">
                  {extractedText}
                </p>
              ) : (
                <div className="bg-slate-50 p-4 rounded-2xl text-[10px] font-semibold font-mono text-slate-500 whitespace-pre-wrap max-h-[250px] overflow-y-auto leading-relaxed border border-slate-200 shadow-inner clay-input">
                  {extractedText}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OCRImport;
