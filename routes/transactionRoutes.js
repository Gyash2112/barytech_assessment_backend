const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} = require('../controllers/transactionController');

router.post(
  '/add-transaction',
  verifyToken,
  checkRole('child'),
  addTransaction
);

router.get('/get-transaction', verifyToken, getTransactions);

// Delete Transaction
router.delete(
  '/delete-transaction/:id',
  verifyToken,
  checkRole('child'),
  deleteTransaction
);

// Update Transaction
router.put(
  '/update-transaction/:id',
  verifyToken,
  checkRole('child'),
  updateTransaction
);

module.exports = router;
