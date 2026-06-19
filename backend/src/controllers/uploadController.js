const { extractTextFromFile } = require('../services/ocrService');
const { generateSimilarQuestions } = require('../services/geminiService');
const Upload = require('../models/Upload');
const Question = require('../models/Question');
const History = require('../models/History');
const fs = require('fs');

/**
 * @desc    Upload document, perform OCR, and generate similar questions via Gemini AI
 * @route   POST /api/uploads/ocr
 * @access  Private
 */
const uploadAndOCR = async (req, res, next) => {
  if (!req.file) {
    res.status(400);
    return next(new Error('Please upload an image (JPG/PNG) or a PDF file'));
  }

  const { language = 'eng' } = req.body;
  const filePath = req.file.path;
  const mimeType = req.file.mimetype;

  // Create pending upload record
  const uploadRecord = await Upload.create({
    user: req.user._id,
    originalName: req.file.originalname,
    fileName: req.file.filename,
    filePath: filePath,
    fileType: mimeType,
    status: 'processing',
  });

  try {
    console.log(`Starting OCR processing for upload ID: ${uploadRecord._id}...`);
    
    // 1. Run OCR / Text extraction
    const extractedText = await extractTextFromFile(filePath, mimeType, language);
    
    // Update text in upload record
    uploadRecord.extractedText = extractedText;
    await uploadRecord.save();

    console.log(`OCR complete. Triggering Gemini analysis to generate similar questions...`);

    // 2. Generate similar questions
    const aiLanguage = language.includes('hin') ? 'Hindi' : 'English';
    const similarQuestions = await generateSimilarQuestions(extractedText, aiLanguage);

    // 3. Save questions to general Questions pool
    const questionsToSave = similarQuestions.map((q) => ({
      text: q.text,
      options: q.options || [],
      answer: q.answer || 'Answer not specified',
      type: q.type || 'Short',
      marks: q.marks || (q.type === 'MCQ' ? 1 : q.type === 'Short' ? 2 : 5),
      difficulty: q.difficulty || 'Medium',
      language: aiLanguage,
      subject: 'Scanned Document', // placeholder tag for OCR source
      class: 'Any',
      chapter: 'Scanned Source',
      createdBy: req.user._id,
    }));

    const savedQuestions = await Question.insertMany(questionsToSave);

    // Update upload status
    uploadRecord.status = 'completed';
    await uploadRecord.save();

    // Log History
    await History.create({
      user: req.user._id,
      action: 'Processed OCR Upload',
      details: `Scanned file "${req.file.originalname}" and generated ${savedQuestions.length} similar questions.`,
    });

    // Delete temp file after complete to save storage (optional but highly recommended for SaaS)
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting temp uploaded file:', err.message);
      else console.log('Temporary upload file deleted successfully.');
    });

    res.status(200).json({
      success: true,
      uploadId: uploadRecord._id,
      extractedText,
      questions: savedQuestions,
    });
  } catch (error) {
    console.error('OCR Controller process failure:', error.message);
    
    // Update record status to failed
    uploadRecord.status = 'failed';
    uploadRecord.error = error.message;
    await uploadRecord.save();

    // Cleanup uploaded file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file on failure:', err.message);
      });
    }

    res.status(500);
    next(error);
  }
};

/**
 * @desc    Get OCR Upload History for teacher
 * @route   GET /api/uploads
 * @access  Private
 */
const getUploadHistory = async (req, res, next) => {
  try {
    const uploads = await Upload.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: uploads.length,
      uploads,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadAndOCR,
  getUploadHistory,
};
