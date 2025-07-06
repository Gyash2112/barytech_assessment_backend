const mongoose = require('mongoose');
const CATEGORIES = ['Food', 'Clothes', 'Travel', 'Miscellaneous'];

const budgetSchema = new mongoose.Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: function () {
        return !this.isGeneral;
      },
    },
    isGeneral: {
      type: Boolean,
      default: false,
    },
    month: String, // e.g. '2025-07'
    categoryBudgets: [
      {
        category: {
          type: String,
          enum: CATEGORIES,
          required: true,
        },
        limit: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Budget', budgetSchema);
