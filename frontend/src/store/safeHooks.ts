/**
 * Safe hooks that ensure arrays are always returned from Redux state
 * This solves the "filter is not a function" errors globally
 */

import { useAppSelector } from './hooks';
import type { QRCode, Transaction } from '../types/index';

/**
 * Safe hook to get QR codes - always returns an array
 */
export const useSafeQRCodes = (): QRCode[] => {
  return useAppSelector((state) => {
    const qrCodes = state.qrCodes?.qrCodes;
    const result: QRCode[] = Array.isArray(qrCodes) ? qrCodes : [];
    console.log('📱 useSafeQRCodes: Returning', result.length, 'QR codes');
    result.forEach((qr, index) => {
      console.log(`Hook QR ${index + 1}:`, {
        qrId: qr.qrId,
        referenceName: qr.referenceName,
        status: qr.status,
        category: qr.category
      });
    });
    return result;
  });
};

/**
 * Safe hook to get transactions - always returns an array
 */
export const useSafeTransactions = (): Transaction[] => {
  return useAppSelector((state) => {
    const transactions = state.transactions?.transactions;
    const result: Transaction[] = Array.isArray(transactions) ? transactions : [];
    return result;
  });
};

/**
 * Safe hook to get QR codes loading state
 */
export const useQRCodesLoading = (): boolean => {
  return useAppSelector((state) => {
    const loading = state.qrCodes?.loading;
    return typeof loading === 'boolean' ? loading : false;
  });
};

/**
 * Safe hook to get transactions loading state
 */
export const useTransactionsLoading = (): boolean => {
  return useAppSelector((state) => {
    const loading = state.transactions?.loading;
    return typeof loading === 'boolean' ? loading : false;
  });
};

/**
 * Safe hook to get QR codes error state
 */
export const useQRCodesError = (): string | null => {
  return useAppSelector((state) => {
    const error = state.qrCodes?.error;
    return typeof error === 'string' ? error : null;
  });
};

/**
 * Safe hook to get transactions error state
 */
export const useTransactionsError = (): string | null => {
  return useAppSelector((state) => {
    const error = state.transactions?.error;
    return typeof error === 'string' ? error : null;
  });
};

/**
 * Safe hook to get filtered QR codes based on criteria
 */
export const useFilteredQRCodes = (filters: {
  id?: string;
  name?: string;
  category?: string;
  status?: string;
}): QRCode[] => {
  const qrCodes = useSafeQRCodes();
  
  return qrCodes.filter((qr) => {
    const matchesId = !filters.id || qr.qrId.toLowerCase().includes(filters.id.toLowerCase());
    const matchesName = !filters.name || qr.referenceName.toLowerCase().includes(filters.name.toLowerCase());
    const matchesCategory = !filters.category || qr.category === filters.category;
    const matchesStatus = !filters.status || qr.status === filters.status;
    
    return matchesId && matchesName && matchesCategory && matchesStatus;
  });
};

/**
 * Safe hook to get QR codes statistics
 */
export const useQRCodesStats = () => {
  const qrCodes = useSafeQRCodes();
  
  return {
    total: qrCodes.length,
    active: qrCodes.filter(qr => qr.status === 'Active').length,
    inactive: qrCodes.filter(qr => qr.status === 'Inactive').length,
    withSimulation: qrCodes.filter(qr => qr.simulationActive).length,
  };
};

/**
 * Safe hook to get transactions statistics
 */
export const useTransactionsStats = () => {
  return useAppSelector((state) => state.transactions.stats || {
    totalTransactions: 0,
    totalAmount: 0,
    successfulTransactions: 0,
    failedTransactions: 0,
    pendingTransactions: 0,
    successfulAmount: 0,
    averageAmount: 0,
    successRate: '0.00',
  });
};
