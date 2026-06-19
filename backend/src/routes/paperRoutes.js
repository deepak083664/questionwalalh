const express = require('express');
const {
  getDashboardStats,
  createPaper,
  getPapers,
  getPaperById,
  updatePaper,
  deletePaper,
  exportPaperPDF,
} = require('../controllers/paperController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard/stats', protect, getDashboardStats);
router.post('/', protect, createPaper);
router.get('/', protect, getPapers);
router.get('/:id', protect, getPaperById);
router.put('/:id', protect, updatePaper);
router.delete('/:id', protect, deletePaper);
router.get('/:id/pdf', protect, exportPaperPDF);

module.exports = router;
