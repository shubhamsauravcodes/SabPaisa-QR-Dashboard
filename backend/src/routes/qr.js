const express = require('express');
const {
  getAllQRCodes,
  getQRCodeById,
  createQRCode,
  updateQRCode,
  deleteQRCode,
  toggleQRStatus,
  toggleQRSimulation,
  getQRTransactions
} = require('../controllers/qrController');
const { validateQRCode, validateQRUpdate } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/qr
// @desc    Get all QR codes with filtering and pagination
// @access  Public
router.get('/', getAllQRCodes);

// @route   POST /api/qr
// @desc    Create new QR code
// @access  Public
router.post('/', validateQRCode, createQRCode);

// @route   GET /api/qr/:id
// @desc    Get single QR code by ID
// @access  Public
router.get('/:id', getQRCodeById);

// @route   PUT /api/qr/:id
// @desc    Update QR code
// @access  Public
router.put('/:id', validateQRUpdate, updateQRCode);

// @route   DELETE /api/qr/:id
// @desc    Delete QR code and associated transactions
// @access  Public
router.delete('/:id', deleteQRCode);

// @route   PATCH /api/qr/:id/status
// @desc    Toggle QR code status (Active/Inactive)
// @access  Public
router.patch('/:id/status', toggleQRStatus);

// @route   POST /api/qr/:id/simulation
// @desc    Toggle QR code simulation
// @access  Public
router.post('/:id/simulation', toggleQRSimulation);

// @route   GET /api/qr/:id/transactions
// @desc    Get all transactions for a specific QR code
// @access  Public
router.get('/:id/transactions', getQRTransactions);

module.exports = router;
