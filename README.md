
# 🏦 SabPaisa QR Dashboard

A comprehensive full-stack web application for managing and monitoring UPI QR codes with real-time payment transaction simulation. Built with modern technologies and enterprise-grade features for seamless UPI payment management.

## ✨ Key Features

### 🎯 QR Code Management
- **Dynamic QR Generation**: Create custom QR codes with 5-character alphanumeric identifiers
- **Smart Validation**: Real-time validation with format checking and duplicate prevention
- **Category-based Organization**: Retail, Rental, Education, and Custom categories
- **Status Management**: Active/Inactive toggle with automatic simulation control
- **Bulk Operations**: Edit, delete, and manage multiple QR codes efficiently

### 💳 Transaction Processing
- **Real-time Simulation**: Automated payment simulation with configurable intervals
- **Transaction Monitoring**: Live tracking of payment status (Success/Failed/Pending)
- **Advanced Analytics**: Comprehensive transaction statistics and reporting
- **Customer Data**: Detailed customer information with UPI app tracking
- **Historical Data**: 30-day transaction history with filtering capabilities

### 📊 Interactive Dashboard
- **Live Statistics**: Real-time QR code and transaction metrics
- **Visual Analytics**: Transaction status breakdown and performance indicators
- **Quick Actions**: One-click QR generation, simulation control, and status management
- **Responsive Design**: Mobile-first approach with modern UI/UX

### 🔧 Technical Excellence
- **RESTful API Architecture**: Standardized endpoints with comprehensive error handling
- **Real-time Simulation Service**: Background service for payment generation
- **Advanced Security**: CORS, Helmet, rate limiting, and input validation
- **Database Optimization**: Indexed MongoDB collections with efficient queries
- **State Management**: Redux Toolkit for predictable state updates

## 🏗️ Project Architecture

```
SabPaisa-QR-Dashboard/
├── 🎨 frontend/                 # React TypeScript SPA
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Dashboard.tsx   # Main dashboard with analytics
│   │   │   ├── QRGenerationModal.tsx  # QR creation/editing
│   │   │   ├── QRCodeCard.tsx  # QR display with PDF export
│   │   │   ├── PaymentFeed.tsx # Real-time transaction feed
│   │   │   └── Header.tsx      # Navigation component
│   │   ├── pages/             # Application pages
│   │   │   ├── GeneratedQRPage.tsx    # QR management interface
│   │   │   └── TransactionsPage.tsx   # Transaction analytics
│   │   ├── store/             # Redux state management
│   │   │   ├── slices/        # Feature-based state slices
│   │   │   └── hooks.ts       # Typed Redux hooks
│   │   ├── services/          # API communication layer
│   │   │   └── api.ts         # Centralized API endpoints
│   │   ├── types/             # TypeScript definitions
│   │   └── utils/             # Utility functions
│   │       ├── paymentSimulator.ts  # Payment simulation logic
│   │       └── dateUtils.ts    # Date formatting utilities
│   └── package.json
├── ⚙️ backend/                  # Express.js API server
│   ├── src/
│   │   ├── controllers/       # Request handlers & business logic
│   │   │   ├── qrController.js        # QR CRUD operations
│   │   │   └── transactionController.js # Transaction management
│   │   ├── models/            # MongoDB Mongoose schemas
│   │   │   ├── QRCode.js      # QR code data model
│   │   │   └── Transaction.js  # Transaction data model
│   │   ├── routes/            # API route definitions
│   │   │   ├── qr.js          # QR code endpoints
│   │   │   ├── transactions.js # Transaction endpoints
│   │   │   └── simulation.js   # Simulation control endpoints
│   │   ├── services/          # Business logic services
│   │   │   └── simulationService.js  # Real-time payment simulation
│   │   ├── middleware/        # Custom middleware
│   │   │   ├── errorHandler.js # Centralized error handling
│   │   │   └── validation.js   # Request validation
│   │   ├── utils/             # Helper functions
│   │   │   └── helpers.js     # Utility functions
│   │   ├── config/            # Configuration files
│   │   │   └── database.js    # MongoDB connection
│   │   └── app.js             # Express app setup
│   ├── scripts/               # Database utilities
│   │   └── seedData.js        # Sample data generation
│   ├── tests/                 # Test suites
│   └── package.json
└── 📋 docs/                    # Project documentation
```

## 🛠️ Technology Stack

