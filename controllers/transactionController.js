const Transaction = require('../models/Transaction');

exports.addTransaction = async (req, res) => {
  const { title, amount, category, date, type } = req.body;

  try {
    const transaction = await Transaction.create({
      userId: req.user.id,
      title,
      amount,
      category,
      date,
      type,
    });

    res.status(201).json({ msg: 'Transaction added', transaction });
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Failed to add transaction', error: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  const { userId } = req.query;

  try {
    // parent sees any child's transactions
    // child can only see their own
    if (req.user.role === 'child' && req.user.id !== userId)
      return res.status(403).json({ msg: 'Unauthorized' });

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Failed to fetch transactions', error: err.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findById(id);

    if (!transaction)
      return res.status(404).json({ msg: 'Transaction not found' });

    // Only allow the owner (child) to delete
    if (
      req.user.role !== 'child' ||
      transaction.userId.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ msg: 'Unauthorized to delete this transaction' });
    }

    await transaction.deleteOne();
    res.status(200).json({ msg: 'Transaction deleted' });
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Failed to delete transaction', error: err.message });
  }
};

// PUT /api/transaction/:id
exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { title, amount, category, date, type } = req.body;

  try {
    const transaction = await Transaction.findById(id);

    if (!transaction)
      return res.status(404).json({ msg: 'Transaction not found' });

    // Only allow the owner (child) to update
    if (
      req.user.role !== 'child' ||
      transaction.userId.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ msg: 'Unauthorized to update this transaction' });
    }

    // Update only allowed fields
    if (title) transaction.title = title;
    if (amount) transaction.amount = amount;
    if (category) transaction.category = category;
    if (date) transaction.date = date;
    if (type) transaction.type = type;

    await transaction.save();
    res.status(200).json({ msg: 'Transaction updated', transaction });
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Failed to update transaction', error: err.message });
  }
};
