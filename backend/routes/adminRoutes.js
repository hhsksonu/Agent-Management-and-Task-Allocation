const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Login route
router.post('/login', adminController.login);

// Create admin route (for initial setup)
router.post('/create', adminController.createAdmin);

module.exports = router;
