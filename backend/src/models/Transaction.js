const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  qrId: {
    type: String,
    required: true,
    trim: true,
    index: true,
    ref: 'QRCode' // Reference to QRCode model
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01,
    max: 100000, // 1 lakh max
    validate: {
      validator: function(v) {
        return Number.isFinite(v) && v > 0;
      },
      message: 'Amount must be a positive number'
    }
  },
  status: {
    type: String,
    required: true,
    enum: ['Success', 'Failed', 'Pending'],
    default: 'Pending'
  },
  utr: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
    validate: {
      validator: function(v) {
        return /^[A-Za-z0-9]{12}$/.test(v); // Standard UTR format
      },
      message: 'UTR must be 12 alphanumeric characters'
    }
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  customerInfo: {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^[6-9]\d{9}$/.test(v); // Indian mobile number format
        },
        message: 'Invalid Indian mobile number format'
      }
    },
    upiApp: {
      type: String,
      required: true,
      trim: true,
      enum: ['GPay', 'PhonePe', 'Paytm', 'BHIM', 'AmazonPay', 'WhatsApp', 'Other']
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound indexes for better query performance
transactionSchema.index({ qrId: 1, timestamp: -1 });
transactionSchema.index({ status: 1, timestamp: -1 });
transactionSchema.index({ timestamp: -1 });
transactionSchema.index({ qrId: 1, status: 1 });

// Virtual for QR code details (can be populated)
transactionSchema.virtual('qrCode', {
  ref: 'QRCode',
  localField: 'qrId',
  foreignField: 'qrId',
  justOne: true
});

// Static method to find transactions by QR ID
transactionSchema.statics.findByQRId = function(qrId) {
  return this.find({ qrId }).sort({ timestamp: -1 });
};

// Static method to find transactions by status
transactionSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ timestamp: -1 });
};

// Static method to find transactions in date range
transactionSchema.statics.findInDateRange = function(startDate, endDate) {
  return this.find({
    timestamp: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).sort({ timestamp: -1 });
};

// Static method to get transaction statistics
transactionSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);
  
  const totalTransactions = await this.countDocuments();
  const totalAmount = await this.aggregate([
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  return {
    totalTransactions,
    totalAmount: totalAmount[0]?.total || 0,
    statusBreakdown: stats
  };
};

// Instance method to mark as completed
transactionSchema.methods.markAsCompleted = function() {
  this.status = 'Success';
  return this.save();
};

// Instance method to mark as failed
transactionSchema.methods.markAsFailed = function() {
  this.status = 'Failed';
  return this.save();
};

// Pre-save middleware to generate UTR if not provided
transactionSchema.pre('save', function(next) {
  if (!this.utr) {
    // Generate a random 12-character UTR
    this.utr = Math.random().toString(36).substring(2, 14).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
