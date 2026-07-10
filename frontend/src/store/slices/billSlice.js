import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bills: [],
  currentBill: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  filters: {
    search: '',
    status: '',
    patient: '',
  },
  stats: {
    totalBills: 0,
    totalRevenue: 0,
    totalPaid: 0,
    totalPending: 0,
    paidCount: 0,
    pendingCount: 0,
    overdueCount: 0,
    partialCount: 0,
  },
};

const billSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    // Fetch bills
    fetchBillsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBillsSuccess: (state, action) => {
      state.bills = action.payload.data || [];
      state.pagination = {
        page: action.payload.pagination?.page || 1,
        limit: action.payload.pagination?.limit || 10,
        total: action.payload.pagination?.total || 0,
      };
      state.loading = false;
      state.error = null;
    },
    fetchBillsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch single bill
    fetchBillStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBillSuccess: (state, action) => {
      state.currentBill = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchBillFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create bill
    createBillStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createBillSuccess: (state, action) => {
      state.bills.unshift(action.payload);
      state.pagination.total += 1;
      state.loading = false;
      state.error = null;
    },
    createBillFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update bill
    updateBillStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateBillSuccess: (state, action) => {
      const index = state.bills.findIndex((bill) => bill._id === action.payload._id);
      if (index !== -1) {
        state.bills[index] = action.payload;
      }
      if (state.currentBill?._id === action.payload._id) {
        state.currentBill = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    updateBillFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update bill payment
    updatePaymentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updatePaymentSuccess: (state, action) => {
      const index = state.bills.findIndex((bill) => bill._id === action.payload._id);
      if (index !== -1) {
        state.bills[index] = action.payload;
      }
      if (state.currentBill?._id === action.payload._id) {
        state.currentBill = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    updatePaymentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete bill
    deleteBillStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteBillSuccess: (state, action) => {
      state.bills = state.bills.filter((bill) => bill._id !== action.payload._id);
      state.pagination.total -= 1;
      state.loading = false;
      state.error = null;
    },
    deleteBillFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch billing stats
    fetchStatsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchStatsSuccess: (state, action) => {
      state.stats = action.payload || initialState.stats;
      state.loading = false;
      state.error = null;
    },
    fetchStatsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },

    // Update pagination
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Clear current bill
    clearCurrentBill: (state) => {
      state.currentBill = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchBillsStart,
  fetchBillsSuccess,
  fetchBillsFailure,
  fetchBillStart,
  fetchBillSuccess,
  fetchBillFailure,
  createBillStart,
  createBillSuccess,
  createBillFailure,
  updateBillStart,
  updateBillSuccess,
  updateBillFailure,
  updatePaymentStart,
  updatePaymentSuccess,
  updatePaymentFailure,
  deleteBillStart,
  deleteBillSuccess,
  deleteBillFailure,
  fetchStatsStart,
  fetchStatsSuccess,
  fetchStatsFailure,
  setFilters,
  setPagination,
  clearCurrentBill,
  clearError,
} = billSlice.actions;

export default billSlice.reducer;
