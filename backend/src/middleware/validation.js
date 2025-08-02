const { body, validationResult } = require('express-validator');

// Helper function to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// QR Code validation rules
const validateQRCode = [
  body('vpa')
    .notEmpty()
    .withMessage('VPA is required')
    .matches(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-_]{2,64}$/)
    .withMessage('Invalid UPI VPA format'),
  
  body('referenceName')
    .notEmpty()
    .withMessage('Reference name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Reference name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Description must not exceed 255 characters'),
  
  body('maxAmount')
    .optional()
    .isFloat({ min: 0, max: 100000 })
    .withMessage('Max amount must be between 0 and 100000'),
  
  body('category')
    .optional()
    .isIn(['Retail', 'Rental', 'Education', 'Custom'])
    .withMessage('Category must be one of: Retail, Rental, Education, Custom'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters'),
  
  handleValidationErrors
];

// QR Code update validation (all fields optional)
const validateQRUpdate = [
  body('vpa')
    .optional()
    .matches(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-_]{2,64}$/)
    .withMessage('Invalid UPI VPA format'),
  
  body('referenceName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Reference name must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Description must not exceed 255 characters'),
  
  body('maxAmount')
    .optional()
    .isFloat({ min: 0, max: 100000 })
    .withMessage('Max amount must be between 0 and 100000'),
  
  body('category')
    .optional()
    .isIn(['Retail', 'Rental', 'Education', 'Custom'])
    .withMessage('Category must be one of: Retail, Rental, Education, Custom'),
  
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Notes must not exceed 500 characters'),
  
  handleValidationErrors
];

// Transaction validation rules
const validateTransaction = [
  body('qrId')
    .notEmpty()
    .withMessage('QR ID is required')
    .isLength({ min: 5, max: 50 })
    .withMessage('QR ID must be between 5 and 50 characters'),
  
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01, max: 100000 })
    .withMessage('Amount must be between 0.01 and 100000'),
  
  body('status')
    .optional()
    .isIn(['Success', 'Failed', 'Pending'])
    .withMessage('Status must be one of: Success, Failed, Pending'),
  
  body('customerInfo.name')
    .notEmpty()
    .withMessage('Customer name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Customer name must be between 2 and 100 characters'),
  
  body('customerInfo.phone')
    .notEmpty()
    .withMessage('Customer phone is required')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Invalid Indian mobile number format'),
  
  body('customerInfo.upiApp')
    .notEmpty()
    .withMessage('UPI app is required')
    .isIn(['GPay', 'PhonePe', 'Paytm', 'BHIM', 'AmazonPay', 'WhatsApp', 'Other'])
    .withMessage('Invalid UPI app'),
  
  handleValidationErrors
];

// Transaction update validation (only status)
const validateTransactionUpdate = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['Success', 'Failed', 'Pending'])
    .withMessage('Status must be one of: Success, Failed, Pending'),
  
  handleValidationErrors
];

// Simulation validation rules
const validateSimulation = [
  body('qrId')
    .notEmpty()
    .withMessage('QR ID is required')
    .isLength({ min: 5, max: 50 })
    .withMessage('QR ID must be between 5 and 50 characters'),
  
  body('count')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Count must be between 1 and 100'),
  
  handleValidationErrors
];

module.exports = {
  validateQRCode,
  validateQRUpdate,
  validateTransaction,
  validateTransactionUpdate,
  validateSimulation
};
