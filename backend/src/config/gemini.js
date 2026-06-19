const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

let genAI = null;

if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
  genAI = new GoogleGenerativeAI(apiKey);
  console.log('Gemini AI client successfully initialized.');
} else {
  console.warn('WARNING: Gemini API Key is missing or using placeholder. AI features will fail until a valid key is set in .env.');
}

module.exports = genAI;
