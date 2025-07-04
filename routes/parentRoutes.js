const express = require('express');
const { createChildAccount } = require('../controllers/parentController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post(
  '/create-child',
  verifyToken,
  checkRole('parent'),
  createChildAccount
);

module.exports = router;
