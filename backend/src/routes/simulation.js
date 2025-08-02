const express = require('express');
const simulationService = require('../services/simulationService');
const QRCode = require('../models/QRCode');

const router = express.Router();

/**
 * @route   POST /api/simulation/:qrId/toggle
 * @desc    Toggle simulation for a specific QR code
 * @access  Public
 */
router.post('/:qrId/toggle', async (req, res) => {
  try {
    const { qrId } = req.params;
    
    // Validate QR code exists
    const qrCode = await QRCode.findOne({ qrId });
    if (!qrCode) {
      return res.status(404).json({
        success: false,
        error: `QR Code not found: ${qrId}`
      });
    }

    // Check if QR code is active
    if (qrCode.status !== 'Active') {
      return res.status(400).json({
        success: false,
        error: `Cannot start simulation for inactive QR code: ${qrId}`
      });
    }

    const result = await simulationService.toggleSimulation(qrId);
    
    res.json({
      success: true,
      data: {
        qrId,
        simulationActive: result.active,
        message: result.message
      }
    });
  } catch (error) {
    console.error('Error toggling simulation:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/simulation/:qrId/start
 * @desc    Start simulation for a specific QR code
 * @access  Public
 */
router.post('/:qrId/start', async (req, res) => {
  try {
    const { qrId } = req.params;
    
    const qrCode = await QRCode.findOne({ qrId });
    if (!qrCode) {
      return res.status(404).json({
        success: false,
        error: `QR Code not found: ${qrId}`
      });
    }

    if (qrCode.status !== 'Active') {
      return res.status(400).json({
        success: false,
        error: `Cannot start simulation for inactive QR code: ${qrId}`
      });
    }

    if (qrCode.simulationActive) {
      return res.status(400).json({
        success: false,
        error: `Simulation already running for QR code: ${qrId}`
      });
    }

    // Update database
    qrCode.simulationActive = true;
    await qrCode.save();

    // Start simulation
    simulationService.startSimulation(qrId);
    
    res.json({
      success: true,
      data: {
        qrId,
        simulationActive: true,
        message: `Simulation started for ${qrId}`
      }
    });
  } catch (error) {
    console.error('Error starting simulation:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/simulation/:qrId/stop
 * @desc    Stop simulation for a specific QR code
 * @access  Public
 */
router.post('/:qrId/stop', async (req, res) => {
  try {
    const { qrId } = req.params;
    
    const qrCode = await QRCode.findOne({ qrId });
    if (!qrCode) {
      return res.status(404).json({
        success: false,
        error: `QR Code not found: ${qrId}`
      });
    }

    if (!qrCode.simulationActive) {
      return res.status(400).json({
        success: false,
        error: `No active simulation found for QR code: ${qrId}`
      });
    }

    // Update database
    qrCode.simulationActive = false;
    await qrCode.save();

    // Stop simulation
    simulationService.stopSimulation(qrId);
    
    res.json({
      success: true,
      data: {
        qrId,
        simulationActive: false,
        message: `Simulation stopped for ${qrId}`
      }
    });
  } catch (error) {
    console.error('Error stopping simulation:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/simulation/status
 * @desc    Get simulation status for all QR codes
 * @access  Public
 */
router.get('/status', async (req, res) => {
  try {
    const stats = simulationService.getStats();
    const simulationStatus = simulationService.getSimulationStatus();
    
    // Get QR codes with simulation info
    const qrCodes = await QRCode.find({}, 'qrId referenceName status simulationActive');
    
    const statusData = qrCodes.map(qr => ({
      qrId: qr.qrId,
      referenceName: qr.referenceName,
      status: qr.status,
      simulationActive: qr.simulationActive,
      isRunning: simulationStatus[qr.qrId] || false
    }));
    
    res.json({
      success: true,
      data: {
        ...stats,
        qrCodes: statusData
      }
    });
  } catch (error) {
    console.error('Error getting simulation status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/simulation/stop-all
 * @desc    Stop all running simulations
 * @access  Public
 */
router.post('/stop-all', async (req, res) => {
  try {
    // Update all QR codes in database
    await QRCode.updateMany(
      { simulationActive: true },
      { simulationActive: false }
    );

    // Stop all running simulations
    simulationService.stopAllSimulations();
    
    res.json({
      success: true,
      data: {
        message: 'All simulations stopped'
      }
    });
  } catch (error) {
    console.error('Error stopping all simulations:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
