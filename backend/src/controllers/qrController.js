const QRCode = require('../models/QRCode');
const Transaction = require('../models/Transaction');
const { v4: uuidv4 } = require('uuid');

// @desc    Get all QR codes
// @route   GET /api/qr
// @access  Public
const getAllQRCodes = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status,
      search
    } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { qrId: { $regex: search, $options: 'i' } },
        { referenceName: { $regex: search, $options: 'i' } },
        { vpa: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const qrCodes = await QRCode.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip(skip)
      .populate('transactionCount');

    const total = await QRCode.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        qrCodes,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: qrCodes.length,
          totalRecords: total
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single QR code by ID
// @route   GET /api/qr/:id
// @access  Public
const getQRCodeById = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findOne({ qrId: req.params.id });

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        error: 'QR Code not found'
      });
    }

    // Get transaction statistics for this QR code
    const transactionStats = await Transaction.aggregate([
      { $match: { qrId: req.params.id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const totalTransactions = await Transaction.countDocuments({ qrId: req.params.id });

    res.status(200).json({
      success: true,
      data: {
        qrCode,
        stats: {
          totalTransactions,
          statusBreakdown: transactionStats
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new QR code
// @route   POST /api/qr
// @access  Public
const createQRCode = async (req, res, next) => {
  try {
    const {
      vpa,
      referenceName,
      description,
      maxAmount,
      category,
      notes
    } = req.body;

    // Generate unique QR ID
    const qrId = `QR${Date.now()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    const qrCode = await QRCode.create({
      qrId,
      vpa,
      referenceName,
      description,
      maxAmount: maxAmount || undefined,
      category: category || 'Custom',
      notes,
      status: 'Active',
      simulationActive: false
    });

    res.status(201).json({
      success: true,
      data: qrCode,
      message: 'QR Code created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update QR code
// @route   PUT /api/qr/:id
// @access  Public
const updateQRCode = async (req, res, next) => {
  try {
    const {
      vpa,
      referenceName,
      description,
      maxAmount,
      category,
      notes
    } = req.body;

    const qrCode = await QRCode.findOne({ qrId: req.params.id });

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        error: 'QR Code not found'
      });
    }

    // Update fields
    if (vpa !== undefined) qrCode.vpa = vpa;
    if (referenceName !== undefined) qrCode.referenceName = referenceName;
    if (description !== undefined) qrCode.description = description;
    if (maxAmount !== undefined) qrCode.maxAmount = maxAmount;
    if (category !== undefined) qrCode.category = category;
    if (notes !== undefined) qrCode.notes = notes;

    await qrCode.save();

    res.status(200).json({
      success: true,
      data: qrCode,
      message: 'QR Code updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete QR code
// @route   DELETE /api/qr/:id
// @access  Public
const deleteQRCode = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findOne({ qrId: req.params.id });

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        error: 'QR Code not found'
      });
    }

    // Delete associated transactions
    await Transaction.deleteMany({ qrId: req.params.id });

    // Delete QR code
    await QRCode.deleteOne({ qrId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'QR Code and associated transactions deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle QR code status
// @route   PATCH /api/qr/:id/status
// @access  Public
const toggleQRStatus = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findOne({ qrId: req.params.id });

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        error: 'QR Code not found'
      });
    }

    await qrCode.toggleStatus();

    res.status(200).json({
      success: true,
      data: qrCode,
      message: `QR Code status changed to ${qrCode.status}`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle QR code simulation
// @route   PATCH /api/qr/:id/simulation
// @access  Public
const toggleQRSimulation = async (req, res, next) => {
  try {
    const qrCode = await QRCode.findOne({ qrId: req.params.id });

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        error: 'QR Code not found'
      });
    }

    if (qrCode.status !== 'Active') {
      return res.status(400).json({
        success: false,
        error: 'Cannot start simulation on inactive QR code'
      });
    }

    await qrCode.toggleSimulation();

    res.status(200).json({
      success: true,
      data: qrCode,
      message: `Simulation ${qrCode.simulationActive ? 'started' : 'stopped'}`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transactions for a QR code
// @route   GET /api/qr/:id/transactions
// @access  Public
const getQRTransactions = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      startDate,
      endDate
    } = req.query;

    // Check if QR code exists
    const qrCode = await QRCode.findOne({ qrId: req.params.id });
    if (!qrCode) {
      return res.status(404).json({
        success: false,
        error: 'QR Code not found'
      });
    }

    // Build filter
    const filter = { qrId: req.params.id };
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    // Execute query
    const skip = (page - 1) * limit;
    const transactions = await Transaction.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip(skip);

    const total = await Transaction.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        qrCode: {
          qrId: qrCode.qrId,
          referenceName: qrCode.referenceName,
          vpa: qrCode.vpa,
          status: qrCode.status
        },
        transactions,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: transactions.length,
          totalRecords: total
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllQRCodes,
  getQRCodeById,
  createQRCode,
  updateQRCode,
  deleteQRCode,
  toggleQRStatus,
  toggleQRSimulation,
  getQRTransactions
};
