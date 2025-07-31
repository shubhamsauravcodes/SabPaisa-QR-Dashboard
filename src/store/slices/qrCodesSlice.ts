import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { QRCode } from '../../types/index';

interface QRCodesState {
  qrCodes: QRCode[];
  loading: boolean;
  error: string | null;
}

const initialState: QRCodesState = {
  qrCodes: [],
  loading: false,
  error: null,
};

const qrCodesSlice = createSlice({
  name: 'qrCodes',
  initialState,
  reducers: {
    // Add a new QR code
    addQRCode: (state, action: PayloadAction<QRCode>) => {
      state.qrCodes.push(action.payload);
    },

    // Update an existing QR code
    updateQRCode: (state, action: PayloadAction<{ index: number; qrCode: Partial<QRCode> }>) => {
      const { index, qrCode } = action.payload;
      if (index >= 0 && index < state.qrCodes.length) {
        state.qrCodes[index] = { ...state.qrCodes[index], ...qrCode };
      }
    },

    // Delete a QR code
    deleteQRCode: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.qrCodes.length) {
        state.qrCodes.splice(index, 1);
      }
    },

    // Toggle QR code status
    toggleQRStatus: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.qrCodes.length) {
        const currentStatus = state.qrCodes[index].status;
        state.qrCodes[index].status = currentStatus === 'Active' ? 'Inactive' : 'Active';
      }
    },

    // Toggle simulation for a QR code
    toggleSimulation: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.qrCodes.length) {
        state.qrCodes[index].simulationActive = !state.qrCodes[index].simulationActive;
      }
    },

    // Set simulation status for a QR code
    setSimulationStatus: (state, action: PayloadAction<{ index: number; active: boolean }>) => {
      const { index, active } = action.payload;
      if (index >= 0 && index < state.qrCodes.length) {
        state.qrCodes[index].simulationActive = active;
      }
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Clear all QR codes
    clearQRCodes: (state) => {
      state.qrCodes = [];
    },

    // Replace all QR codes (for bulk operations)
    replaceQRCodes: (state, action: PayloadAction<QRCode[]>) => {
      state.qrCodes = action.payload;
    },
  },
});

export const {
  addQRCode,
  updateQRCode,
  deleteQRCode,
  toggleQRStatus,
  toggleSimulation,
  setSimulationStatus,
  setLoading,
  setError,
  clearQRCodes,
  replaceQRCodes,
} = qrCodesSlice.actions;

export default qrCodesSlice.reducer; 