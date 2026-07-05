const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { ensureAuth } = require('../middleware/auth');

router.post('/create-session', ensureAuth, paymentController.createSession);
router.get('/success', paymentController.success);

module.exports = router;
