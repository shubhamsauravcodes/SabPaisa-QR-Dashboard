import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Transaction } from '../../types/index';
import { transactionApi } from '../../services/api';

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

// Thunks for async operations
export const fetchTransactions = createAsyncThunk('transactions/fetchTransactions', async (params?: { qrId?: string; status?: string; limit?: number }, { rejectWithValue }) => {
  try {
    const response = await transactionApi.getAll(params);
    // Ensure we always return an array
    const transactions = response.data?.transactions || response.data || [];
    return Array.isArray(transactions) ? transactions : [];
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const simulateTransactions = createAsyncThunk('transactions/simulate', async ({ qrId, count }: { qrId: string; count?: number }, { rejectWithValue }) => {
  try {
    const response = await transactionApi.simulate(qrId, count);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    // Add a new transaction
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      // Ensure transactions is an array before unshifting
      if (!Array.isArray(state.transactions)) {
        state.transactions = [];
      }
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
  extraReducers: (builder) => {
    // Fetch transactions
    builder.addCase(fetchTransactions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTransactions.fulfilled, (state, action) => {
      state.loading = false;
      // Ensure payload is always an array
      state.transactions = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(fetchTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Simulate transactions
    builder.addCase(simulateTransactions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(simulateTransactions.fulfilled, (state, action) => {
      state.loading = false;
      state.transactions.unshift(...action.payload);
    });
    builder.addCase(simulateTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
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