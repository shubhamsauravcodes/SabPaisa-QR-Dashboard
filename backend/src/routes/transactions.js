const express = require('express');
const {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  getTransactionStats,
  simulateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');
const { validateTransaction, validateTransactionUpdate, validateSimulation } = require('../middleware/validation');

const router = express.Router();

// @route   GET /api/transactions/stats
// @desc    Get transaction statistics
// @access  Public
// Note: This must come before /:id route to avoid conflicts
router.get('/stats', getTransactionStats);

// @route   POST /api/transactions/simulate
// @desc    Simulate transaction(s) for testing
// @access  Public
router.post('/simulate', validateSimulation, simulateTransaction);

// @route   GET /api/transactions
// @desc    Get all transactions with filtering and pagination
// @access  Public
router.get('/', getAllTransactions);

// @route   POST /api/transactions
// @desc    Create new transaction
// @access  Public
router.post('/', validateTransaction, createTransaction);

// @route   GET /api/transactions/:id
// @desc    Get single transaction by payment ID
// @access  Public
router.get('/:id', getTransactionById);

// @route   PUT /api/transactions/:id
// @desc    Update transaction status
// @access  Public
router.put('/:id', validateTransactionUpdate, updateTransaction);

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction
// @access  Public
router.delete('/:id', deleteTransaction);

module.exports = router;
