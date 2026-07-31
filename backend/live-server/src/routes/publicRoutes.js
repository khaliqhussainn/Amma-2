const express = require('express');
const { submitContactInquiry, subscribeNewsletter, submitComingSoon } = require('../controllers/adminController');

const router = express.Router();

router.post('/contact', submitContactInquiry);
router.post('/subscribe', subscribeNewsletter);
router.post('/coming-soon', submitComingSoon);

module.exports = router;
