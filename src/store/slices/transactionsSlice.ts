import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Transaction } from '../../types/index';

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // Add a new transaction
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload); // Add to beginning for newest first
    },

    // Add multiple transactions
    addTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions.unshift(...action.payload);
    },

    // Update a transaction
    updateTransaction: (state, action: PayloadAction<{ id: string; transaction: Partial<Transaction> }>) => {
      const { id, transaction } = action.payload;
      const index = state.transactions.findIndex(t => t.paymentId === id);
      if (index !== -1) {
        state.transactions[index] = { ...state.transactions[index], ...transaction };
      }
    },

    // Delete a transaction
    deleteTransaction: (state, action: PayloadAction<string>) => {
      const paymentId = action.payload;
      state.transactions = state.transactions.filter(t => t.paymentId !== paymentId);
    },

    // Delete transactions for a specific QR
    deleteTransactionsForQR: (state, action: PayloadAction<string>) => {
      const qrId = action.payload;
      state.transactions = state.transactions.filter(t => t.qrId !== qrId);
    },

    // Clear all transactions
    clearTransactions: (state) => {
      state.transactions = [];
    },

    // Replace all transactions
    replaceTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Bulk add transactions (for simulation)
    bulkAddTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions.unshift(...action.payload);
    },
  },
});

export const {
  addTransaction,
  addTransactions,
  updateTransaction,
  deleteTransaction,
  deleteTransactionsForQR,
  clearTransactions,
  replaceTransactions,
  setLoading,
  setError,
  bulkAddTransactions,
} = transactionsSlice.actions;

export default transactionsSlice.reducer; 