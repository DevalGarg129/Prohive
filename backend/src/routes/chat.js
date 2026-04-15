const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.use(protect);

// POST /api/chat/message
router.post('/message', sendMessage);

module.exports = router;
