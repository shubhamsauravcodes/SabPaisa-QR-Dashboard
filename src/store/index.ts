import { configureStore } from '@reduxjs/toolkit';
import qrCodesReducer from './slices/qrCodesSlice';
import transactionsReducer from './slices/transactionsSlice';

export const store = configureStore({
  reducer: {
    qrCodes: qrCodesReducer,
    transactions: transactionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 