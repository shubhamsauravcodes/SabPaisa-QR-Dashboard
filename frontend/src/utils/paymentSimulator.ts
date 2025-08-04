import type { Transaction } from '../types';

const upiApps = ['GPay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay'];
const customerNames = ['Rahul Kumar', 'Priya Sharma', 'Amit Patel', 'Neha Singh', 'Rajesh Verma', 'Sita Devi', 'Mohan Das', 'Kavita Roy'];
const phonePrefixes = ['91', '92', '93', '94', '95', '96', '97', '98', '99'];

export function generateUTR(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let utr = '';
  for (let i = 0; i < 12; i++) {
    utr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return utr;
}

export function generatePaymentId(): string {
  return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}

export function generateRandomAmount(maxAmount?: string): number {
  const max = maxAmount ? parseInt(maxAmount) : 10000;
  const min = 10;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateCustomerInfo() {
  const name = customerNames[Math.floor(Math.random() * customerNames.length)];
  const phonePrefix = phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)];
  const phoneSuffix = Math.floor(Math.random() * 90000000) + 10000000;
  const upiApp = upiApps[Math.floor(Math.random() * upiApps.length)];
  
  return {
    name,
    phone: `${phonePrefix}${phoneSuffix}`,
    upiApp
  };
}

export function simulatePayment(qrId: string, maxAmount?: string): Transaction {
  const amount = generateRandomAmount(maxAmount);
  const status = Math.random() > 0.1 ? 'Success' : 'Failed'; // 90% success rate
  
  return {
    paymentId: generatePaymentId(),
    qrId,
    amount,
    status,
    utr: generateUTR(),
    timestamp: new Date().toISOString(),
    customerInfo: generateCustomerInfo()
  };
} 