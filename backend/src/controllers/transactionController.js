const Transaction = require('../models/Transaction');
const QRCode = require('../models/QRCode');
const { v4: uuidv4 } = require('uuid');
const { getPaginationMeta } = require('../utils/helpers');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Public
const getAllTransactions = async (req, res, next) => {
  try {
    const { qrId, status, startDate, endDate, search, page = 1, limit = 20 } = req.query;

    // Parse pagination parameters
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = Math.min(parseInt(limit, 10) || 20, 100); // Max 100 items per page
    const skip = (pageNumber - 1) * pageSize;

    // Build filter object
    const filter = {};
    if (qrId) filter.qrId = qrId;
    if (status) filter.status = status;
    
    // Date range filter
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    // Search filter
    if (search) {
      filter.$or = [
        { paymentId: { $regex: search, $options: 'i' } },
        { qrId: { $regex: search, $options: 'i' } },
        { utr: { $regex: search, $options: 'i' } },
        { 'customerInfo.name': { $regex: search, $options: 'i' } },
        { 'customerInfo.phone': { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count for pagination
    const totalRecords = await Transaction.countDocuments(filter);
    
    // Debug parameters before calling helper
    console.log('🔍 Before getPaginationMeta:', {
      pageNumber,
      pageSize,
      totalRecords,
      manualCalc: Math.ceil(totalRecords / pageSize)
    });
    
    const pagination = getPaginationMeta(pageNumber, pageSize, totalRecords);

    // Debug logging
    console.log('🔍 Backend Pagination Debug:', pagination);

    // Get paginated transactions
    console.log('Pagination Debug:', { skip, limit: pageSize });
    const transactions = await Transaction.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('qrCode', 'referenceName vpa category');
    
    console.log('🔍 Query result count:', transactions.length);

    res.status(200).json({
      success: true,
      data: {
        transactions,
        pagination: {
          ...pagination,
          count: transactions.length,
          pageSize
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction by ID
// @route   GET /api/transactions/:id
// @access  Public
const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ paymentId: req.params.id })
      .populate('qrCode', 'referenceName vpa category status');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Public
const createTransaction = async (req, res, next) => {
  try {
    const {
      qrId,
      amount,
      status = 'Pending',
      customerInfo
    } = req.body;

    // Verify QR code exists and is active
    const qrCode = await QRCode.findOne({ qrId });
    if (!qrCode) {
      return res.status(404).json({
        success: false,
        error: 'QR Code not found'
      });
    }

    if (qrCode.status !== 'Active') {
      return res.status(400).json({
        success: false,
        error: 'QR Code is not active'
      });
    }

    // Check max amount limit
    if (qrCode.maxAmount && amount > qrCode.maxAmount) {
      return res.status(400).json({
        success: false,
        error: `Amount exceeds maximum limit of ₹${qrCode.maxAmount}`
      });
    }

    // Generate unique payment ID and UTR
    const paymentId = `PAY${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const utr = Math.random().toString(36).substring(2, 14).toUpperCase();

    const transaction = await Transaction.create({
      paymentId,
      qrId,
      amount,
      status,
      utr,
      customerInfo
    });

    res.status(201).json({
      success: true,
      data: transaction,
      message: 'Transaction created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update transaction status
// @route   PUT /api/transactions/:id
// @access  Public
const updateTransaction = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Success', 'Failed', 'Pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be Success, Failed, or Pending'
      });
    }

    const transaction = await Transaction.findOne({ paymentId: req.params.id });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    transaction.status = status;
    await transaction.save();

    res.status(200).json({
      success: true,
      data: transaction,
      message: 'Transaction updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transaction statistics
// @route   GET /api/transactions/stats
// @access  Public
const getTransactionStats = async (req, res, next) => {
  try {
    const { startDate, endDate, qrId } = req.query;

    // Build match filter
    const matchFilter = {};
    if (qrId) matchFilter.qrId = qrId;
    if (startDate || endDate) {
      matchFilter.timestamp = {};
      if (startDate) matchFilter.timestamp.$gte = new Date(startDate);
      if (endDate) matchFilter.timestamp.$lte = new Date(endDate);
    }

    // Aggregate statistics
    const stats = await Transaction.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          successfulTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'Success'] }, 1, 0] }
          },
          failedTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'Failed'] }, 1, 0] }
          },
          pendingTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          successfulAmount: {
            $sum: { $cond: [{ $eq: ['$status', 'Success'] }, '$amount', 0] }
          },
          averageAmount: { $avg: '$amount' }
        }
      }
    ]);

    // Status breakdown
    const statusBreakdown = await Transaction.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Daily statistics (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyStats = await Transaction.aggregate([
      {
        $match: {
          ...matchFilter,
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          count: { $sum: 1 },
          amount: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Top UPI apps
    const topUpiApps = await Transaction.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$customerInfo.upiApp',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const result = {
      summary: stats[0] || {
        totalTransactions: 0,
        totalAmount: 0,
        successfulTransactions: 0,
        failedTransactions: 0,
        pendingTransactions: 0,
        successfulAmount: 0,
        averageAmount: 0
      },
      statusBreakdown,
      dailyStats,
      topUpiApps
    };

    // Calculate success rate
    if (result.summary.totalTransactions > 0) {
      result.summary.successRate = (
        (result.summary.successfulTransactions / result.summary.totalTransactions) * 100
      ).toFixed(2);
    } else {
      result.summary.successRate = 0;
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Simulate transaction
// @route   POST /api/transactions/simulate
// @access  Public
const simulateTransaction = async (req, res, next) => {
  try {
    const { qrId, count = 1 } = req.body;

    // Verify QR code exists and simulation is active
    const qrCode = await QRCode.findOne({ qrId });
    if (!qrCode) {
      return res.status(404).json({
        success: false,
        error: 'QR Code not found'
      });
    }

    if (qrCode.status !== 'Active') {
      return res.status(400).json({
        success: false,
        error: 'QR Code is not active'
      });
    }

    const simulatedTransactions = [];
    const customerNames = ['Rahul Kumar', 'Priya Sharma', 'Amit Singh', 'Neha Gupta', 'Ravi Patel', 'Sunita Devi', 'Vikash Kumar', 'Pooja Singh'];
    const upiApps = ['GPay', 'PhonePe', 'Paytm', 'BHIM', 'AmazonPay'];
    const statuses = ['Success', 'Success', 'Success', 'Success', 'Failed']; // 80% success rate

    for (let i = 0; i < count; i++) {
      const amount = Math.floor(Math.random() * (qrCode.maxAmount || 1000)) + 1;
      const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
      const phone = `${Math.floor(Math.random() * 3) + 7}${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`;
      const upiApp = upiApps[Math.floor(Math.random() * upiApps.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      const paymentId = `PAY${Date.now() + i}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const utr = Math.random().toString(36).substring(2, 14).toUpperCase();

      const transaction = await Transaction.create({
        paymentId,
        qrId,
        amount,
        status,
        utr,
        customerInfo: {
          name: customerName,
          phone,
          upiApp
        }
      });

      simulatedTransactions.push(transaction);
    }

    res.status(201).json({
      success: true,
      data: simulatedTransactions,
      message: `${count} transaction(s) simulated successfully`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Public
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ paymentId: req.params.id });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    await Transaction.deleteOne({ paymentId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  getTransactionStats,
  simulateTransaction,
  deleteTransaction
};
