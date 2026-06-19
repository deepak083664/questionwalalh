const express = require('express');
const { uploadAndOCR, getUploadHistory } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/ocr', protect, upload.single('file'), uploadAndOCR);
router.get('/', protect, getUploadHistory);

module.exports = router;
