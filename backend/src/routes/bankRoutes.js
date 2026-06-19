const express = require('express');
const { getBankQuestions, toggleSaveQuestion, getBankFilters } = require('../controllers/bankController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getBankQuestions);
router.post('/save', protect, toggleSaveQuestion);
router.get('/filters', protect, getBankFilters);

module.exports = router;
