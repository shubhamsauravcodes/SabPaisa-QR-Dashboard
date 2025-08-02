const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  qrId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  vpa: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-_]{2,64}$/.test(v);
      },
      message: 'Invalid UPI VPA format'
    }
  },
  referenceName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 255
  },
  maxAmount: {
    type: Number,
    min: 0,
    max: 100000 // 1 lakh max limit
  },
  category: {
    type: String,
    required: true,
    enum: ['Retail', 'Rental', 'Education', 'Custom'],
    default: 'Custom'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  simulationActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true, // This adds createdAt and updatedAt automatically
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
qrCodeSchema.index({ status: 1 });
qrCodeSchema.index({ category: 1 });
qrCodeSchema.index({ createdAt: -1 });
qrCodeSchema.index({ qrId: 1, status: 1 });

// Virtual for transaction count (can be populated)
qrCodeSchema.virtual('transactionCount', {
  ref: 'Transaction',
  localField: 'qrId',
  foreignField: 'qrId',
  count: true
});

// Instance method to toggle status
qrCodeSchema.methods.toggleStatus = function() {
  this.status = this.status === 'Active' ? 'Inactive' : 'Active';
  return this.save();
};

// Instance method to toggle simulation
qrCodeSchema.methods.toggleSimulation = function() {
  this.simulationActive = !this.simulationActive;
  return this.save();
};

// Static method to find active QR codes
qrCodeSchema.statics.findActive = function() {
  return this.find({ status: 'Active' });
};

// Static method to find by category
qrCodeSchema.statics.findByCategory = function(category) {
  return this.find({ category });
};

// Pre-save middleware
qrCodeSchema.pre('save', function(next) {
  // If status is set to Inactive, also stop simulation
  if (this.status === 'Inactive') {
    this.simulationActive = false;
  }
  next();
});

module.exports = mongoose.model('QRCode', qrCodeSchema);
