const QuestionPaper = require('../models/QuestionPaper');
const QuestionBank = require('../models/QuestionBank');
const Question = require('../models/Question');
const History = require('../models/History');
const { generatePaperPDF } = require('../services/pdfService');

/**
 * @desc    Get dashboard metrics and analytics
 * @route   GET /api/papers/dashboard/stats
 * @access  Private
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Run queries in parallel
    const [totalPapers, savedQuestionsCount, recentPapers, totalQuestionsCount] = await Promise.all([
      QuestionPaper.countDocuments({ creator: userId }),
      QuestionBank.countDocuments({ user: userId }),
      QuestionPaper.find({ creator: userId }).sort({ updatedAt: -1 }).limit(5),
      Question.countDocuments({ createdBy: userId }),
    ]);

    // Format recent papers list
    const formattedRecent = recentPapers.map(paper => ({
      _id: paper._id,
      title: paper.title,
      subject: paper.subject,
      classLevel: paper.class,
      totalMarks: paper.totalMarks,
      updatedAt: paper.updatedAt,
      questionCount: paper.questions.length,
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalPapers,
        savedQuestionsCount,
        totalQuestionsCount,
      },
      recentPapers: formattedRecent,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new question paper
 * @route   POST /api/papers
 * @access  Private
 */
const createPaper = async (req, res, next) => {
  const {
    title,
    schoolName,
    examName,
    classLevel,
    subject,
    instructions,
    totalMarks,
    duration,
    questions,
  } = req.body;

  try {
    if (!title || !classLevel || !subject || !questions || !Array.isArray(questions)) {
      res.status(400);
      return next(new Error('Please provide paper title, class, subject, and a valid list of questions'));
    }

    const paper = await QuestionPaper.create({
      title,
      schoolName: schoolName || '',
      examName: examName || '',
      class: classLevel,
      subject,
      instructions: instructions || [],
      totalMarks: totalMarks || 100,
      duration: duration || 180,
      questions,
      creator: req.user._id,
    });

    // Log History
    await History.create({
      user: req.user._id,
      action: 'Created Paper',
      paper: paper._id,
      details: `Created question paper: "${title}" (${subject})`,
    });

    res.status(201).json({
      success: true,
      paper,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all question papers for a teacher
 * @route   GET /api/papers
 * @access  Private
 */
const getPapers = async (req, res, next) => {
  try {
    const papers = await QuestionPaper.find({ creator: req.user._id }).sort({ updatedAt: -1 });
    res.status(200).json({
      success: true,
      count: papers.length,
      papers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get detailed question paper by ID
 * @route   GET /api/papers/:id
 * @access  Private
 */
const getPaperById = async (req, res, next) => {
  try {
    const paper = await QuestionPaper.findOne({ _id: req.params.id, creator: req.user._id });
    
    if (!paper) {
      res.status(404);
      return next(new Error('Question paper not found or access denied'));
    }

    res.status(200).json({
      success: true,
      paper,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update question paper (edit header details, rearrange questions, delete/add questions, edit marks)
 * @route   PUT /api/papers/:id
 * @access  Private
 */
const updatePaper = async (req, res, next) => {
  const {
    title,
    schoolName,
    examName,
    classLevel,
    subject,
    instructions,
    totalMarks,
    duration,
    questions,
  } = req.body;

  try {
    const paper = await QuestionPaper.findOne({ _id: req.params.id, creator: req.user._id });

    if (!paper) {
      res.status(404);
      return next(new Error('Question paper not found or access denied'));
    }

    // Update fields
    if (title) paper.title = title;
    if (schoolName !== undefined) paper.schoolName = schoolName;
    if (examName !== undefined) paper.examName = examName;
    if (classLevel) paper.class = classLevel;
    if (subject) paper.subject = subject;
    if (instructions) paper.instructions = instructions;
    if (totalMarks !== undefined) paper.totalMarks = totalMarks;
    if (duration !== undefined) paper.duration = duration;
    if (questions && Array.isArray(questions)) paper.questions = questions;

    const updatedPaper = await paper.save();

    // Log History
    await History.create({
      user: req.user._id,
      action: 'Updated Paper',
      paper: paper._id,
      details: `Modified questions/details of paper: "${paper.title}"`,
    });

    res.status(200).json({
      success: true,
      paper: updatedPaper,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete question paper
 * @route   DELETE /api/papers/:id
 * @access  Private
 */
const deletePaper = async (req, res, next) => {
  try {
    const paper = await QuestionPaper.findOne({ _id: req.params.id, creator: req.user._id });

    if (!paper) {
      res.status(404);
      return next(new Error('Question paper not found or access denied'));
    }

    const paperTitle = paper.title;
    await QuestionPaper.deleteOne({ _id: req.params.id });

    // Log History
    await History.create({
      user: req.user._id,
      action: 'Deleted Paper',
      details: `Deleted paper "${paperTitle}"`,
    });

    res.status(200).json({
      success: true,
      message: 'Question paper deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Export Question Paper as a Professional PDF
 * @route   GET /api/papers/:id/pdf
 * @access  Private
 */
const exportPaperPDF = async (req, res, next) => {
  try {
    const paper = await QuestionPaper.findOne({ _id: req.params.id, creator: req.user._id });

    if (!paper) {
      res.status(404);
      return next(new Error('Question paper not found or access denied'));
    }

    console.log(`Generating PDF for Paper: ${paper.title}...`);
    const pdfBuffer = await generatePaperPDF(paper);

    // Save Download History
    await History.create({
      user: req.user._id,
      action: 'Downloaded PDF',
      paper: paper._id,
      details: `Exported and downloaded PDF for "${paper.title}"`,
    });

    // Send PDF as downloadable attachment
    const cleanTitle = paper.title.replace(/[^a-zA-Z0-9]/g, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${cleanTitle}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer);
  } catch (error) {
    console.error('Error generating paper PDF:', error.message);
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  createPaper,
  getPapers,
  getPaperById,
  updatePaper,
  deletePaper,
  exportPaperPDF,
};
