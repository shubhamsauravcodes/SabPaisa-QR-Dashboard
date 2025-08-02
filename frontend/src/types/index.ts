export interface QRCode {
  qrId: string;
  vpa: string;
  referenceName: string;
  description?: string;
  maxAmount?: number; // Changed from string to number to match backend
  category: 'Retail' | 'Rental' | 'Education' | 'Custom';
  notes?: string;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt?: Date; // Added updatedAt from backend
  simulationActive: boolean;
}

export interface Transaction {
  paymentId: string;
  qrId: string;
  amount: number;
  status: 'Success' | 'Failed' | 'Pending';
  utr: string;
  timestamp: Date;
  customerInfo: {
    name: string;
    phone: string;
    upiApp: string;
  };
} 