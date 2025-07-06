const express = require('express');
const {
  createChildAccount,
  getAllUsers,
} = require('../controllers/parentController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const {
  setChildBudget,
  setGeneralBudget,
  getChildBudgetStatus,
} = require('../controllers/budgetController');

const router = express.Router();

router.post(
  '/create-child',
  verifyToken,
  checkRole('parent'),
  createChildAccount
);

router.post(
  '/set-general-budget',
  verifyToken,
  checkRole('parent'),
  setGeneralBudget
);

router.post(
  '/set-child-budget',
  verifyToken,
  checkRole('parent'),
  setChildBudget
);

router.get(
  '/get-child-budget-status',
  verifyToken,
  checkRole('parent'),
  getChildBudgetStatus
);

router.get(
  '/get-general-budget-status',
  verifyToken,
  checkRole('parent'),
  getChildBudgetStatus
);

router.get('/get-all-users', verifyToken, checkRole('parent'), getAllUsers);

module.exports = router;
