const mongoose = require('mongoose');

const questionBankSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index to prevent saving the same question twice for a user
questionBankSchema.index({ user: 1, question: 1 }, { unique: true });

const QuestionBank = mongoose.model('QuestionBank', questionBankSchema);
module.exports = QuestionBank;