### Frontend Technologies
- **⚛️ React 19**: Latest React with concurrent features
- **📘 TypeScript**: Type-safe development with strict mode
- **⚡ Vite**: Ultra-fast build tool with HMR
- **🔄 Redux Toolkit**: Predictable state management
- **🎨 Modern CSS**: Custom styling with responsive design
- **📱 QR Generation**: react-qr-code & qrcode.react libraries
- **🌐 HTTP Client**: Axios with interceptors and error handling
- **📄 PDF Export**: jsPDF with html2canvas for QR downloads
- **🧭 Routing**: React Router DOM v7

### Backend Technologies
- **🚀 Node.js 18+**: Latest LTS runtime environment
- **🌐 Express.js**: Fast, minimalist web framework
- **🗄️ MongoDB**: NoSQL database with Mongoose ODM
- **🔒 Security Stack**: Helmet, CORS, Rate Limiting
- **✅ Validation**: Joi & Express Validator
- **🧪 Testing**: Jest & Supertest for comprehensive testing
- **📊 Process Management**: PM2 for production deployment
- **🔄 Development**: Nodemon for auto-restart during development

### DevOps & Tools
- **📦 Package Management**: npm with workspace support
- **🔧 Code Quality**: ESLint with TypeScript support
- **🚀 Development**: Concurrent dev servers with hot reload
- **📋 Environment**: dotenv for configuration management

## 🚀 Quick Start Guide

