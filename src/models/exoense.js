const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },

  expenseAmount: {
    type: Number,
    required: true
  },
  
  taxPercentage: {
    type: Number,
    required: true
  },

  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
module.exports = Expense;