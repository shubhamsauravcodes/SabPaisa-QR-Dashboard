const mongoose = require('mongoose');
require('dotenv').config();

const QRCode = require('../src/models/QRCode');
const Transaction = require('../src/models/Transaction');
const { 
  generateTestCustomer, 
  generateTransactionStatus,
  generateRandomAmount 
} = require('../src/utils/helpers');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sabpaisa-qr-dashboard');
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedQRCodes = async () => {
  console.log('🌱 Seeding QR Codes...');
  
  const qrCodes = [
    {
      qrId: 'QR001STORE01',
      vpa: 'merchant@upi',
      referenceName: 'Main Store Counter',
      description: 'Primary payment counter for the main store',
      maxAmount: 5000,
      category: 'Retail',
      notes: 'High volume counter',
      status: 'Active',
      simulationActive: false
    },
    {
      qrId: 'QR002CAFE01',
      vpa: 'cafe@paytm',
      referenceName: 'Coffee Shop',
      description: 'Coffee shop payment QR',
      maxAmount: 1000,
      category: 'Retail',
      notes: 'Small transactions only',
      status: 'Active',
      simulationActive: true
    },
    {
      qrId: 'QR003RENT01',
      vpa: 'landlord@phonepe',
      referenceName: 'Apartment Rent',
      description: 'Monthly rent collection',
      maxAmount: 50000,
      category: 'Rental',
      notes: 'Monthly rent payments',
      status: 'Active',
      simulationActive: false
    },
    {
      qrId: 'QR004SCHOOL01',
      vpa: 'fees@school.edu',
      referenceName: 'School Fees',
      description: 'Student fee collection',
      maxAmount: 25000,
      category: 'Education',
      notes: 'Tuition and other fees',
      status: 'Active',
      simulationActive: false
    },
    {
      qrId: 'QR005CUSTOM01',
      vpa: 'service@gpay',
      referenceName: 'Service Payment',
      description: 'General service payments',
      maxAmount: 10000,
      category: 'Custom',
      notes: 'Various service payments',
      status: 'Inactive',
      simulationActive: false
    }
  ];

  try {
    await QRCode.deleteMany({});
    await QRCode.insertMany(qrCodes);
    console.log(`✅ Created ${qrCodes.length} QR codes`);
    return qrCodes;
  } catch (error) {
    console.error('❌ Error seeding QR codes:', error);
    throw error;
  }
};

const seedTransactions = async (qrCodes) => {
  console.log('🌱 Seeding Transactions...');
  
  const transactions = [];
  const now = new Date();
  
  // Generate transactions for each QR code
  for (const qrCode of qrCodes) {
    // Generate 5-15 transactions per QR code
    const numTransactions = Math.floor(Math.random() * 11) + 5;
    
    for (let i = 0; i < numTransactions; i++) {
      const customer = generateTestCustomer();
      const amount = generateRandomAmount(10, qrCode.maxAmount || 1000);
      const status = generateTransactionStatus();
      
      // Generate timestamps over the last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const hoursAgo = Math.floor(Math.random() * 24);
      const minutesAgo = Math.floor(Math.random() * 60);
      
      const timestamp = new Date(now);
      timestamp.setDate(timestamp.getDate() - daysAgo);
      timestamp.setHours(timestamp.getHours() - hoursAgo);
      timestamp.setMinutes(timestamp.getMinutes() - minutesAgo);
      
      const paymentId = `PAY${Date.now() + i}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const utr = Math.random().toString(36).substring(2, 14).toUpperCase();
      
      transactions.push({
        paymentId,
        qrId: qrCode.qrId,
        amount,
        status,
        utr,
        timestamp,
        customerInfo: customer
      });
    }
  }

  try {
    await Transaction.deleteMany({});
    await Transaction.insertMany(transactions);
    console.log(`✅ Created ${transactions.length} transactions`);
  } catch (error) {
    console.error('❌ Error seeding transactions:', error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    console.log('🚀 Starting database seeding...');
    
    await connectDB();
    
    const qrCodes = await seedQRCodes();
    await seedTransactions(qrCodes);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   QR Codes: ${qrCodes.length}`);
    
    const transactionCount = await Transaction.countDocuments();
    console.log(`   Transactions: ${transactionCount}`);
    
    // Show statistics
    const stats = await Transaction.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);
    
    console.log('\n📈 Transaction Statistics:');
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} transactions, ₹${stat.totalAmount.toLocaleString()}`);
    });
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
