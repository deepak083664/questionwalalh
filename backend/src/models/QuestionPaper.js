const mongoose = require('mongoose');

const paperQuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    default: [],
  },
  answer: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['MCQ', 'Short', 'Long'],
    required: true,
  },
  marks: {
    type: Number,
    required: true,
    min: 1,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
  },
});

const questionPaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a question paper title'],
      trim: true,
    },
    schoolName: {
      type: String,
      trim: true,
      default: '',
    },
    examName: {
      type: String,
      trim: true,
      default: '',
    },
    class: {
      type: String,
      required: [true, 'Please add a class'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Please add a subject'],
      trim: true,
    },
    instructions: {
      type: [String],
      default: [],
    },
    totalMarks: {
      type: Number,
      required: true,
      default: 100,
    },
    duration: {
      type: Number, // in minutes
      default: 180,
    },
    questions: [paperQuestionSchema],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const QuestionPaper = mongoose.model('QuestionPaper', questionPaperSchema);
module.exports = QuestionPaper;
