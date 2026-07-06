import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  doctors: [],
  selectedDoctor: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setDoctors(state, action) {
      state.doctors = action.payload;
    },
    setPagination(state, action) {
      state.pagination = action.payload;
    },
    setSelectedDoctor(state, action) {
      state.selectedDoctor = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError(state) {
      state.error = null;
    },
    resetDoctorsState() {
      return initialState;
    },
  },
});

export const {
  setLoading,
  setDoctors,
  setPagination,
  setSelectedDoctor,
  setError,
  clearError,
  resetDoctorsState,
} = doctorSlice.actions;

export const selectDoctors = (state) => state.doctor.doctors;
export const selectSelectedDoctor = (state) => state.doctor.selectedDoctor;
export const selectDoctorsLoading = (state) => state.doctor.isLoading;
export const selectDoctorsError = (state) => state.doctor.error;
export const selectDoctorsPagination = (state) => state.doctor.pagination;

export default doctorSlice.reducer;
