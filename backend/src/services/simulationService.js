const QRCode = require('../models/QRCode');
const Transaction = require('../models/Transaction');
const { generateTestCustomer, generateRandomAmount } = require('../utils/helpers');

class SimulationService {
  constructor() {
    this.activeSimulations = new Map(); // qrId -> intervalId
    this.isInitialized = false;
  }

  /**
   * Initialize simulation service - restore running simulations from database
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('🔄 Initializing Simulation Service...');
      
      // Find all QR codes with active simulations
      const activeQRs = await QRCode.find({ 
        simulationActive: true, 
        status: 'Active' 
      });

      console.log(`📊 Found ${activeQRs.length} QR codes with active simulations`);

      // Start simulations for each active QR
      for (const qr of activeQRs) {
        this.startSimulation(qr.qrId);
      }

      this.isInitialized = true;
      console.log('✅ Simulation Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Simulation Service:', error);
    }
  }

  /**
   * Start simulation for a specific QR code
   */
  startSimulation(qrId) {
    try {
      // Don't start if already running
      if (this.activeSimulations.has(qrId)) {
        console.log(`⚠️  Simulation already running for QR: ${qrId}`);
        return false;
      }

      console.log(`🚀 Starting simulation for QR: ${qrId}`);

      // Generate transactions every 5 seconds (configurable)
      const intervalId = setInterval(async () => {
        await this.generateTransaction(qrId);
      }, 5000); // 5 seconds

      this.activeSimulations.set(qrId, intervalId);
      return true;
    } catch (error) {
      console.error(`❌ Failed to start simulation for QR ${qrId}:`, error);
      return false;
    }
  }

  /**
   * Stop simulation for a specific QR code
   */
  stopSimulation(qrId) {
    try {
      const intervalId = this.activeSimulations.get(qrId);
      
      if (intervalId) {
        clearInterval(intervalId);
        this.activeSimulations.delete(qrId);
        console.log(`⏹️  Stopped simulation for QR: ${qrId}`);
        return true;
      } else {
        console.log(`⚠️  No active simulation found for QR: ${qrId}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Failed to stop simulation for QR ${qrId}:`, error);
      return false;
    }
  }

  /**
   * Toggle simulation for a QR code
   */
  async toggleSimulation(qrId) {
    try {
      const qrCode = await QRCode.findOne({ qrId });
      
      if (!qrCode) {
        throw new Error(`QR Code not found: ${qrId}`);
      }

      if (!qrCode.simulationActive) {
        // Start simulation
        qrCode.simulationActive = true;
        await qrCode.save();
        this.startSimulation(qrId);
        return { active: true, message: `Simulation started for ${qrId}` };
      } else {
        // Stop simulation
        qrCode.simulationActive = false;
        await qrCode.save();
        this.stopSimulation(qrId);
        return { active: false, message: `Simulation stopped for ${qrId}` };
      }
    } catch (error) {
      console.error(`❌ Failed to toggle simulation for QR ${qrId}:`, error);
      throw error;
    }
  }

  /**
   * Generate a mock transaction for a QR code
   */
  async generateTransaction(qrId) {
    try {
      const qrCode = await QRCode.findOne({ qrId, status: 'Active' });
      
      if (!qrCode || !qrCode.simulationActive) {
        console.log(`⚠️  QR ${qrId} is not active or simulation disabled`);
        this.stopSimulation(qrId); // Clean up
        return null;
      }

      // Generate random number of transactions (1-3)
      const numTransactions = Math.floor(Math.random() * 3) + 1;
      const transactions = [];

      for (let i = 0; i < numTransactions; i++) {
        const customer = generateTestCustomer();
        const amount = generateRandomAmount(10, qrCode.maxAmount || 1000);
        
        // Generate transaction status (80% success, 15% failed, 5% pending)
        const rand = Math.random();
        let status;
        if (rand < 0.80) status = 'Success';
        else if (rand < 0.95) status = 'Failed';
        else status = 'Pending';

        const paymentId = `PAY${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        // Generate exactly 12 alphanumeric characters for UTR
        const utr = (Math.random().toString(36).substring(2, 8) +
                   Math.random().toString(36).substring(2, 8)).substring(0, 12).toUpperCase();

        const transaction = new Transaction({
          paymentId,
          qrId,
          amount,
          status,
          utr,
          timestamp: new Date(),
          customerInfo: customer
        });

        await transaction.save();
        transactions.push(transaction);
      }

      console.log(`💰 Generated ${transactions.length} transactions for QR: ${qrId}`);
      return transactions;
    } catch (error) {
      console.error(`❌ Failed to generate transaction for QR ${qrId}:`, error);
      return null;
    }
  }

  /**
   * Get simulation status for all QR codes
   */
  getSimulationStatus() {
    const status = {};
    this.activeSimulations.forEach((intervalId, qrId) => {
      status[qrId] = true;
    });
    return status;
  }

  /**
   * Stop all simulations (for graceful shutdown)
   */
  stopAllSimulations() {
    console.log('🛑 Stopping all simulations...');
    this.activeSimulations.forEach((intervalId, qrId) => {
      clearInterval(intervalId);
      console.log(`⏹️  Stopped simulation for QR: ${qrId}`);
    });
    this.activeSimulations.clear();
    console.log('✅ All simulations stopped');
  }

  /**
   * Get statistics about active simulations
   */
  getStats() {
    return {
      activeSimulations: this.activeSimulations.size,
      runningQRs: Array.from(this.activeSimulations.keys()),
      isInitialized: this.isInitialized
    };
  }
}

// Create singleton instance
const simulationService = new SimulationService();

module.exports = simulationService;
