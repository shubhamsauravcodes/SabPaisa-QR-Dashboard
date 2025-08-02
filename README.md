
# SabPaisa QR Dashboard

A full-stack web application for managing and monitoring UPI QR codes and payment transactions. The application consists of a React frontend and Express.js backend with MongoDB for data persistence.

## 🚀 Features

### Frontend (React + TypeScript)
- **QR Code Management**: Generate and manage multiple UPI QR codes
- **Transaction Monitoring**: Real-time and historical payment tracking
- **Payment Simulation**: Demo payment flows for testing
- **Interactive Dashboard**: Stats, recent activity, and quick actions
- **Responsive UI**: Modern, mobile-friendly interface

### Backend (Express.js + MongoDB)
- **RESTful APIs**: Complete CRUD operations for QR codes and transactions
- **Data Validation**: Comprehensive input validation and sanitization
- **Security**: CORS, Helmet, Rate limiting, and security best practices
- **Database Integration**: MongoDB with Mongoose ODM
- **Error Handling**: Centralized error management

## 🏗️ Architecture

```
SabPaisa-QR-Dashboard/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── store/          # Redux state management
│   │   ├── types/          # TypeScript definitions
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── README.md
├── backend/                  # Express.js API server
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── config/         # Configuration
│   ├── scripts/            # Database seeding & utilities
│   ├── package.json
│   └── README.md
└── package.json             # Workspace configuration
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **QR Generation**: react-qr-code, qrcode.react
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Joi, Express Validator
- **Testing**: Jest, Supertest

### Development Tools
- **Process Management**: PM2 (production)
- **Development**: Nodemon for auto-restart
- **Testing**: Jest & Supertest

## 🚀 Quick Start

1. **Prerequisites:**
   - Node.js 18+
   - MongoDB 4.4+
   - npm 8+

2. **Install dependencies:**
   ```bash
   npm install
   npm run install:all
   ```

3. **Set up environment:**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

4. **Start MongoDB:**
   ```bash
   mongod
   ```

5. **Start development servers:**
   ```bash
   npm run dev
   ```

6. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📚 API Documentation

### QR Code Endpoints
```
GET    /api/qr                    # Get all QR codes
POST   /api/qr                    # Create new QR code
GET    /api/qr/:id                # Get QR code by ID
PUT    /api/qr/:id                # Update QR code
DELETE /api/qr/:id                # Delete QR code
GET    /api/qr/:id/transactions   # Get transactions for QR code
```

### Transaction Endpoints
```
GET    /api/transactions          # Get all transactions
POST   /api/transactions          # Create new transaction
GET    /api/transactions/stats    # Get transaction statistics
POST   /api/transactions/simulate # Simulate transaction
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Test specific services
npm run test:frontend
npm run test:backend
```

## 🏗️ Development

### Project Scripts
```bash
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend
npm run build            # Build both services
npm run seed             # Seed database with test data
```

### Environment Variables

#### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sabpaisa_qr_dashboard
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secret_key
```

## 🗄️ Database Setup

### Local MongoDB Setup
1. Install MongoDB Community Edition
2. Start MongoDB service: `mongod`
3. The application will automatically connect to `mongodb://localhost:27017/sabpaisa_qr_dashboard`

### Seed Test Data
```bash
cd backend
npm run seed  # Populates database with sample QR codes and transactions
```

## 📊 Database Schema

### QR Code Collection
```javascript
{
  qrId: String (unique),
  vpa: String (UPI address),
  referenceName: String,
  category: String,
  status: String,
  simulationActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Collection
```javascript
{
  paymentId: String (unique),
  qrId: String,
  amount: Number,
  status: String,
  utr: String,
  timestamp: Date,
  customerInfo: {
    name: String,
    phone: String,
    upiApp: String
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

ISC License - This project is for demonstration and internal use.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
