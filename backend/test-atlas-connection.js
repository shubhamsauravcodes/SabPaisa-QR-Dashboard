require('dotenv').config();
const mongoose = require('mongoose');

async function testMongoDBAtlasConnection() {
  console.log('🌐 Testing MongoDB Atlas connection...');
  
  const mongoURI = process.env.MONGODB_URI;
  
  if (!mongoURI || mongoURI.includes('your-username') || mongoURI.includes('your-password')) {
    console.error('❌ Please update MONGODB_URI in your .env file with your actual MongoDB Atlas connection string');
    console.log('📝 Format: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/sabpaisa-qr-dashboard?retryWrites=true&w=majority');
    process.exit(1);
  }

  // Hide credentials in log
  const sanitizedURI = mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
  console.log('📍 Connecting to:', sanitizedURI);

  try {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    };

    await mongoose.connect(mongoURI, options);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('🏠 Host:', mongoose.connection.host);
    console.log('🗄️  Database:', mongoose.connection.name);
    
    // Test basic operations
    console.log('\n🧪 Testing basic database operations...');
    
    // Create a test collection
    const testSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('ConnectionTest', testSchema);
    
    // Insert a test document
    const testDoc = await TestModel.create({ name: 'Connection Test' });
    console.log('✅ Document created:', testDoc._id);
    
    // Find the document
    const foundDoc = await TestModel.findById(testDoc._id);
    console.log('✅ Document found:', foundDoc.name);
    
    // Clean up - delete the test document
    await TestModel.findByIdAndDelete(testDoc._id);
    console.log('✅ Test document cleaned up');
    
    console.log('\n🎉 MongoDB Atlas is ready for your application!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('💡 Check your username and password in the connection string');
    } else if (error.message.includes('IP')) {
      console.log('💡 Make sure your IP address is whitelisted in MongoDB Atlas Network Access');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('💡 Check your cluster URL in the connection string');
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔒 Connection closed');
    process.exit(0);
  }
}

testMongoDBAtlasConnection();
