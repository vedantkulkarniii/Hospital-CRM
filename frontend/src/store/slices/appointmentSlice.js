import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointments: [],
  selectedAppointment: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
  todayAppointments: [],
  todayCount: 0,
};

const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setAppointments(state, action) {
      state.appointments = action.payload;
    },
    setPagination(state, action) {
      state.pagination = action.payload;
    },
    setSelectedAppointment(state, action) {
      state.selectedAppointment = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError(state) {
      state.error = null;
    },
    setTodayAppointments(state, action) {
      state.todayAppointments = action.payload;
      state.todayCount = action.payload.length;
    },
    addAppointment(state, action) {
      state.appointments.push(action.payload);
    },
    updateAppointmentInList(state, action) {
      const index = state.appointments.findIndex((apt) => apt._id === action.payload._id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    removeAppointmentFromList(state, action) {
      state.appointments = state.appointments.filter((apt) => apt._id !== action.payload);
    },
    resetAppointmentsState() {
      return initialState;
    },
  },
});

export const {
  setLoading,
  setAppointments,
  setPagination,
  setSelectedAppointment,
  setError,
  clearError,
  setTodayAppointments,
  addAppointment,
  updateAppointmentInList,
  removeAppointmentFromList,
  resetAppointmentsState,
} = appointmentSlice.actions;

export const selectAppointments = (state) => state.appointment.appointments;
export const selectSelectedAppointment = (state) => state.appointment.selectedAppointment;
export const selectAppointmentsLoading = (state) => state.appointment.isLoading;
export const selectAppointmentsError = (state) => state.appointment.error;
export const selectAppointmentsPagination = (state) => state.appointment.pagination;
export const selectTodayAppointments = (state) => state.appointment.todayAppointments;
export const selectTodayCount = (state) => state.appointment.todayCount;

export default appointmentSlice.reducer;
