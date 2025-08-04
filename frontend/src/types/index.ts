export interface QRCode {
  qrId: string;
  vpa: string;
  referenceName: string;
  description?: string;
  maxAmount?: number; // Changed from string to number to match backend
  category: 'Retail' | 'Rental' | 'Education' | 'Custom';
  notes?: string;
  status: 'Active' | 'Inactive';
  createdAt: string; // Changed from Date to string for serialization
  updatedAt?: string; // Changed from Date to string for serialization
  simulationActive: boolean;
}

export interface Transaction {
  paymentId: string;
  qrId: string;
  amount: number;
  status: 'Success' | 'Failed' | 'Pending';
  utr: string;
  timestamp: string; // Changed from Date to string for serialization
  createdAt?: string; // Add createdAt from MongoDB timestamps
  updatedAt?: string; // Add updatedAt from MongoDB timestamps
  customerInfo: {
    name: string;
    phone: string;
    upiApp: string;
  };
}
