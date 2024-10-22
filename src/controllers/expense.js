const Expense = require('../models/exoense');
const Car = require('../models/car');

// Create a new expense
exports.createExpense = async (req, res) => {
  try {
    const { car, amount, description } = req.body;
    const carItem = await Car.findById({_id:car});
    if (!carItem) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
    const expense = new Expense({ car: car, amount, description });

    await expense.save();
    res.status(201).json({ success: true, data: expense ,messaga:'Expense created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all expenses
exports.getExpenses = async (req, res) => {
  try {
    const { limit = 10, page = 1, search = '' } = req.query;

    const skip = parseInt(limit) || 10;
    const totalExpenses = await Expense.countDocuments({
    //   description: { $regex: search, $options: 'i' },
    });

    const expenses = await Expense.find(
      {
        // description: { $regex: search, $options: 'i' },
      },
      null,
      {
        skip: skip * (parseInt(page) - 1 || 0),
        limit: skip,
      }
    )
      .sort({ createdAt: -1 })
      .populate('car', 'name price _id slug sellstatus');

    res.status(200).json({
      success: true,
      data: expenses,
      count: Math.ceil(totalExpenses / skip),
      totalExpenses,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description } = req.body;
    const expense = await Expense.findByIdAndUpdate(id, { amount, description }, { new: true });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndDelete(id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get a single expense
exports.getExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id).populate('car', 'name price _id slug');

    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get public expenses (placeholder function)
exports.getPublicExpenses = async (req, res) => {
  try {
    const publicExpenses = await Expense.find({ isPublic: true }).populate('car', 'name price');
    res.status(200).json({ success: true, data: publicExpenses });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};