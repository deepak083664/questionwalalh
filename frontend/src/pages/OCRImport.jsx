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
  ChevronUp,
  Trash2,
  Edit2,
  Plus,
  Clock,
  School,
  FileCheck,
  Check,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AILoader from '../components/AILoader';

const OCRImport = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('eng');
  const [scanMode, setScanMode] = useState('ai_enhanced'); // 'ocr_only' or 'ai_enhanced'
  const [dragActive, setDragActive] = useState(false);
  const [progressStatus, setProgressStatus] = useState(''); // 'uploading', 'ocr', 'ai', ''
  const [progressPercent, setProgressPercent] = useState(0);
  const [error, setError] = useState('');
  
  const [extractedText, setExtractedText] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [showRawText, setShowRawText] = useState(false);
  
  // Paper assembly details
  const [paperDetails, setPaperDetails] = useState({
    title: '',
    schoolName: '',
    examName: '',
    duration: 180,
    instructions: [
      'All questions are compulsory.',
      'Use of calculator is not allowed.'
    ]
  });

  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [builderLoading, setBuilderLoading] = useState(false);

  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    text: '',
    marks: 1,
    options: [],
    answer: ''
  });

  // Client side file validation
  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    const allowedImageExts = ['.jpg', '.jpeg', '.png'];
    const isPDF = ext === '.pdf';
    const isImage = allowedImageExts.includes(ext);

    if (!isPDF && !isImage) {
      setError('Only JPG, PNG, and PDF files are allowed.');
      return false;
    }

    if (isPDF) {
      const maxPdfSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxPdfSize) {
        setError('PDF file size exceeds the 10 MB limit.');
        return false;
      }
    } else if (isImage) {
      const maxImgSize = 5 * 1024 * 1024; // 5MB
      if (selectedFile.size > maxImgSize) {
        setError('Image file size exceeds the 5 MB limit.');
        return false;
      }
    }

    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        setError('');
      } else {
        setFile(null);
        e.target.value = null;
      }
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        setError('');
      } else {
        setFile(null);
      }
    }
  };

  // Submit OCR & parse questions
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a file to upload.');

    setError('');
    setProgressStatus('uploading');
    setProgressPercent(10);
    setExtractedText('');
    setGeneratedQuestions([]);
    setSelectedQuestionIds([]);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    formData.append('scanMode', scanMode);

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
          
          // Select all questions by default
          const allIds = res.data.questions.map((q) => q._id);
          setSelectedQuestionIds(allIds);

          // Populate default paper title
          setPaperDetails((prev) => ({
            ...prev,
            title: `Scanned Paper ${new Date().toLocaleDateString()}`
          }));

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

  // Checkbox selection toggle handler
  const toggleSelectQuestion = (qId) => {
    if (selectedQuestionIds.includes(qId)) {
      setSelectedQuestionIds(selectedQuestionIds.filter((id) => id !== qId));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, qId]);
    }
  };

  // Edit handlers
  const handleStartEdit = (q) => {
    setEditingId(q._id);
    setEditFormData({
      text: q.text,
      marks: q.marks,
      options: q.options ? [...q.options] : [],
      answer: q.answer || ''
    });
  };

  const handleSaveEdit = (qId) => {
    setGeneratedQuestions(prev => prev.map(q => {
      if (q._id === qId) {
        return {
          ...q,
          text: editFormData.text,
          marks: Number(editFormData.marks),
          options: q.type === 'MCQ' ? editFormData.options : undefined,
          answer: editFormData.answer
        };
      }
      return q;
    }));
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteQuestion = (qId) => {
    setGeneratedQuestions(prev => prev.filter(q => q._id !== qId));
    setSelectedQuestionIds(prev => prev.filter(id => id !== qId));
  };

  const handleOptionChange = (optIdx, val) => {
    const updatedOptions = [...editFormData.options];
    updatedOptions[optIdx] = val;
    setEditFormData({ ...editFormData, options: updatedOptions });
  };

  // Paper details updates
  const handleDetailsChange = (e) => {
    setPaperDetails({ ...paperDetails, [e.target.name]: e.target.value });
  };

  const handleInstructionChange = (index, value) => {
    const updated = [...paperDetails.instructions];
    updated[index] = value;
    setPaperDetails({ ...paperDetails, instructions: updated });
  };

  const addInstruction = () => {
    setPaperDetails({
      ...paperDetails,
      instructions: [...paperDetails.instructions, '']
    });
  };

  const removeInstruction = (index) => {
    const updated = paperDetails.instructions.filter((_, i) => i !== index);
    setPaperDetails({ ...paperDetails, instructions: updated });
  };

  // Assemble paper payload helper
  const assemblePaperPayload = () => {
    if (!paperDetails.title.trim()) {
      throw new Error('Please provide a paper title.');
    }
    
    const questionsForPaper = generatedQuestions
      .filter((q) => selectedQuestionIds.includes(q._id))
      .map((q) => ({
        text: q.text,
        options: q.options,
        answer: q.answer,
        type: q.type,
        marks: q.marks,
        difficulty: q.difficulty || 'Medium',
      }));

    if (questionsForPaper.length === 0) {
      throw new Error('You must select at least one question.');
    }

    const totalMarks = questionsForPaper.reduce((sum, q) => sum + q.marks, 0);

    return {
      ...paperDetails,
      classLevel: 'Any',
      subject: 'Scanned Document',
      totalMarks,
      questions: questionsForPaper,
    };
  };

  // Assemble & Download PDF
  const handleDownloadPDF = async () => {
    try {
      setError('');
      const payload = assemblePaperPayload();
      setDownloadLoading(true);

      // Create paper in DB first
      const res = await api.post('/api/papers', payload);
      if (res.data.success) {
        const paperId = res.data.paper._id;

        // Fetch PDF blob with auth header
        const pdfRes = await api.get(`/api/papers/${paperId}/pdf`, {
          responseType: 'blob'
        });

        // Trigger browser download
        const blob = new Blob([pdfRes.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${payload.title.replace(/\s+/g, '_')}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to download PDF.');
    } finally {
      setDownloadLoading(false);
    }
  };

  // Assemble & Open in Interactive Builder
  const handleOpenInBuilder = async () => {
    try {
      setError('');
      const payload = assemblePaperPayload();
      setBuilderLoading(true);

      const res = await api.post('/api/papers', payload);
      if (res.data.success) {
        navigate(`/builder/${res.data.paper._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to open builder.');
      setBuilderLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans clay-animate-fade">
      <div className="pb-6 border-b border-slate-200/30 dark:border-slate-800/40">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          OCR Question Scanner
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-semibold">
          Scan papers or textbooks. Extract curriculum topics as-it-is or generate similar evaluation items.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-650 dark:text-rose-450 text-xs font-semibold border border-rose-100 dark:border-rose-900/50 flex items-center gap-2">
          <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Panel */}
      {progressStatus === '' && generatedQuestions.length === 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {/* Drag Drop Box */}
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed p-10 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[200px] clay-card ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 scale-[1.02] shadow-[0_0_25px_rgba(99,102,241,0.2)]'
                  : 'border-slate-300 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-indigo-500/50 dark:hover:border-indigo-400/50'
              }`}
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl text-slate-400 flex items-center justify-center mb-3 shadow-sm clay-badge">
                  <UploadCloud className="h-6 w-6 text-indigo-600 dark:text-indigo-400 animate-bounce" />
                </div>
                <h3 className="font-extrabold text-slate-800 dark:text-white text-xs">
                  {file ? file.name : 'Select or drag book pages/worksheets'}
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold">
                  {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'Supports Image (Max 5MB), PDF (Max 10MB)'}
                </p>
              </label>
            </div>

            {/* Scan Mode Selection Cards */}
            <div className="space-y-2">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-400 ml-1">
                OCR Scan Mode
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setScanMode('ocr_only')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    scanMode === 'ocr_only'
                      ? 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-400/50 dark:border-indigo-900/45 shadow-sm ring-1 ring-indigo-400 dark:ring-indigo-900'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-350 dark:hover:border-slate-700 shadow-sm'
                  } clay-card`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center border shadow-sm clay-badge ${
                      scanMode === 'ocr_only' ? 'text-indigo-650 bg-indigo-50 dark:bg-indigo-900/50 border-indigo-150 dark:border-indigo-850' : 'text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}>
                      <ScanLine className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-850 dark:text-white">Scan As-It-Is</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5 leading-relaxed">
                        Extract original questions exactly as written in the sheet.
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setScanMode('ai_enhanced')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    scanMode === 'ai_enhanced'
                      ? 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-400/50 dark:border-indigo-900/45 shadow-sm ring-1 ring-indigo-400 dark:ring-indigo-900'
                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-350 dark:hover:border-slate-700 shadow-sm'
                  } clay-card`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center border shadow-sm clay-badge ${
                      scanMode === 'ai_enhanced' ? 'text-indigo-650 bg-indigo-50 dark:bg-indigo-900/50 border-indigo-150 dark:border-indigo-850' : 'text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}>
                      <Sparkles className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-850 dark:text-white">AI-Enhanced Scan</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5 leading-relaxed">
                        Extract questions AND generate extra similar questions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Language & Actions */}
            <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-sm clay-card">
              <div className="flex-1">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-1.5 ml-1">
                  OCR Scanner Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full sm:max-w-xs px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none"
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
                Scan & Parse Sheet
              </button>
            </div>
          </form>

          {/* Guidelines info card */}
          <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 p-6 space-y-4 shadow-sm self-start clay-card">
            <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-xs uppercase tracking-wider">
              OCR Best Practices
            </h3>
            <ul className="space-y-3.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 list-disc list-inside leading-relaxed">
              <li>Use high-resolution photos with uniform lighting.</li>
              <li>Flatten skewed or curved printed sheets.</li>
              <li>Handwritten papers must be clear and legible.</li>
              <li>Text-based PDFs scan instantly with 100% precision.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Progress display */}
      {progressStatus !== '' && (
        <div className="py-8">
          <AILoader mode="ocr" title="Document AI is scanning worksheets..." />
        </div>
      )}

      {/* Output Grid */}
      {progressStatus === '' && generatedQuestions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Questions pool */}
          <div className="lg:col-span-2 space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800/40 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400 animate-pulse" />
                  {scanMode === 'ocr_only' ? 'Extracted Scanned Questions' : 'Scanned & AI Generated Questions'}
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                  {selectedQuestionIds.length} / {generatedQuestions.length} Questions Selected
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {generatedQuestions.map((q, idx) => {
                const active = selectedQuestionIds.includes(q._id);
                const isEditing = editingId === q._id;
                return (
                  <div
                    key={q._id}
                    onClick={() => {
                      if (!isEditing) {
                        toggleSelectQuestion(q._id);
                      }
                    }}
                    className={`p-5 rounded-2xl border flex gap-4 transition-all duration-200 ${
                      isEditing
                        ? 'bg-slate-50 dark:bg-slate-950 border-indigo-500 shadow-lg cursor-default'
                        : active
                        ? 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-400/50 dark:border-indigo-900/40 shadow-sm cursor-pointer'
                        : 'bg-white/60 dark:bg-slate-900/60 border-slate-200/50 dark:border-slate-800/50 hover:border-slate-350 dark:hover:border-slate-700 shadow-sm cursor-pointer'
                    } clay-card`}
                  >
                    {!isEditing && (
                      <div className={`mt-0.5 h-4.5 w-4.5 rounded-lg border flex items-center justify-center flex-shrink-0 transition-all ${
                        active ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                      }`} style={{ boxShadow: active ? 'inset 1px 1px 2px rgba(255,255,255,0.45)' : 'inset 1px 1px 2px rgba(0,0,0,0.05)' }}>
                        {active && <Check className="h-3.5 w-3.5" />}
                      </div>
                    )}

                    {isEditing ? (
                      <div className="flex-1 space-y-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          <span>Editing Scanned Item {idx + 1} • {q.type}</span>
                          <div className="flex items-center gap-2">
                            <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Marks:</label>
                            <input
                              type="number"
                              value={editFormData.marks}
                              onChange={(e) => setEditFormData({ ...editFormData, marks: Number(e.target.value) })}
                              className="w-16 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold outline-none focus:border-indigo-600"
                              min="1"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">Question Text</label>
                          <textarea
                            value={editFormData.text}
                            onChange={(e) => setEditFormData({ ...editFormData, text: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none focus:border-indigo-650 min-h-[60px]"
                            placeholder="Enter question text..."
                          />
                        </div>

                        {q.type === 'MCQ' && editFormData.options && (
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">Options</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {editFormData.options.map((opt, oIdx) => (
                                <div key={oIdx} className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{String.fromCharCode(65 + oIdx)}.</span>
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => handleOptionChange(oIdx, e.target.value)}
                                    className="flex-1 px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none focus:border-indigo-650"
                                    placeholder={`Option ${oIdx + 1}`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-455 dark:text-slate-400">Answer / Marking Scheme</label>
                          <textarea
                            value={editFormData.answer}
                            onChange={(e) => setEditFormData({ ...editFormData, answer: e.target.value })}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none focus:border-indigo-650 min-h-[50px]"
                            placeholder="Enter answer..."
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="px-3 py-1.5 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-[10px] clay-btn clay-btn-flat"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(q._id)}
                            className="px-3 py-1.5 text-white font-bold rounded-xl text-[10px] clay-btn clay-btn-indigo"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between text-[9px] font-bold text-slate-450 dark:text-slate-550 uppercase tracking-wider">
                          <span>Question {idx + 1} • {q.type}</span>
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <span className="bg-white/85 dark:bg-slate-800 border border-slate-250 dark:border-slate-700 px-2.5 py-0.5 rounded-lg text-slate-650 dark:text-slate-350 font-bold clay-badge">{q.marks} Marks</span>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(q)}
                              className="p-1 text-slate-450 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                              title="Edit Question"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuestion(q._id)}
                              className="p-1 text-slate-450 hover:text-red-500 transition-colors"
                              title="Delete Question"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">{q.text}</p>
                        
                        {q.type === 'MCQ' && q.options && q.options.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx} className="bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/40 p-2 text-[10px] rounded-lg text-slate-500 dark:text-slate-400 font-semibold truncate shadow-inner">
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}

                        {q.answer && (
                          <div className="bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-900/40 text-indigo-750 dark:text-indigo-300 p-3 rounded-2xl text-[10px] font-semibold leading-relaxed mt-3 shadow-inner">
                            <span className="font-extrabold uppercase tracking-wider block text-indigo-500 dark:text-indigo-400 text-[8px] mb-1">Answer / Scheme:</span>
                            {q.answer}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                setFile(null);
                setGeneratedQuestions([]);
              }}
              className="px-5 py-2.5 text-slate-750 dark:text-slate-350 font-bold rounded-xl text-[10px] clay-btn clay-btn-flat"
            >
              Scan new worksheet
            </button>
          </div>

          {/* Right layout metadata */}
          <div className="space-y-6">
            <div className="premium-card p-6 space-y-5 bg-white/60 dark:bg-slate-900/60 sticky top-20 gpu-accelerated">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2 pb-3.5 border-b border-slate-100 dark:border-slate-800/40">
                <School className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400" />
                Exam Details
              </h3>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-1.5 ml-1">Exam Sheet Title</label>
                <input
                  type="text"
                  name="title"
                  value={paperDetails.title}
                  onChange={handleDetailsChange}
                  placeholder="e.g. Scanned Test 1"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-1.5 ml-1">School Name</label>
                <input
                  type="text"
                  name="schoolName"
                  value={paperDetails.schoolName}
                  onChange={handleDetailsChange}
                  placeholder="e.g. Cambridge High"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-1.5 ml-1">Exam Name Header</label>
                <input
                  type="text"
                  name="examName"
                  value={paperDetails.examName}
                  onChange={handleDetailsChange}
                  placeholder="e.g. Midterm Science"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 mb-1.5 ml-1">Duration (Mins)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="number"
                    name="duration"
                    value={paperDetails.duration}
                    onChange={handleDetailsChange}
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Instructions list */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500 flex justify-between items-center ml-1">
                  Instructions
                  <button
                    onClick={addInstruction}
                    className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 p-1 flex items-center gap-0.5 text-[9px] font-bold"
                  >
                    <Plus className="h-3 w-3" /> Add
                  </button>
                </label>
                
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {paperDetails.instructions.map((inst, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={inst}
                        onChange={(e) => handleInstructionChange(index, e.target.value)}
                        placeholder={`Instruction ${index + 1}`}
                        className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-semibold outline-none focus:border-indigo-600"
                      />
                      <button
                        onClick={() => removeInstruction(index)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/40 flex flex-col gap-3.5">
                <button
                  onClick={handleDownloadPDF}
                  disabled={downloadLoading || builderLoading}
                  className="w-full py-3.5 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 clay-btn clay-btn-indigo"
                >
                  {downloadLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <Download className="h-4.5 w-4.5" />
                      Download PDF
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleOpenInBuilder}
                  disabled={downloadLoading || builderLoading}
                  className="w-full py-2.5 text-slate-705 dark:text-slate-350 font-bold rounded-xl text-[10px] clay-btn clay-btn-flat"
                >
                  {builderLoading ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-700 border-t-transparent"></div>
                  ) : (
                    'Open in Editor Workspace'
                  )}
                </button>
              </div>

              {/* Extracted Raw Text Accordion */}
              <div className="border-t border-slate-100 dark:border-slate-800/40 pt-4">
                <button
                  onClick={() => setShowRawText(!showRawText)}
                  className="w-full flex items-center justify-between text-xs font-bold text-slate-800 dark:text-white pb-2"
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400" />
                    Extracted Raw Text
                  </span>
                  {showRawText ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {showRawText && (
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl text-[10px] font-semibold font-mono text-slate-500 dark:text-slate-400 whitespace-pre-wrap max-h-[180px] overflow-y-auto leading-relaxed border border-slate-200 dark:border-slate-800 shadow-inner mt-2 clay-input">
                    {extractedText}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OCRImport;
