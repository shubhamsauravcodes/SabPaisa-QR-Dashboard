import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { QRCode } from '../../types/index';
import { qrApi } from '../../services/api';

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

// Thunks for async operations
export const fetchQRCodes = createAsyncThunk('qrCodes/fetchQRCodes', async (_, { rejectWithValue }) => {
  try {
    const response = await qrApi.getAll();
    // Ensure we always return an array
    const qrCodes = response.data?.qrCodes || response.data || [];
    return Array.isArray(qrCodes) ? qrCodes : [];
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return rejectWithValue(errorMessage);
  }
});

export const createNewQRCode = createAsyncThunk('qrCodes/createQRCode', async (qrData: Omit<QRCode, 'qrId' | 'createdAt' | 'simulationActive' | 'status'>, { rejectWithValue }) => {
  try {
    const response = await qrApi.create(qrData);
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return rejectWithValue(errorMessage);
  }
});

export const updateQRCodeDetails = createAsyncThunk('qrCodes/updateQRCode', async ({ qrId, qrData }: { qrId: string, qrData: Partial<QRCode> }, { rejectWithValue }) => {
  try {
    const response = await qrApi.update(qrId, qrData);
    return { qrId, qrData: response.data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return rejectWithValue(errorMessage);
  }
});

export const deleteQRCodeById = createAsyncThunk('qrCodes/deleteQRCode', async (qrId: string, { rejectWithValue }) => {
  try {
    await qrApi.delete(qrId);
    return qrId;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return rejectWithValue(errorMessage);
  }
});

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
      console.log('🔄 Redux: replaceQRCodes called with payload:', action.payload);
      if (Array.isArray(action.payload)) {
        state.qrCodes = action.payload;
        console.log('✅ Redux: QR codes updated, new count:', action.payload.length);
        // Log details of each QR code being stored
        action.payload.forEach((qr, index) => {
          console.log(`Redux QR ${index + 1}:`, {
            qrId: qr.qrId,
            referenceName: qr.referenceName,
            status: qr.status,
            category: qr.category
          });
        });
      } else {
        console.warn('❌ Redux: replaceQRCodes action payload is not an array:', action.payload);
        state.qrCodes = [];
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch QR codes
    builder.addCase(fetchQRCodes.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchQRCodes.fulfilled, (state, action) => {
      state.loading = false;
      // Ensure payload is always an array
      state.qrCodes = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(fetchQRCodes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create QR code
    builder.addCase(createNewQRCode.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createNewQRCode.fulfilled, (state, action) => {
      state.loading = false;
      // Ensure qrCodes is an array before pushing
      if (!Array.isArray(state.qrCodes)) {
        state.qrCodes = [];
      }
      state.qrCodes.push(action.payload);
    });
    builder.addCase(createNewQRCode.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update QR code
    builder.addCase(updateQRCodeDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateQRCodeDetails.fulfilled, (state, action) => {
      state.loading = false;
      const { qrId, qrData } = action.payload;
      const index = state.qrCodes.findIndex(qr => qr.qrId === qrId);
      if (index !== -1) {
        state.qrCodes[index] = qrData;
      }
    });
    builder.addCase(updateQRCodeDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete QR code
    builder.addCase(deleteQRCodeById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteQRCodeById.fulfilled, (state, action) => {
      state.loading = false;
      state.qrCodes = state.qrCodes.filter(qr => qr.qrId !== action.payload);
    });
    builder.addCase(deleteQRCodeById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
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