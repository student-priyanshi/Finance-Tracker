const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');

router.post('/', auth, transactionController.addTransaction);
router.get('/', auth, transactionController.getTransactions);
router.get('/summary', auth, transactionController.getSummary);

module.exports = router;