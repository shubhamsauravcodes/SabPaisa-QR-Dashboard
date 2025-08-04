# ⚙️ SabPaisa QR Dashboard - Backend API

A robust, scalable Express.js REST API backend service for managing UPI QR codes with real-time payment transaction simulation and comprehensive analytics.

## 🚀 Features

### 🎯 Core Functionality
- **QR Code Management**: Full CRUD operations with advanced validation
- **Transaction Processing**: Real-time transaction simulation and monitoring
- **Payment Simulation Service**: Background service for automated transaction generation
- **Advanced Analytics**: Comprehensive transaction statistics and reporting
- **RESTful API Design**: Standard HTTP methods with consistent response formats

### 🔒 Enterprise Features
- **Security First**: CORS, Helmet, rate limiting, and input validation
- **Error Handling**: Centralized error management with detailed logging
- **Database Optimization**: Indexed MongoDB collections with efficient queries
- **Scalable Architecture**: Modular design with separation of concerns
- **Production Ready**: PM2 support, environment configuration, and monitoring

## 🛠️ Technology Stack

### Core Technologies
- **🚀 Node.js 18+**: Latest LTS runtime with modern JavaScript features
- **🌐 Express.js**: Fast, unopinionated web framework
- **🗄️ MongoDB**: NoSQL database with Mongoose ODM
- **🔐 Security Stack**: Helmet, CORS, express-rate-limit
- **✅ Validation**: Joi and express-validator for comprehensive input validation

### Development & Testing
- **🧪 Testing**: Jest with Supertest for API testing
- **🔄 Development**: Nodemon for auto-restart during development
- **📊 Process Management**: PM2 for production deployment
- **🌍 Environment**: dotenv for configuration management
- **📝 Code Quality**: ESLint with Node.js specific rules

## 📁 Project Structure

```
backend/
├── 📂 src/                     # Source code directory
│   ├── 🎛️ controllers/         # Request handlers & business logic
│   │   ├── qrController.js          # QR CRUD operations
│   │   └── transactionController.js # Transaction management
│   ├── 📊 models/              # MongoDB Mongoose schemas
│   │   ├── QRCode.js               # QR code data model with validation
│   │   └── Transaction.js          # Transaction data model
│   ├── 🛣️ routes/               # API route definitions
│   │   ├── index.js                # Main route aggregator
│   │   ├── qr.js                   # QR code endpoints
│   │   ├── transactions.js         # Transaction endpoints
│   │   └── simulation.js           # Simulation control endpoints
│   ├── 🔧 services/            # Business logic services
│   │   └── simulationService.js    # Real-time payment simulation engine
│   ├── 🛡️ middleware/          # Custom middleware functions
│   │   ├── errorHandler.js         # Centralized error handling
│   │   └── validation.js           # Request validation middleware
│   ├── 🛠️ utils/               # Helper functions and utilities
│   │   └── helpers.js              # Common utility functions
│   ├── ⚙️ config/              # Configuration files
│   │   └── database.js             # MongoDB connection setup
│   └── 🚀 app.js               # Express application setup and configuration
├── 📝 scripts/                # Database utilities and automation
│   └── seedData.js                 # Sample data generation and seeding
├── 🧪 tests/                  # Test suites
│   ├── integration/                # Integration tests
│   ├── unit/                      # Unit tests
│   └── fixtures/                  # Test data fixtures
├── 📚 docs/                   # API documentation
├── 📋 package.json            # Dependencies and scripts
└── 🌍 .env                    # Environment configuration
```

## 🌐 API Endpoints

### 🏷️ QR Code Management
| Method | Endpoint | Description | Auth | Parameters |
|--------|----------|-------------|------|------------|
| `GET` | `/api/qr` | Get all QR codes with filtering | ❌ | `page`, `limit`, `category`, `status`, `search` |
| `POST` | `/api/qr` | Create new QR code | ❌ | QR code data in request body |
| `GET` | `/api/qr/:id` | Get QR code by ID with statistics | ❌ | `id` - QR code identifier |
| `PUT` | `/api/qr/:id` | Update QR code details | ❌ | `id` + updated data in body |
| `DELETE` | `/api/qr/:id` | Delete QR code and associated transactions | ❌ | `id` - QR code identifier |
| `POST` | `/api/qr/:id/status` | Toggle QR code status (Active/Inactive) | ❌ | `id` - QR code identifier |
| `POST` | `/api/qr/:id/simulation` | Toggle simulation for QR code | ❌ | `id` - QR code identifier |
| `GET` | `/api/qr/:id/transactions` | Get transactions for specific QR code | ❌ | `id` + optional filters |

