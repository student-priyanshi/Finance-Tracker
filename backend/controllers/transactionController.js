const Transaction = require('../models/Transaction');

// Add transaction
exports.addTransaction = async (req, res) => {
  try {
    const { type, description, amount, category, date } = req.body;
    
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

// Get transactions with filters, sorting, and pagination
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

    // Build filter object
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

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const transactions = await Transaction.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

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

// Get transaction summary
exports.getSummary = async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      { $match: { user: req.user._id } },
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
      summary[item._id] = item.total;
    });

    summary.balance = summary.income - summary.expense;

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};