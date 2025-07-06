const mongoose = require('mongoose');
const CATEGORIES = ['Food', 'Clothes', 'Travel', 'Miscellaneous'];

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    amount: Number,
    category: {
      type: String,
      enum: CATEGORIES,
      required: true,
    },
    date: Date,
    type: { type: String, enum: ['income', 'expense'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