### 💳 Transaction Management
| Method | Endpoint | Description | Auth | Parameters |
|--------|----------|-------------|------|------------|
| `GET` | `/api/transactions` | Get all transactions with filtering | ❌ | `page`, `limit`, `qrId`, `status`, `startDate`, `endDate` |
| `POST` | `/api/transactions` | Create new transaction manually | ❌ | Transaction data in request body |
| `GET` | `/api/transactions/stats` | Get comprehensive transaction analytics | ❌ | Optional filter parameters |
| `POST` | `/api/transactions/simulate` | Simulate transactions for testing | ❌ | `qrId`, `count` (optional) |
| `DELETE` | `/api/transactions/:id` | Delete specific transaction | ❌ | `id` - payment ID |

### 🎮 Simulation Control
| Method | Endpoint | Description | Auth | Parameters |
|--------|----------|-------------|------|------------|
| `POST` | `/api/simulation/:qrId/toggle` | Toggle simulation for QR code | ❌ | `qrId` - QR code identifier |
| `POST` | `/api/simulation/:qrId/start` | Start simulation for QR code | ❌ | `qrId` - QR code identifier |
| `POST` | `/api/simulation/:qrId/stop` | Stop simulation for QR code | ❌ | `qrId` - QR code identifier |
| `GET` | `/api/simulation/status` | Get simulation status for all QR codes | ❌ | None |
| `POST` | `/api/simulation/stop-all` | Stop all running simulations | ❌ | None |

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **MongoDB**: v4.4 or higher ([Download](https://www.mongodb.com/try/download/community))
- **npm**: v8.0.0 or higher (comes with Node.js)

### ⚡ Quick Installation

1. **📂 Navigate to Backend Directory**:
   ```bash
   cd backend
   ```

2. **📦 Install Dependencies**:
   ```bash
   # Install production and development dependencies
   npm install
   ```

3. **⚙️ Environment Setup**:
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit environment variables
   nano .env  # or use your preferred editor
   ```

4. **🗄️ Database Setup**:
   ```bash
   # Start MongoDB service
   sudo systemctl start mongod  # Linux
   # OR
   brew services start mongodb-community  # macOS
   # OR
   net start MongoDB  # Windows (as administrator)
   ```

5. **🌱 Seed Sample Data** (Optional but recommended):
   ```bash
   npm run seed
   ```

6. **🚀 Start the Server**:
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # OR Production mode
   npm start
   ```

7. **✅ Verify Installation**:
   - API Health Check: http://localhost:5000/health
   - API Documentation: http://localhost:5000/api

### 🔧 Available Scripts

| Script | Description | Usage |
|--------|-------------|-------|
| `start` | Start production server | `npm start` |
| `dev` | Start development server with auto-reload | `npm run dev` |
| `test` | Run all tests | `npm test` |
| `test:watch` | Run tests in watch mode | `npm run test:watch` |
| `test:coverage` | Run tests with coverage report | `npm run test:coverage` |
| `seed` | Populate database with sample data | `npm run seed` |
| `migrate` | Run database migrations | `npm run migrate` |
| `lint` | Check code style and quality | `npm run lint` |
| `lint:fix` | Auto-fix linting issues | `npm run lint:fix` |

## 🌍 Environment Configuration

### 🔧 Environment Variables

#### **Development Configuration** (`.env`)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/sabpaisa-qr-dashboard

# CORS Configuration  
FRONTEND_URL=http://localhost:5173

# Security Configuration
JWT_SECRET=dev_jwt_secret_key_change_in_production

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100    # Max requests per window

# Simulation Service
SIMULATION_INTERVAL_MS=5000    # 5 seconds between transactions
MAX_TRANSACTIONS_PER_QR=100    # Maximum transactions per QR code

# Logging
LOG_LEVEL=debug
```

#### **Production Configuration**
```env
# Production optimized settings
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sabpaisa-qr-dashboard
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=super_secure_256_bit_production_key
RATE_LIMIT_WINDOW_MS=300000    # 5 minutes (stricter)
RATE_LIMIT_MAX_REQUESTS=50     # Lower limit for production
LOG_LEVEL=info
```

### 📊 Environment Variable Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | `5000` | ❌ |
| `NODE_ENV` | Environment mode | `development` | ❌ |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/sabpaisa-qr-dashboard` | ✅ |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` | ✅ |
| `JWT_SECRET` | JWT signing secret | - | ✅ |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` | ❌ |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` | ❌ |
| `SIMULATION_INTERVAL_MS` | Simulation interval | `5000` | ❌ |
| `MAX_TRANSACTIONS_PER_QR` | Max transactions per QR | `100` | ❌ |

## 🧪 Testing & Quality Assurance

### 🔍 Testing Framework
```bash
# Run all tests
npm test

# Run tests in watch mode for development
npm run test:watch

# Generate test coverage report
npm run test:coverage

# Run specific test file
npm test -- qrController.test.js
```

### 📋 Test Structure
```
tests/
├── unit/                    # Unit tests for individual functions
│   ├── controllers/         # Controller unit tests
│   ├── models/             # Model validation tests
│   ├── services/           # Service logic tests
│   └── utils/              # Utility function tests
├── integration/            # Integration tests for API endpoints
│   ├── qr.test.js          # QR code API tests
│   ├── transactions.test.js # Transaction API tests
│   └── simulation.test.js   # Simulation API tests
└── fixtures/               # Test data and mock objects
    ├── qrCodes.json        # Sample QR code data
    └── transactions.json    # Sample transaction data
```

### 🎯 Testing Best Practices
- **Unit Tests**: Test individual functions and modules in isolation
- **Integration Tests**: Test API endpoints with real database operations
- **Mocking**: Use MongoDB Memory Server for isolated testing
- **Coverage**: Maintain >80% test coverage for critical paths
- **Data Validation**: Test all input validation scenarios

### 📊 Code Quality
```bash
# Lint code for style and potential issues
npm run lint

# Auto-fix linting issues where possible
npm run lint:fix

# Check for security vulnerabilities
npm audit

# Fix security vulnerabilities
npm audit fix
```

## 🗄️ Database Design & Schema

### 📋 QR Code Schema
```javascript
const qrCodeSchema = new mongoose.Schema({
  qrId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: /^[A-Z0-9]{5}$/,     // 5-character alphanumeric
    index: true
  },
  vpa: {
    type: String,
    required: true,
    trim: true,
    validate: /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-_]{2,64}$/
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
    max: 100000                    // 1 lakh max limit
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
  timestamps: true,              // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
```

### 💳 Transaction Schema
```javascript
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
    index: true                    // Index for QR-based queries
  },
  amount: {
    type: Number,
    required: true,
    min: 1,                       // Minimum 1 rupee
    max: 100000                   // Maximum 1 lakh
  },
  status: {
    type: String,
    required: true,
    enum: ['Success', 'Failed', 'Pending'],
    index: true                   // Index for status filtering
  },
  utr: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: /^[A-Z0-9]{12}$/   // 12-character alphanumeric UTR
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true                   // Index for time-based queries
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
      validate: /^[0-9]{10}$/     // 10-digit phone number
    },
    upiApp: {
      type: String,
      required: true,
      enum: ['GPay', 'PhonePe', 'Paytm', 'BHIM', 'AmazonPay']
    }
  }
}, {
  timestamps: true
});
```

### 🔍 Database Indexes
```javascript
// QR Code Indexes for performance optimization
qrCodeSchema.index({ status: 1 });
qrCodeSchema.index({ category: 1 });
qrCodeSchema.index({ createdAt: -1 });
qrCodeSchema.index({ qrId: 1, status: 1 });

