const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

exports.addTransaction = async (req, res) => {
  try {
    const { type, description, amount, category, date } = req.body;
    
    if (!type || !description || !amount) {
      return res.status(400).json({ message: 'Type, description, and amount are required' });
    }

    const transaction = new Transaction({
      user: req.user.id,
      type,
      description,
      amount,
      category,
      date: date || new Date()
    });

    await transaction.save();

    res.status(201).json({
      message: 'Transaction added successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      startDate, 
      endDate, 
      minAmount, 
      maxAmount,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    const filter = { user: req.user.id };
    
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = parseFloat(minAmount);
      if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
    }

    const skip = (page - 1) * limit;
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const transactions = await Transaction.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalTransactions: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const summary = {
      income: 0,
      expense: 0,
      balance: 0
    };

    result.forEach(item => {
      if (item._id === 'income') {
        summary.income = item.total;
      } else if (item._id === 'expense') {
        summary.expense = item.total;
      }
    });

    summary.balance = summary.income - summary.expense;

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};