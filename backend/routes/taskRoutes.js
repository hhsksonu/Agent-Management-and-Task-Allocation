const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.csv' && ext !== '.xlsx' && ext !== '.xls') {
      return cb(new Error('Only CSV and Excel files are allowed'));
    }
    cb(null, true);
  }
});

// Upload and distribute tasks - protected route
router.post('/upload', authMiddleware, upload.single('file'), taskController.uploadAndDistribute);

// Get tasks grouped by agent - protected route
router.get('/by-agent', authMiddleware, taskController.getTasksByAgent);

module.exports = router;