// Transaction Indexes for efficient querying
transactionSchema.index({ qrId: 1, timestamp: -1 });
transactionSchema.index({ status: 1, timestamp: -1 });
transactionSchema.index({ timestamp: -1 });
transactionSchema.index({ amount: 1 });
```

## 🔧 Advanced Features

### 🎮 Real-time Simulation Service

#### **SimulationService Class**
```javascript
class SimulationService {
  constructor() {
    this.activeSimulations = new Map();  // qrId -> intervalId
    this.isInitialized = false;
  }

  async initialize() {
    // Restore running simulations from database on startup
    const activeQRs = await QRCode.find({ 
      simulationActive: true, 
      status: 'Active' 
    });
    
    for (const qr of activeQRs) {
      this.startSimulation(qr.qrId);
    }
  }

  startSimulation(qrId) {
    // Generate transactions every 5 seconds
    const intervalId = setInterval(async () => {
      await this.generateTransaction(qrId);
    }, 5000);
    
    this.activeSimulations.set(qrId, intervalId);
  }

  async generateTransaction(qrId) {
    // Generate 1-3 realistic transactions per interval
    // 80% Success, 15% Failed, 5% Pending
    // Random customer data and amounts
  }
}
```

#### **Features**
- **Persistent State**: Resumes simulations after server restart
- **Rate Control**: Maximum 100 transactions per QR code
- **Realistic Data**: Indian names, phone numbers, UPI apps
- **Status Distribution**: Weighted random status assignment
- **Automatic Cleanup**: Stops simulation when limit reached

### 🛡️ Security Implementation

#### **Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,      // 15 minutes
  max: 100,                      // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);
```

