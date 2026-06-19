const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Please add question text'],
      trim: true,
    },
    options: {
      type: [String],
      default: [], // Used for MCQs
    },
    answer: {
      type: String,
      required: [true, 'Please add the answer/solution'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['MCQ', 'Short', 'Long'],
      required: [true, 'Please specify question type'],
    },
    marks: {
      type: Number,
      default: 1,
      min: [1, 'Marks cannot be less than 1'],
    },
    subject: {
      type: String,
      required: [true, 'Please add a subject'],
      trim: true,
    },
    class: {
      type: String,
      required: [true, 'Please add a class'],
      trim: true,
    },
    chapter: {
      type: String,
      trim: true,
    },
    topic: {
      type: String,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    language: {
      type: String,
      enum: ['English', 'Hindi'],
      default: 'English',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isSavedInBank: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Optimize search and filtering operations
questionSchema.index({ createdBy: 1, subject: 1, class: 1 });
questionSchema.index({ isSavedInBank: 1 });

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;

