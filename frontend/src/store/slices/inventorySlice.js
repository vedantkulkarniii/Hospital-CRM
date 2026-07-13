import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  currentItem: null,
  lowStockItems: [],
  outOfStockItems: [],
  expiringItems: [],
  expiredItems: [],
  stats: {
    totalItems: 0,
    totalQuantity: 0,
    totalValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  },
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  filters: {
    search: '',
    category: '',
    status: '',
  },
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    // Fetch items
    fetchItemsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchItemsSuccess: (state, action) => {
      state.items = action.payload.data || [];
      state.pagination = {
        page: action.payload.pagination?.page || 1,
        limit: action.payload.pagination?.limit || 10,
        total: action.payload.pagination?.total || 0,
      };
      state.loading = false;
    },
    fetchItemsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch single item
    fetchItemStart: (state) => {
      state.loading = true;
    },
    fetchItemSuccess: (state, action) => {
      state.currentItem = action.payload;
      state.loading = false;
    },
    fetchItemFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create item
    createItemStart: (state) => {
      state.loading = true;
    },
    createItemSuccess: (state, action) => {
      state.items.unshift(action.payload);
      state.pagination.total += 1;
      state.loading = false;
    },
    createItemFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update item
    updateItemStart: (state) => {
      state.loading = true;
    },
    updateItemSuccess: (state, action) => {
      const index = state.items.findIndex((i) => i._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.currentItem?._id === action.payload._id) {
        state.currentItem = action.payload;
      }
      state.loading = false;
    },
    updateItemFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete item
    deleteItemStart: (state) => {
      state.loading = true;
    },
    deleteItemSuccess: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload._id);
      state.pagination.total -= 1;
      state.loading = false;
    },
    deleteItemFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch alerts
    fetchAlertsStart: (state) => {
      state.loading = true;
    },
    fetchAlertsSuccess: (state, action) => {
      state.lowStockItems = action.payload.lowStock || [];
      state.outOfStockItems = action.payload.outOfStock || [];
      state.expiringItems = action.payload.expiring || [];
      state.expiredItems = action.payload.expired || [];
      state.loading = false;
    },
    fetchAlertsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch stats
    fetchStatsStart: (state) => {
      state.loading = true;
    },
    fetchStatsSuccess: (state, action) => {
      state.stats = action.payload || initialState.stats;
      state.loading = false;
    },
    fetchStatsFailure: (state, action) => {
      state.error = action.payload;
    },

    // Update filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },

    // Update pagination
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Clear current item
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchItemsStart,
  fetchItemsSuccess,
  fetchItemsFailure,
  fetchItemStart,
  fetchItemSuccess,
  fetchItemFailure,
  createItemStart,
  createItemSuccess,
  createItemFailure,
  updateItemStart,
  updateItemSuccess,
  updateItemFailure,
  deleteItemStart,
  deleteItemSuccess,
  deleteItemFailure,
  fetchAlertsStart,
  fetchAlertsSuccess,
  fetchAlertsFailure,
  fetchStatsStart,
  fetchStatsSuccess,
  fetchStatsFailure,
  setFilters,
  setPagination,
  clearCurrentItem,
  clearError,
} = inventorySlice.actions;

export default inventorySlice.reducer;
