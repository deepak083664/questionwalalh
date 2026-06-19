const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true, // e.g. 'image/png', 'application/pdf'
    },
    extractedText: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    error: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Upload = mongoose.model('Upload', uploadSchema);
module.exports = Upload;