#### **Input Validation**
```javascript
const validateQRCode = [
  body('qrId')
    .matches(/^[A-Z0-9]{5}$/)
    .withMessage('QR ID must be 5 characters, alphanumeric only'),
  body('vpa')
    .matches(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-_]{2,64}$/)
    .withMessage('Invalid UPI VPA format'),
  body('maxAmount')
    .isInt({ min: 0, max: 100000 })
    .withMessage('Amount must be between 0 and 100000'),
];
```

#### **Error Handling**
```javascript
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('API Error:', err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

## 📡 API Response Format & Examples

### 📊 Standard Response Structure

#### ✅ Success Response
```json
{
  "success": true,
  "data": {
    // Response data object or array
  },
  "message": "Operation completed successfully"
}
```

#### ❌ Error Response
```json
{
  "success": false,
  "error": "Detailed error message",
  "stack": "Error stack trace (development only)"
}
```

### 🔍 API Usage Examples

#### **Create QR Code**
```bash
POST /api/qr
Content-Type: application/json

{
  "qrId": "QR001",
  "vpa": "merchant@upi",
  "referenceName": "Main Store Counter",
  "description": "Primary payment counter",
  "maxAmount": 5000,
  "category": "Retail",
  "notes": "High volume counter"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qrId": "QR001",
    "vpa": "merchant@upi",
    "referenceName": "Main Store Counter",
    "description": "Primary payment counter",
    "maxAmount": 5000,
    "category": "Retail",
    "notes": "High volume counter",
    "status": "Active",
    "simulationActive": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "QR Code created successfully"
}
```

#### **Get Transactions with Filters**
```bash
GET /api/transactions?qrId=QR001&status=Success&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "paymentId": "PAY1705311000123",
        "qrId": "QR001",
        "amount": 250,
        "status": "Success",
        "utr": "ABC123XYZ789",
        "timestamp": "2024-01-15T10:30:00.000Z",
        "customerInfo": {
          "name": "Rahul Kumar",
          "phone": "9876543210",
          "upiApp": "GPay"
        }
      }
    ],
    "pagination": {
      "current": 1,
      "total": 5,
      "count": 10,
      "totalRecords": 45
    }
  }
}
```

#### **Start Simulation**
```bash
POST /api/simulation/QR001/start
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qrId": "QR001",
    "simulationActive": true,
    "message": "Simulation started for QR001"
  }
}
```

#### **Get Transaction Statistics**
```bash
GET /api/transactions/stats?qrId=QR001
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalTransactions": 150,
      "totalAmount": 125000,
      "successfulTransactions": 120,
      "failedTransactions": 25,
      "pendingTransactions": 5,
      "successRate": "80.00",
      "averageAmount": 833.33
    },
    "statusBreakdown": [
      { "_id": "Success", "count": 120, "totalAmount": 100000 },
      { "_id": "Failed", "count": 25, "totalAmount": 20000 },
      { "_id": "Pending", "count": 5, "totalAmount": 5000 }
    ],
    "dailyStats": [
      { "_id": "2024-01-15", "count": 25, "amount": 12500 },
      { "_id": "2024-01-14", "count": 30, "amount": 15000 }
    ]
  }
}
```

## 🚀 Deployment & Production

### 🐳 Docker Deployment

#### **Dockerfile**
```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeapp -u 1001

