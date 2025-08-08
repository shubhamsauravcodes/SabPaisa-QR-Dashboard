import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Transaction } from '../../types/index';
import { transactionApi } from '../../services/api';

interface TransactionStats {
  totalTransactions: number;
  totalAmount: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  successfulAmount: number;
  averageAmount: number;
  successRate: string;
}

interface TransactionsState {
  transactions: Transaction[];
  stats: TransactionStats | null;
  loading: boolean;
  statsLoading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  transactions: [],
  stats: null,
  loading: false,
  statsLoading: false,
  error: null,
};

// Helper function to convert date to string
const dateToString = (date: Date | string | undefined): string | undefined => {
  if (!date) return undefined;
  if (typeof date === 'string') return date;
  return (date as Date).toISOString();
};

// Helper function to normalize transaction timestamps
const normalizeTransaction = (transaction: Record<string, unknown>): Transaction => ({
  paymentId: (transaction.paymentId as string) || '',
  qrId: (transaction.qrId as string) || '',
  amount: (transaction.amount as number) || 0,
  status: (transaction.status as Transaction['status']) || 'Pending',
  utr: (transaction.utr as string) || '',
  timestamp: dateToString(transaction.timestamp as Date | string) || new Date().toISOString(),
  createdAt: dateToString(transaction.createdAt as Date | string),
  updatedAt: dateToString(transaction.updatedAt as Date | string),
  customerInfo: (transaction.customerInfo as Transaction['customerInfo']) || { name: '', phone: '', upiApp: '' },
});

// Helper function to normalize transaction arrays
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const normalizeTransactions = (transactions: any[]): Transaction[] => 
  transactions.map(normalizeTransaction);

// Thunks for async operations
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions', 
  async (params: { qrId?: string; status?: string; limit?: number; page?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await transactionApi.getAll(params);
      // Return the full response including pagination info
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTransactionStats = createAsyncThunk(
  'transactions/fetchStats', 
  async (params: { startDate?: string; endDate?: string; qrId?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await transactionApi.getStats(params);
      return response.data.summary;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const simulateTransactions = createAsyncThunk(
  'transactions/simulate', 
  async ({ qrId, count }: { qrId: string; count?: number }, { rejectWithValue }) => {
    try {
      const response = await transactionApi.simulate(qrId, count);
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

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
      // Extract transactions from the response
      const transactions = action.payload?.data?.transactions || [];
      state.transactions = Array.isArray(transactions) ? normalizeTransactions(transactions) : [];
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
      const normalizedTransactions = normalizeTransactions(action.payload || []);
      state.transactions.unshift(...normalizedTransactions);
    });
    builder.addCase(simulateTransactions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch transaction stats
    builder.addCase(fetchTransactionStats.pending, (state) => {
      state.statsLoading = true;
      state.error = null;
    });
    builder.addCase(fetchTransactionStats.fulfilled, (state, action) => {
      state.statsLoading = false;
      state.stats = action.payload;
    });
    builder.addCase(fetchTransactionStats.rejected, (state, action) => {
      state.statsLoading = false;
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
