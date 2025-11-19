const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/verify-otp', authController.verifyOTP);
router.post('/signin', authController.signin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', auth, authController.changePassword);

module.exports = router;