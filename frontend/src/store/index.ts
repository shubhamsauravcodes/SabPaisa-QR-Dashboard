import { configureStore } from '@reduxjs/toolkit';
import qrCodesReducer from './slices/qrCodesSlice';
import transactionsReducer from './slices/transactionsSlice';

// Create a middleware to ensure arrays are always properly initialized
const ensureArraysMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  
  // Ensure qrCodes is always an array
  if (!Array.isArray(state.qrCodes?.qrCodes)) {
    store.dispatch({ type: 'qrCodes/clearQRCodes' });
  }
  
  // Ensure transactions is always an array
  if (!Array.isArray(state.transactions?.transactions)) {
    store.dispatch({ type: 'transactions/clearTransactions' });
  }
  
  return result;
};

export const store = configureStore({
  reducer: {
    qrCodes: qrCodesReducer,
    transactions: transactionsReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in the state
        ignoredPaths: [
          'qrCodes.qrCodes.createdAt',
          'qrCodes.qrCodes.updatedAt',
          'transactions.transactions.timestamp',
          'transactions.transactions.createdAt',
          'transactions.transactions.updatedAt'
        ],
        // Ignore these action types
        ignoredActionsPaths: [
          'payload.createdAt',
          'payload.updatedAt',
          'payload.timestamp',
          'payload.data.createdAt',
          'payload.data.updatedAt',
          'payload.data.timestamp'
        ],
      },
    }).concat(ensureArraysMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 