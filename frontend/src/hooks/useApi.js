import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import toast from 'react-hot-toast';

/**
 * Generic query hook for GET requests
 * @param {string} queryKey - Unique key for caching
 * @param {function} queryFn - Async function to fetch data
 * @param {object} options - React Query options
 */
export const useGenericQuery = (queryKey, queryFn, options = {}) => {
  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
};

/**
 * Fetch patients with pagination, search, and filtering
 * @param {object} params - { page, limit, search, bloodGroup, ...filters }
 */
export const usePatients = (params = {}) => {
  return useQuery({
    queryKey: ['patients', params],
    queryFn: async () => {
      const response = await api.get('/api/patients', { params });
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Fetch single patient by ID
 * @param {string} patientId - Patient ID
 */
export const usePatientById = (patientId) => {
  return useQuery({
    queryKey: ['patients', patientId],
    queryFn: async () => {
      const response = await api.get(`/api/patients/${patientId}`);
      return response.data.data;
    },
    enabled: !!patientId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch dashboard statistics
 */
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await api.get('/api/dashboard/stats');
      return response.data.data;
    },
    staleTime: 3 * 60 * 1000, // 3 minutes (refresh more frequently)
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
  });
};

/**
 * Fetch appointments
 * @param {object} params - { page, limit, status, date, ...filters }
 */
export const useAppointments = (params = {}) => {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: async () => {
      const response = await api.get('/api/appointments', { params });
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch single appointment by ID
 * @param {string} appointmentId - Appointment ID
 */
export const useAppointmentById = (appointmentId) => {
  return useQuery({
    queryKey: ['appointments', appointmentId],
    queryFn: async () => {
      const response = await api.get(`/api/appointments/${appointmentId}`);
      return response.data.data;
    },
    enabled: !!appointmentId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch doctors
 * @param {object} params - { page, limit, specialization, ...filters }
 */
export const useDoctors = (params = {}) => {
  return useQuery({
    queryKey: ['doctors', params],
    queryFn: async () => {
      const response = await api.get('/api/doctors', { params });
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch single doctor by ID
 * @param {string} doctorId - Doctor ID
 */
export const useDoctorById = (doctorId) => {
  return useQuery({
    queryKey: ['doctors', doctorId],
    queryFn: async () => {
      const response = await api.get(`/api/doctors/${doctorId}`);
      return response.data.data;
    },
    enabled: !!doctorId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch bills
 * @param {object} params - { page, limit, status, ...filters }
 */
export const useBills = (params = {}) => {
  return useQuery({
    queryKey: ['bills', params],
    queryFn: async () => {
      const response = await api.get('/api/bills', { params });
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch single bill by ID
 * @param {string} billId - Bill ID
 */
export const useBillById = (billId) => {
  return useQuery({
    queryKey: ['bills', billId],
    queryFn: async () => {
      const response = await api.get(`/api/bills/${billId}`);
      return response.data.data;
    },
    enabled: !!billId,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch prescriptions
 * @param {object} params - { page, limit, ...filters }
 */
export const usePrescriptions = (params = {}) => {
  return useQuery({
    queryKey: ['prescriptions', params],
    queryFn: async () => {
      const response = await api.get('/api/prescriptions', { params });
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch notifications
 * @param {object} params - { page, limit, isRead, type }
 */
export const useNotifications = (params = {}) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const response = await api.get('/api/notifications', { params });
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000, // Shorter stale time for notifications
    refetchInterval: 2 * 60 * 1000, // Auto-refetch more frequently
  });
};

/**
 * Generic mutation hook for POST/PUT/DELETE requests
 * @param {function} mutationFn - Async function to execute
 * @param {object} options - React Query mutation options
 */
export const useApiMutation = (mutationFn, options = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn,
    onSuccess: (data, variables, context) => {
      // Invalidate related queries on success
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }
      
      // Show success message
      if (options.successMessage) {
        toast.success(options.successMessage);
      }
      
      // Call custom onSuccess if provided
      if (options.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      toast.error(errorMessage);
      
      // Call custom onError if provided
      if (options.onError) {
        options.onError(error);
      }
    },
  });
};

/**
 * Create patient mutation
 */
export const useCreatePatient = (options = {}) => {
  return useApiMutation(
    (patientData) => api.post('/api/patients', patientData),
    {
      invalidateQueries: [['patients']],
      successMessage: 'Patient created successfully',
      ...options,
    }
  );
};

/**
 * Update patient mutation
 */
export const useUpdatePatient = (patientId, options = {}) => {
  return useApiMutation(
    (patientData) => api.put(`/api/patients/${patientId}`, patientData),
    {
      invalidateQueries: [['patients'], ['patients', patientId]],
      successMessage: 'Patient updated successfully',
      ...options,
    }
  );
};

/**
 * Delete patient mutation
 */
export const useDeletePatient = (patientId, options = {}) => {
  return useApiMutation(
    () => api.delete(`/api/patients/${patientId}`),
    {
      invalidateQueries: [['patients']],
      successMessage: 'Patient deleted successfully',
      ...options,
    }
  );
};

/**
 * Create appointment mutation
 */
export const useCreateAppointment = (options = {}) => {
  return useApiMutation(
    (appointmentData) => api.post('/api/appointments', appointmentData),
    {
      invalidateQueries: [['appointments'], ['dashboard', 'stats']],
      successMessage: 'Appointment booked successfully',
      ...options,
    }
  );
};

/**
 * Update appointment mutation
 */
export const useUpdateAppointment = (appointmentId, options = {}) => {
  return useApiMutation(
    (appointmentData) => api.put(`/api/appointments/${appointmentId}`, appointmentData),
    {
      invalidateQueries: [['appointments'], ['appointments', appointmentId], ['dashboard', 'stats']],
      successMessage: 'Appointment updated successfully',
      ...options,
    }
  );
};

/**
 * Cancel appointment mutation
 */
export const useCancelAppointment = (appointmentId, options = {}) => {
  return useApiMutation(
    () => api.delete(`/api/appointments/${appointmentId}`),
    {
      invalidateQueries: [['appointments'], ['dashboard', 'stats']],
      successMessage: 'Appointment cancelled successfully',
      ...options,
    }
  );
};
