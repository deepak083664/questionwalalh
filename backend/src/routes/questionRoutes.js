const express = require('express');
const { generateAIQuestions, createQuestion } = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/generate', protect, generateAIQuestions);
router.post('/', protect, createQuestion);

module.exports = router;
