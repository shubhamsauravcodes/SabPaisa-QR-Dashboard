export interface QRCode {
  qrId: string;
  vpa: string;
  referenceName: string;
  description?: string;
  maxAmount?: string;
  category: string;
  notes?: string;
  status: string;
  createdAt: Date;
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