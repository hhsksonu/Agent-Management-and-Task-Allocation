const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const authMiddleware = require('../middleware/auth');

router.post('/add', authMiddleware, agentController.addAgent);

router.get('/all', authMiddleware, agentController.getAllAgents);

module.exports = router;
