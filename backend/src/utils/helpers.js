/**
 * Utility helper functions
 */

/**
 * Generate unique ID with prefix
 * @param {string} prefix - Prefix for the ID
 * @param {number} length - Length of random part
 * @returns {string} Generated ID
 */
const generateUniqueId = (prefix = '', length = 8) => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  return `${prefix}${timestamp}${randomStr}`;
};

/**
 * Generate random UTR (Unique Transaction Reference)
 * @returns {string} 12-character UTR
 */
const generateUTR = () => {
  return Math.random().toString(36).substring(2, 14).toUpperCase();
};

/**
 * Generate random Indian mobile number
 * @returns {string} 10-digit mobile number
 */
const generateRandomMobile = () => {
  const firstDigit = Math.floor(Math.random() * 3) + 7; // 7, 8, or 9
  const remainingDigits = Math.floor(Math.random() * 1000000000)
    .toString()
    .padStart(9, '0');
  return `${firstDigit}${remainingDigits}`;
};

/**
 * Get random element from array
 * @param {Array} array - Source array
 * @returns {*} Random element
 */
const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Generate random amount within range
 * @param {number} min - Minimum amount
 * @param {number} max - Maximum amount
 * @returns {number} Random amount
 */
const generateRandomAmount = (min = 1, max = 1000) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount, currency = '₹') => {
  return `${currency}${amount.toLocaleString('en-IN')}`;
};

/**
 * Calculate success rate percentage
 * @param {number} successful - Number of successful transactions
 * @param {number} total - Total number of transactions
 * @returns {string} Success rate percentage
 */
const calculateSuccessRate = (successful, total) => {
  if (total === 0) return '0.00';
  return ((successful / total) * 100).toFixed(2);
};

/**
 * Validate UPI VPA format
 * @param {string} vpa - UPI VPA to validate
 * @returns {boolean} True if valid VPA
 */
const isValidUPI = (vpa) => {
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-_]{2,64}$/;
  return upiRegex.test(vpa);
};

/**
 * Validate Indian mobile number
 * @param {string} mobile - Mobile number to validate
 * @returns {boolean} True if valid mobile number
 */
const isValidMobile = (mobile) => {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

/**
 * Generate pagination metadata
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {Object} Pagination metadata
 */
const getPaginationMeta = (page, limit, total) => {
  return {
    current: parseInt(page),
    limit: parseInt(limit),
    total: Math.ceil(total / limit),
    totalRecords: total,
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1
  };
};

/**
 * Sleep function for delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generate test customer data
 * @returns {Object} Customer info object
 */
const generateTestCustomer = () => {
  const names = [
    'Rahul Kumar', 'Priya Sharma', 'Amit Singh', 'Neha Gupta', 
    'Ravi Patel', 'Sunita Devi', 'Vikash Kumar', 'Pooja Singh',
    'Suresh Yadav', 'Anjali Mishra', 'Deepak Joshi', 'Kavita Nair'
  ];
  
  const upiApps = ['GPay', 'PhonePe', 'Paytm', 'BHIM', 'AmazonPay', 'WhatsApp'];
  
  return {
    name: getRandomElement(names),
    phone: generateRandomMobile(),
    upiApp: getRandomElement(upiApps)
  };
};

/**
 * Generate test transaction status with realistic distribution
 * @returns {string} Transaction status
 */
const generateTransactionStatus = () => {
  const statuses = [
    'Success', 'Success', 'Success', 'Success', 'Success', // 50% success rate
    'Success', 'Success', 'Success', // Additional success for 80% total
    'Failed', 'Pending' // 10% failed, 10% pending
  ];
  return getRandomElement(statuses);
};

module.exports = {
  generateUniqueId,
  generateUTR,
  generateRandomMobile,
  getRandomElement,
  generateRandomAmount,
  formatCurrency,
  calculateSuccessRate,
  isValidUPI,
  isValidMobile,
  getPaginationMeta,
  sleep,
  generateTestCustomer,
  generateTransactionStatus
};