# Change ownership of the app directory
RUN chown -R nodeapp:nodejs /app
USER nodeapp

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["npm", "start"]
```

#### **Docker Compose**
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/sabpaisa-qr-dashboard
      - FRONTEND_URL=http://localhost:3000
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

volumes:
  mongo_data:
```

### ☁️ Cloud Deployment Options

#### **Railway Deployment**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway deploy
```

#### **Heroku Deployment**
```bash
# Install Heroku CLI and login
heroku login

# Create Heroku app
heroku create sabpaisa-qr-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_atlas_url
heroku config:set JWT_SECRET=your_secure_secret

# Deploy
git push heroku main
```

#### **PM2 Production Configuration**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'sabpaisa-qr-backend',
    script: 'src/app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### 📊 Monitoring & Logging

#### **Health Check Endpoint**
```javascript
// Health check implementation
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();
    
    // Check simulation service
    const stats = simulationService.getStats();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: 'connected',
      simulationService: {
        initialized: stats.isInitialized,
        activeSimulations: stats.activeSimulations
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

#### **Performance Monitoring**
```bash
# Install PM2 monitoring
pm2 install pm2-server-monit

# Monitor with PM2
pm2 monit

# View logs
pm2 logs sabpaisa-qr-backend

# Restart application
pm2 restart sabpaisa-qr-backend
```

## 🔧 Performance Optimization

### 📊 Database Optimization
- **Indexes**: Strategic indexing for frequent queries
- **Connection Pooling**: Optimized MongoDB connections
- **Query Optimization**: Efficient aggregation pipelines
- **Data Pagination**: Limit large result sets

### ⚡ API Performance
- **Compression**: Gzip compression for responses
- **Caching**: In-memory caching for frequently accessed data
- **Rate Limiting**: Prevent API abuse and ensure fair usage
- **Response Optimization**: Minimal response payloads

### 🎯 Production Best Practices
- **Environment Variables**: Secure configuration management
- **Error Logging**: Comprehensive error tracking
- **Security Headers**: Helmet.js for security headers
- **HTTPS**: SSL/TLS encryption in production
- **Process Management**: PM2 for process monitoring and restart

## 🤝 Contributing to Backend

### 📋 Development Guidelines
1. **Code Style**: Follow ESLint configuration
2. **Testing**: Write unit and integration tests
3. **Documentation**: Update API documentation
4. **Security**: Follow security best practices
5. **Performance**: Consider performance implications

### 🐛 Common Issues & Solutions

#### **MongoDB Connection Issues**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Restart MongoDB
sudo systemctl restart mongod

# Check connection string format
mongodb://localhost:27017/database_name
```

#### **CORS Errors**
```javascript
// Ensure proper CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

#### **Rate Limiting Blocks**
```bash
# Clear rate limit (if using Redis)
redis-cli FLUSHDB

# Or restart application to reset memory-based limits
pm2 restart sabpaisa-qr-backend
```

## 📚 Additional Resources

### 🔗 Documentation Links
- [Express.js Guide](https://expressjs.com/en/guide/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose ODM](https://mongoosejs.com/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### 🛠️ Development Tools
- [Postman Collection](./docs/postman-collection.json) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [PM2 Documentation](https://pm2.keymetrics.io/docs/) - Process management

---

<div align="center">

**Backend API built with ❤️ using Node.js & Express**

</div>
