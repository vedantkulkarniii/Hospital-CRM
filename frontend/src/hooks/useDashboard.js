import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setStats, setError, clearError, selectDashboardStats, selectDashboardLoading, selectDashboardError } from '../store/slices/dashboardSlice';
import dashboardService from '../services/dashboard.service';

/**
 * useDashboard hook
 * Fetches dashboard stats and manages loading/error states
 */
export function useDashboard() {
  const dispatch = useDispatch();
  const stats = useSelector(selectDashboardStats);
  const isLoading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);

  const fetchDashboardStats = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      const response = await dashboardService.getStats();
      
      // Extract stats from response
      const statsData = response.data || response.stats || response;
      dispatch(setStats(statsData));
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load dashboard stats';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchDashboardStats,
  };
}
