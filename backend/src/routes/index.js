const express = require('express');
const router = express.Router();

// Import route modules
const qrRoutes = require('./qr');
const transactionRoutes = require('./transactions');
const simulationRoutes = require('./simulation');

// Use routes
router.use('/qr', qrRoutes);
router.use('/transactions', transactionRoutes);
router.use('/simulation', simulationRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SabPaisa QR Dashboard API',
    version: '1.0.0',
    endpoints: {
      qr: {
        'GET /api/qr': 'Get all QR codes',
        'POST /api/qr': 'Create new QR code',
        'GET /api/qr/:id': 'Get QR code by ID',
        'PUT /api/qr/:id': 'Update QR code',
        'DELETE /api/qr/:id': 'Delete QR code',
        'PATCH /api/qr/:id/status': 'Toggle QR code status',
        'PATCH /api/qr/:id/simulation': 'Toggle simulation',
        'GET /api/qr/:id/transactions': 'Get transactions for QR code'
      },
      transactions: {
        'GET /api/transactions': 'Get all transactions',
        'POST /api/transactions': 'Create new transaction',
        'GET /api/transactions/stats': 'Get transaction statistics',
        'POST /api/transactions/simulate': 'Simulate transaction'
      },
      simulation: {
        'POST /api/simulation/:qrId/toggle': 'Toggle simulation for QR code',
        'POST /api/simulation/:qrId/start': 'Start simulation for QR code',
        'POST /api/simulation/:qrId/stop': 'Stop simulation for QR code',
        'GET /api/simulation/status': 'Get simulation status for all QR codes',
        'POST /api/simulation/stop-all': 'Stop all running simulations'
      }
    }
  });
});

module.exports = router;
