/**
 * Safe hooks that ensure arrays are always returned from Redux state
 * This solves the "filter is not a function" errors globally
 */

import { useAppSelector } from './hooks';
import type { QRCode, Transaction } from '../types';

/**
 * Safe hook to get QR codes - always returns an array
 */
export const useSafeQRCodes = (): QRCode[] => {
  return useAppSelector((state) => {
    const qrCodes = state.qrCodes?.qrCodes;
    const result = Array.isArray(qrCodes) ? qrCodes : [];
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
    return Array.isArray(transactions) ? transactions : [];
  });
};

/**
 * Safe hook to get QR codes loading state
 */
export const useQRCodesLoading = (): boolean => {
  return useAppSelector((state) => state.qrCodes?.loading || false);
};

/**
 * Safe hook to get transactions loading state
 */
export const useTransactionsLoading = (): boolean => {
  return useAppSelector((state) => state.transactions?.loading || false);
};

/**
 * Safe hook to get QR codes error state
 */
export const useQRCodesError = (): string | null => {
  return useAppSelector((state) => state.qrCodes?.error || null);
};

/**
 * Safe hook to get transactions error state
 */
export const useTransactionsError = (): string | null => {
  return useAppSelector((state) => state.transactions?.error || null);
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
  const transactions = useSafeTransactions();
  
  return {
    total: transactions.length,
    successful: transactions.filter(txn => txn.status === 'Success').length,
    failed: transactions.filter(txn => txn.status === 'Failed').length,
    pending: transactions.filter(txn => txn.status === 'Pending').length,
    totalAmount: transactions.reduce((sum, txn) => sum + (txn.amount || 0), 0),
    successfulAmount: transactions
      .filter(txn => txn.status === 'Success')
      .reduce((sum, txn) => sum + (txn.amount || 0), 0),
  };
};
