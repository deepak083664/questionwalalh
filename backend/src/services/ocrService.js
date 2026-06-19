const Tesseract = require('tesseract.js');
const pdfParse = require('pdf-parse');
const fs = require('fs');

/**
 * Service to extract text from images and PDF files
 * @param {string} filePath - Absolute path to the file on disk
 * @param {string} mimeType - The file's MIME type
 * @param {string} [language='eng'] - OCR language, e.g., 'eng', 'hin' or 'eng+hin'
 * @returns {Promise<string>} - Extracted text content
 */
const extractTextFromFile = async (filePath, mimeType, language = 'eng') => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at: ${filePath}`);
    }

    if (mimeType === 'application/pdf') {
      console.log('Extracting text from PDF via pdf-parse...');
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      
      if (!data.text || data.text.trim().length === 0) {
        throw new Error('PDF appears to be empty or contains scanned images. Please upload images directly for OCR processing.');
      }
      return data.text;
    } 
    
    if (mimeType.startsWith('image/')) {
      console.log(`Running OCR on image via Tesseract.js with language "${language}"...`);
      const result = await Tesseract.recognize(filePath, language, {
        logger: (info) => console.log(`OCR Progress: ${info.status} - ${(info.progress * 100).toFixed(1)}%`),
      });
      
      if (!result.data || !result.data.text || result.data.text.trim().length === 0) {
        throw new Error('OCR failed to identify any readable text in the image.');
      }
      
      return result.data.text;
    }

    throw new Error('Unsupported file type for OCR processing.');
  } catch (error) {
    console.error('Error in OCR Service:', error.message);
    throw error;
  }
};

module.exports = {
  extractTextFromFile,
};
