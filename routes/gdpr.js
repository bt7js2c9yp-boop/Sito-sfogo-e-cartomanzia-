const express = require('express');
const router = express.Router();
const gdprController = require('../controllers/gdprController');
const { ensureAuth } = require('../middleware/auth');

router.post('/consent', ensureAuth, gdprController.saveConsent);
router.get('/export', ensureAuth, gdprController.exportData);
router.post('/delete', ensureAuth, gdprController.deleteAccount);

module.exports = router;
