const Question = require('../models/Question');
const QuestionBank = require('../models/QuestionBank');

/**
 * @desc    Get all questions in a teacher's Question Bank with filters
 * @route   GET /api/bank
 * @access  Private
 */
const getBankQuestions = async (req, res, next) => {
  const { search, subject, classLevel, chapter, type, page = 1, limit = 10 } = req.query;

  try {
    // Get all question IDs saved by this teacher
    const bankEntries = await QuestionBank.find({ user: req.user._id });
    const questionIds = bankEntries.map((entry) => entry.question);

    // If no questions in bank, return empty array immediately
    if (questionIds.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        totalPages: 0,
        currentPage: 1,
        questions: [],
      });
    }

    // Build filter query
    const query = { _id: { $in: questionIds } };

    if (subject) {
      query.subject = { $regex: `^${subject.trim()}$`, $options: 'i' };
    }
    if (classLevel) {
      query.class = { $regex: `^${classLevel.trim()}$`, $options: 'i' };
    }
    if (chapter) {
      query.chapter = { $regex: chapter.trim(), $options: 'i' };
    }
    if (type) {
      query.type = type;
    }
    if (search) {
      query.text = { $regex: search.trim(), $options: 'i' };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const totalQuestions = await Question.countDocuments(query);
    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: totalQuestions,
      totalPages: Math.ceil(totalQuestions / limitNum),
      currentPage: pageNum,
      questions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a question to the Question Bank
 * @route   POST /api/bank/save
 * @access  Private
 */
const toggleSaveQuestion = async (req, res, next) => {
  const { questionId } = req.body;

  try {
    if (!questionId) {
      res.status(400);
      return next(new Error('Question ID is required'));
    }

    const question = await Question.findById(questionId);
    if (!question) {
      res.status(404);
      return next(new Error('Question not found'));
    }

    // Check if already in bank
    const existing = await QuestionBank.findOne({
      user: req.user._id,
      question: questionId,
    });

    if (existing) {
      // If exists, remove it (Toggle off)
      await QuestionBank.deleteOne({ _id: existing._id });
      
      // Update isSavedInBank flag on Question
      await Question.findByIdAndUpdate(questionId, { isSavedInBank: false });

      return res.status(200).json({
        success: true,
        saved: false,
        message: 'Question removed from Question Bank',
      });
    } else {
      // If doesn't exist, add it (Toggle on)
      await QuestionBank.create({
        user: req.user._id,
        question: questionId,
      });

      await Question.findByIdAndUpdate(questionId, { isSavedInBank: true });

      return res.status(200).json({
        success: true,
        saved: true,
        message: 'Question saved to Question Bank successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get autocomplete filter choices (distinct subject, class, chapter) in Bank
 * @route   GET /api/bank/filters
 * @access  Private
 */
const getBankFilters = async (req, res, next) => {
  try {
    const bankEntries = await QuestionBank.find({ user: req.user._id });
    const questionIds = bankEntries.map((entry) => entry.question);

    if (questionIds.length === 0) {
      return res.status(200).json({
        success: true,
        classes: [],
        subjects: [],
        chapters: [],
      });
    }

    const questions = await Question.find({ _id: { $in: questionIds } });

    const classes = [...new Set(questions.map((q) => q.class).filter(Boolean))];
    const subjects = [...new Set(questions.map((q) => q.subject).filter(Boolean))];
    const chapters = [...new Set(questions.map((q) => q.chapter).filter(Boolean))];

    res.status(200).json({
      success: true,
      classes,
      subjects,
      chapters,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBankQuestions,
  toggleSaveQuestion,
  getBankFilters,
};
