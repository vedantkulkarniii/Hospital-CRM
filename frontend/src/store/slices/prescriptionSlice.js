import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  prescriptions: [],
  selectedPrescription: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
};

const prescriptionSlice = createSlice({
  name: 'prescription',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setPrescriptions(state, action) {
      state.prescriptions = action.payload;
    },
    setPagination(state, action) {
      state.pagination = action.payload;
    },
    setSelectedPrescription(state, action) {
      state.selectedPrescription = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError(state) {
      state.error = null;
    },
    addPrescription(state, action) {
      state.prescriptions.push(action.payload);
    },
    updatePrescriptionInList(state, action) {
      const index = state.prescriptions.findIndex((rx) => rx._id === action.payload._id);
      if (index !== -1) {
        state.prescriptions[index] = action.payload;
      }
    },
    removePrescriptionFromList(state, action) {
      state.prescriptions = state.prescriptions.filter((rx) => rx._id !== action.payload);
    },
    resetPrescriptionsState() {
      return initialState;
    },
  },
});

export const {
  setLoading,
  setPrescriptions,
  setPagination,
  setSelectedPrescription,
  setError,
  clearError,
  addPrescription,
  updatePrescriptionInList,
  removePrescriptionFromList,
  resetPrescriptionsState,
} = prescriptionSlice.actions;

export const selectPrescriptions = (state) => state.prescription.prescriptions;
export const selectSelectedPrescription = (state) => state.prescription.selectedPrescription;
export const selectPrescriptionsLoading = (state) => state.prescription.isLoading;
export const selectPrescriptionsError = (state) => state.prescription.error;
export const selectPrescriptionsPagination = (state) => state.prescription.pagination;

export default prescriptionSlice.reducer;
