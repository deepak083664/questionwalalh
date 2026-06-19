const { generateQuestions } = require('../services/geminiService');
const Question = require('../models/Question');
const History = require('../models/History');

/**
 * @desc    Generate questions using Gemini AI
 * @route   POST /api/questions/generate
 * @access  Private
 */
const generateAIQuestions = async (req, res, next) => {
  const {
    classLevel,
    subject,
    chapter,
    topic,
    count,
    difficulty,
    language,
    type,
  } = req.body;

  try {
    if (!classLevel || !subject || !count || !difficulty || !language || !type) {
      res.status(400);
      return next(new Error('Please fill all required generation parameters (classLevel, subject, count, difficulty, language, type)'));
    }

    const questionCount = parseInt(count, 10);
    if (isNaN(questionCount) || questionCount < 1 || questionCount > 30) {
      res.status(400);
      return next(new Error('Question count must be a number between 1 and 30'));
    }

    console.log(`Triggering Gemini question generation for User: ${req.user._id}...`);
    
    // Generate questions from service
    const generated = await generateQuestions({
      classLevel,
      subject,
      chapter,
      topic,
      count: questionCount,
      difficulty,
      language,
      type,
    });

    // Save questions to database (Questions Collection)
    const questionsToSave = generated.map((q) => ({
      text: q.text,
      options: q.options || [],
      answer: q.answer || 'Answer guidelines not specified',
      type: q.type || (type === 'Mixed' ? 'Short' : type),
      marks: q.marks || (q.type === 'MCQ' ? 1 : q.type === 'Short' ? 2 : 5),
      difficulty: q.difficulty || difficulty,
      language: language,
      subject: subject,
      class: classLevel,
      chapter: chapter || 'General',
      topic: topic || 'General',
      createdBy: req.user._id,
      isSavedInBank: false,
    }));

    const savedQuestions = await Question.insertMany(questionsToSave);

    // Log in History
    await History.create({
      user: req.user._id,
      action: 'Generated AI Questions',
      details: `${questionCount} ${type} questions for ${subject} (Class ${classLevel}) - ${language}`,
    });

    res.status(200).json({
      success: true,
      count: savedQuestions.length,
      questions: savedQuestions,
    });
  } catch (error) {
    console.error('Question generation controller error:', error.message);
    next(error);
  }
};

/**
 * @desc    Create a manual question
 * @route   POST /api/questions
 * @access  Private
 */
const createQuestion = async (req, res, next) => {
  const { text, options, answer, type, marks, subject, classLevel, chapter, topic, difficulty, language } = req.body;

  try {
    if (!text || !answer || !type || !marks || !subject || !classLevel || !difficulty) {
      res.status(400);
      return next(new Error('Please fill in all required question fields'));
    }

    const question = await Question.create({
      text,
      options: options || [],
      answer,
      type,
      marks,
      subject,
      class: classLevel,
      chapter: chapter || 'General',
      topic: topic || 'General',
      difficulty,
      language: language || 'English',
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      question,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateAIQuestions,
  createQuestion,
};
