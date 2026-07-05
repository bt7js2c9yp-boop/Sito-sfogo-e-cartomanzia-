const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { ensureAuth, ensureCredits } = require('../middleware/auth');

router.post('/send', ensureAuth, ensureCredits, chatController.sendMessage);
router.get('/history', ensureAuth, chatController.history);

module.exports = router;
