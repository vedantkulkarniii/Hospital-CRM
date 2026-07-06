import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  patients: [],
  selectedPatient: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setPatients(state, action) {
      state.patients = action.payload;
    },
    setPagination(state, action) {
      state.pagination = action.payload;
    },
    setSelectedPatient(state, action) {
      state.selectedPatient = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError(state) {
      state.error = null;
    },
    resetPatientsState() {
      return initialState;
    },
  },
});

export const {
  setLoading,
  setPatients,
  setPagination,
  setSelectedPatient,
  setError,
  clearError,
  resetPatientsState,
} = patientSlice.actions;

// Selectors
export const selectPatients = (state) => state.patient.patients;
export const selectSelectedPatient = (state) => state.patient.selectedPatient;
export const selectPatientsLoading = (state) => state.patient.isLoading;
export const selectPatientsError = (state) => state.patient.error;
export const selectPatientsPagination = (state) => state.patient.pagination;

export default patientSlice.reducer;
