const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true, // e.g. 'Created Paper', 'Updated Paper', 'Downloaded PDF', 'OCR Uploaded'
    },
    paper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QuestionPaper',
    },
    details: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const History = mongoose.model('History', historySchema);
module.exports = History;
