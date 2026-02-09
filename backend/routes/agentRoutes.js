const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const authMiddleware = require('../middleware/auth');

// Add agent - protected route
router.post('/add', authMiddleware, agentController.addAgent);

// Get all agents - protected route
router.get('/all', authMiddleware, agentController.getAllAgents);

module.exports = router;