### 📋 Prerequisites
- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **React**: v19.0.0 or higher (installed via npm)
- **MongoDB**: v4.4 or higher ([Download](https://www.mongodb.com/try/download/community))
- **npm**: v8.0.0 or higher (comes with Node.js)
- **Git**: For version control

### ⚡ Installation Steps

1. **📥 Clone the Repository**:
   ```bash
   git clone https://github.com/shubhamsauravcodes/SabPaisa-QR-Dashboard.git
   cd SabPaisa-QR-Dashboard
   ```

2. **📦 Install Dependencies**:
   ```bash
   # Install workspace dependencies
   npm install
   
   # Install all project dependencies
   npm run install:all
   ```

3. **⚙️ Environment Configuration**:
   ```bash
   # Copy environment template
   cp backend/.env.example backend/.env
   
   # Edit backend/.env with your configuration
   nano backend/.env  # or use your preferred editor
   ```

4. **🗄️ Database Setup**:
   ```bash
   # Start MongoDB service
   sudo systemctl start mongod  # Linux
   # OR
   brew services start mongodb-community  # macOS
   # OR
   net start MongoDB  # Windows (as administrator)
   
   # Seed sample data (optional but recommended)
   cd backend
   npm run seed
   cd ..
   ```

5. **🚀 Start Development Servers**:
   ```bash
   # Start both frontend and backend concurrently
   npm run dev
   
   # OR start them separately:
   npm run dev:backend   # Backend on http://localhost:5000
   npm run dev:frontend  # Frontend on http://localhost:5173
   ```

6. **🌐 Access the Application**:
   - **Frontend Dashboard**: http://localhost:5173
   - **Backend API**: http://localhost:5000
   - **API Health Check**: http://localhost:5000/health

### 🎯 First Steps After Setup

1. **Create Your First QR Code**:
   - Click "Generate New QR" button
   - Fill in the required details
   - Choose a category (Retail/Rental/Education/Custom)
   - Set maximum transaction amount

2. **Start Payment Simulation**:
   - Toggle the "Start" button for any QR code
   - Watch real-time transactions appear
   - Monitor transaction statistics

3. **Explore Features**:
   - View transaction history
   - Download QR codes as PDF
   - Use filtering and search options
   - Monitor real-time analytics

## 📚 API Documentation

### 🏷️ QR Code Management Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/api/qr` | Get all QR codes with filtering | `page`, `limit`, `category`, `status`, `search` |
| `POST` | `/api/qr` | Create new QR code | QR code data in request body |
| `GET` | `/api/qr/:id` | Get QR code by ID with stats | `id` - QR code identifier |
| `PUT` | `/api/qr/:id` | Update QR code details | `id` + updated data in body |
| `DELETE` | `/api/qr/:id` | Delete QR code and transactions | `id` - QR code identifier |
| `POST` | `/api/qr/:id/status` | Toggle QR code status | `id` - QR code identifier |
| `GET` | `/api/qr/:id/transactions` | Get transactions for QR code | `id` + optional filters |

### 💳 Transaction Management Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/api/transactions` | Get all transactions | `page`, `limit`, `qrId`, `status`, `startDate`, `endDate` |
| `POST` | `/api/transactions` | Create new transaction | Transaction data in request body |
| `GET` | `/api/transactions/stats` | Get transaction analytics | Optional filters |
| `POST` | `/api/transactions/simulate` | Simulate transactions | `qrId`, `count` (optional) |
| `DELETE` | `/api/transactions/:id` | Delete specific transaction | `id` - payment ID |

### 🎮 Simulation Control Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `POST` | `/api/simulation/:qrId/toggle` | Toggle simulation for QR code | `qrId` - QR code identifier |
| `POST` | `/api/simulation/:qrId/start` | Start simulation for QR code | `qrId` - QR code identifier |
| `POST` | `/api/simulation/:qrId/stop` | Stop simulation for QR code | `qrId` - QR code identifier |
| `GET` | `/api/simulation/status` | Get simulation status for all QRs | None |
| `POST` | `/api/simulation/stop-all` | Stop all running simulations | None |

### 📊 Response Format

#### ✅ Success Response
```json
{
  "success": true,
  "data": {
    // Response data object
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

### 🔧 Development & Testing

#### 🧪 Running Tests
```bash
# Run all tests
npm run test

# Frontend tests
npm run test:frontend

# Backend tests  
npm run test:backend

# Test with coverage
npm run test:coverage
```

#### 🛠️ Development Commands
```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production servers
npm run start

# Database operations
npm run seed              # Populate with sample data
npm run migrate           # Run database migrations

# Code quality
npm run lint              # Check code style
npm run lint:fix          # Fix auto-fixable issues
```

#### 📋 Project Scripts Overview
| Script | Description | Usage |
|--------|-------------|-------|
| `dev` | Start both frontend and backend in development | `npm run dev` |
| `dev:frontend` | Start only frontend development server | `npm run dev:frontend` |
| `dev:backend` | Start only backend development server | `npm run dev:backend` |
| `build` | Build both frontend and backend for production | `npm run build` |
| `start` | Start production servers | `npm run start` |
| `test` | Run all test suites | `npm run test` |
| `seed` | Populate database with sample data | `npm run seed` |
| `install:all` | Install dependencies for all workspaces | `npm run install:all` |

### 🌍 Environment Configuration

#### Backend Environment Variables (`backend/.env`)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/sabpaisa-qr-dashboard

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Security (generate secure values for production)
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100  # Max requests per window

# Simulation Service
SIMULATION_INTERVAL_MS=5000  # 5 seconds between transactions
MAX_TRANSACTIONS_PER_QR=100  # Maximum transactions per QR code
```

#### Production Environment Setup
```env
# Production optimized settings
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sabpaisa-qr-dashboard
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=your_production_jwt_secret_key_256_bit_length
```

## �️ Database Schema & Design

### 📋 QR Code Collection
```javascript
{
  qrId: String (unique, 5-char alphanumeric),
  vpa: String (UPI address, validated format),
  referenceName: String (display name, max 100 chars),
  description: String (optional, max 255 chars),
  maxAmount: Number (0-100000, transaction limit),
  category: String (Retail|Rental|Education|Custom),
  notes: String (optional, max 500 chars),
  status: String (Active|Inactive),
  simulationActive: Boolean (simulation state),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-updated)
}
```

### 💳 Transaction Collection
```javascript
{
  paymentId: String (unique identifier),
  qrId: String (references QR code),
  amount: Number (transaction amount),
  status: String (Success|Failed|Pending),
  utr: String (unique transaction reference),
  timestamp: Date (transaction time),
  customerInfo: {
    name: String (customer name),
    phone: String (mobile number),
    upiApp: String (payment app used)
  },
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-updated)
}
```

### 🔍 Database Indexes
```javascript
// QR Code Indexes
{ qrId: 1 }              // Primary lookup
{ status: 1 }            // Status filtering
{ category: 1 }          // Category filtering
{ createdAt: -1 }        // Recent first sorting
{ qrId: 1, status: 1 }   // Compound index

// Transaction Indexes
{ paymentId: 1 }         // Primary lookup
{ qrId: 1 }             // QR-based filtering
{ timestamp: -1 }        // Recent first sorting
{ status: 1 }           // Status filtering
{ qrId: 1, timestamp: -1 } // Compound index
```

## 🚀 Deployment Guide

### 🐳 Docker Deployment
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### ☁️ Cloud Deployment Options

#### **Vercel (Frontend)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod
```

#### **Railway/Heroku (Backend)**
```bash
# Add Procfile
echo "web: npm start" > Procfile

# Deploy to Railway
railway login
railway deploy
```

#### **MongoDB Atlas (Database)**
1. Create MongoDB Atlas cluster
2. Get connection string
3. Update MONGODB_URI in environment variables

### 🔄 CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy SabPaisa QR Dashboard
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: echo "Deploy steps here"
```

## 🎯 Key Features Showcase

### 🔥 Real-time Payment Simulation
- **Intelligent Transaction Generation**: Automated creation of realistic payment transactions
- **Configurable Intervals**: Transactions generated every 5 seconds for active QR codes
- **Smart Rate Control**: Maximum 100 transactions per QR code with automatic stopping
- **Status Distribution**: 80% Success, 15% Failed, 5% Pending for realistic testing
- **Customer Data Simulation**: Random Indian names, phone numbers, and UPI apps

### � Advanced QR Code Management
- **5-Character Unique IDs**: Alphanumeric format with letter+number validation
- **Category-based Organization**: Retail, Rental, Education, Custom categories
- **Smart Status Control**: Inactive QR codes automatically stop simulations
- **PDF Export**: High-quality QR code downloads with complete information
- **Bulk Operations**: Efficient management of multiple QR codes

### 📊 Analytics & Reporting
- **Real-time Dashboard**: Live statistics and transaction monitoring
- **Advanced Filtering**: Search by ID, name, category, status, date ranges
- **Transaction Analytics**: Success rates, amount distributions, time-based analysis
- **Visual Indicators**: Color-coded status indicators and progress bars

### 🔐 Security & Performance
- **Input Validation**: Comprehensive validation with Joi and Express Validator
- **Rate Limiting**: API protection against abuse and DDoS attacks
- **CORS Security**: Proper cross-origin resource sharing configuration
- **Error Handling**: Centralized error management with detailed logging
- **Database Optimization**: Indexed queries for fast data retrieval

## 🤝 Contributing Guidelines

### 📋 Development Workflow
1. **Fork the repository** on GitHub
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper testing
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request** with detailed description

### 🧪 Code Quality Standards
- **TypeScript**: Use strict type checking
- **ESLint**: Follow established linting rules
- **Testing**: Write unit and integration tests
- **Documentation**: Update relevant documentation
- **Security**: Follow security best practices

### 🐛 Bug Reports
Use GitHub Issues with the following template:
- **Description**: Clear description of the bug
- **Steps to Reproduce**: Detailed reproduction steps
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, Node.js version, browser details

### 💡 Feature Requests
- **Use Case**: Describe the problem you're solving
- **Proposed Solution**: Your suggested approach
- **Alternatives**: Other solutions you've considered
- **Additional Context**: Any other relevant information

## 📄 License & Legal

### 📜 License Information
This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

### ⚖️ Terms of Use
- This application is designed for **demonstration and educational purposes**
- **Not intended for production payment processing** without proper security audits
- Users are responsible for compliance with local financial regulations
- The simulation feature is for testing purposes only

### 🔒 Privacy & Data Protection
- No real payment data is processed or stored
- All simulated transactions use fake customer information
- MongoDB data is stored locally unless configured otherwise
- Users should implement proper data protection measures for production use

## 🆘 Support & Community

### 📞 Getting Help
- **GitHub Issues**: For bug reports and feature requests
- **Documentation**: Comprehensive guides in the `/docs` folder
- **Code Examples**: Check the `/examples` directory for usage patterns

### 🌟 Show Your Support
If this project helped you, please consider:
- ⭐ Starring the repository
- 🐛 Reporting issues you find
- 💡 Suggesting new features
- 🤝 Contributing code improvements
- 📢 Sharing with others

### 🚀 What's Next?
- **v2.0 Roadmap**: Enhanced analytics dashboard
- **Mobile App**: React Native companion app
- **Real Payment Integration**: Actual UPI gateway integration
- **Multi-tenant Support**: Support for multiple organizations
- **Advanced Reporting**: Export capabilities and scheduled reports

---

<div align="center">

### 🎉 Thank you for using SabPaisa QR Dashboard!

**Built with ❤️ by [Shubham Saurav](https://github.com/shubhamsauravcodes)**

[![GitHub stars](https://img.shields.io/github/stars/shubhamsauravcodes/SabPaisa-QR-Dashboard?style=social)](https://github.com/shubhamsauravcodes/SabPaisa-QR-Dashboard/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/shubhamsauravcodes/SabPaisa-QR-Dashboard?style=social)](https://github.com/shubhamsauravcodes/SabPaisa-QR-Dashboard/network/members)
[![GitHub issues](https://img.shields.io/github/issues/shubhamsauravcodes/SabPaisa-QR-Dashboard)](https://github.com/shubhamsauravcodes/SabPaisa-QR-Dashboard/issues)

</div>
