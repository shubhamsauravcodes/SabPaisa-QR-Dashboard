# SabPaisa QR Dashboard - Backend API

REST API backend service for the SabPaisa QR Dashboard application, built with Express.js and MongoDB.

## Features

- **QR Code Management**: Create, read, update, delete QR codes
- **Transaction Tracking**: Monitor payment transactions
- **Payment Simulation**: Simulate UPI payment flows
- **RESTful API**: Standard HTTP methods and status codes
- **Data Validation**: Comprehensive input validation
- **Error Handling**: Centralized error management
- **Security**: CORS, Helmet, Rate limiting
- **MongoDB Integration**: Mongoose ODM with optimized schemas

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Joi, Express Validator
- **Testing**: Jest, Supertest

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/         # MongoDB/Mongoose models
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Utility functions
│   ├── config/         # Configuration files
│   └── app.js          # Main application file
├── tests/              # Test files
├── docs/               # API documentation
├── scripts/            # Utility scripts
└── package.json
```

## API Endpoints

### QR Codes
- `GET /api/qr` - Get all QR codes
- `POST /api/qr` - Create new QR code
- `GET /api/qr/:id` - Get QR code by ID
- `PUT /api/qr/:id` - Update QR code
- `DELETE /api/qr/:id` - Delete QR code
- `PATCH /api/qr/:id/status` - Toggle QR code status
- `PATCH /api/qr/:id/simulation` - Toggle simulation
- `GET /api/qr/:id/transactions` - Get transactions for QR code

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/stats` - Get transaction statistics
- `POST /api/transactions/simulate` - Simulate transaction

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 4.4+
- npm 8+

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

4. **Run the application**:
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Verify installation**:
   Visit `http://localhost:5000/health`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/sabpaisa_qr_dashboard` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `JWT_SECRET` | JWT signing secret | `required` |

## Development

### Running Tests
```bash
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage
```

### Code Quality
```bash
npm run lint           # Check code style
npm run lint:fix       # Fix code style issues
```

### Database Seeding
```bash
npm run seed           # Populate database with sample data
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "stack": "Error stack (development only)"
}
```

## Database Schema

### QR Code
```javascript
{
  qrId: String (unique),
  vpa: String (UPI address),
  referenceName: String,
  description: String,
  maxAmount: Number,
  category: String,
  notes: String,
  status: String (Active/Inactive),
  simulationActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction
```javascript
{
  paymentId: String (unique),
  qrId: String,
  amount: Number,
  status: String (Success/Failed/Pending),
  utr: String (unique),
  timestamp: Date,
  customerInfo: {
    name: String,
    phone: String,
    upiApp: String
  }
}
```

## License

ISC License - See LICENSE file for details
