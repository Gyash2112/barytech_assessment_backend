const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.setChildBudget = async (req, res) => {
  const { childId, month, categoryBudgets } = req.body;

  try {
    const existing = await Budget.findOne({ childId, month });

    if (existing) {
      existing.categoryBudgets = categoryBudgets;
      await existing.save();
      return res.status(200).json({ msg: 'Budget updated', budget: existing });
    }

    const budget = await Budget.create({ childId, month, categoryBudgets });
    res.status(201).json({ msg: 'Budget created', budget });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to set budget', error: err.message });
  }
};

exports.setGeneralBudget = async (req, res) => {
  const { month, categoryBudgets } = req.body;

  try {
    const existing = await Budget.findOne({ isGeneral: true, month });

    if (existing) {
      existing.categoryBudgets = categoryBudgets;
      await existing.save();

      return res
        .status(200)
        .json({ msg: 'General Budget Updated', budget: existing });
    }

    const budget = await Budget.create({
      isGeneral: true,
      month,
      categoryBudgets,
    });

    res.status(201).json({ msg: 'General Budget Created', budget });
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'ailed to set General Budget', error: err.message });
  }
};

exports.getChildBudgetStatus = async (req, res) => {
  const { childId, month } = req.query;

  if (!childId || !month) {
    return res.status(400).json({ msg: 'childId and month are required' });
  }

  try {
    const budget = await Budget.findOne({ childId, month });
    if (!budget) return res.status(404).json({ msg: 'Budget not found' });

    const start = new Date(`${month}-01`);
    const end = new Date(`${month}-31`);

    const transactions = await Transaction.find({
      userId: childId,
      type: 'expense',
      date: { $gte: start, $lte: end },
    });

    const usedByCategory = {};

    transactions.forEach((txn) => {
      usedByCategory[txn.category] =
        (usedByCategory[txn.category] || 0) + txn.amount;
    });

    const result = budget.categoryBudgets.map((cat) => {
      const used = usedByCategory[cat.category] || 0;
      const percentUsed = (used / cat.limit) * 100;
      let color = 'green';
      if (percentUsed >= 90) color = 'red';
      else if (percentUsed >= 70) color = 'yellow';

      return {
        category: cat.category,
        limit: cat.limit,
        used,
        percentUsed,
        status: color,
      };
    });

    res.status(200).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Failed to get budget status', error: err.message });
  }
};

exports.getGeneralBudgetStatus = async (req, res) => {
  const { month } = req.query;

  try {
    if (!month) {
      return res.status(400).json({ msg: 'Month is Required' });
    }

    const generalBudget = await Budget.findOne({ isGeneral: true, month });

    if (!generalBudget) {
      return res
        .status(200)
        .json({ msg: 'General Budget not found', data: [] });
    }

    const children = await User.find(
      { role: 'child', parentId: req.user._id },
      '_id'
    );

    const childIds = children.map((c) => c._id);

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(`${month}-31`);

    const transactions = await Transaction.find({
      userId: { $in: childIds },
      type: 'expense',
      date: { $gte: startDate, $lte: endDate },
    });

    // 4. Sum expenses per category
    const categorySpend = {};
    transactions.forEach((txn) => {
      categorySpend[txn.category] =
        (categorySpend[txn.category] || 0) + txn.amount;
    });

    // 5. Compare with budget and determine status
    const statusList = generalBudget.categoryBudgets.map((cat) => {
      const spent = categorySpend[cat.category] || 0;
      const percent = (spent / cat.limit) * 100;

      let status = 'green';
      if (percent >= 90) status = 'red';
      else if (percent >= 70) status = 'yellow';

      return {
        category: cat.category,
        limit: cat.limit,
        spent,
        percentUsed: Math.round(percent),
        status,
      };
    });

    res.status(200).json({ msg: '', data: statusList });
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Failed to get general budget status', error: err.message });
  }
};
