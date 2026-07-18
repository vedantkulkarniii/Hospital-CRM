import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PropTypes from 'prop-types';

/**
 * React Query Configuration
 * Centralizes query caching, synchronization, and error handling
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long until a query is considered stale (in milliseconds)
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Cache time: how long to keep unused data in cache
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly known as cacheTime)
      
      // Retry failed requests
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Don't refetch on window focus by default
      refetchOnWindowFocus: false,
      
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
      
      // Don't refetch on reconnect by default
      refetchOnReconnect: false,
      
      // Enable suspense mode for easier loading states
      suspense: false,
    },
    
    mutations: {
      // Retry failed mutations once
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

/**
 * Query Client Provider Component
 * Wraps the entire app to provide React Query functionality
 * 
 * @component
 */
export default function QueryClientProviderComponent({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

QueryClientProviderComponent.propTypes = {
  children: PropTypes.node.isRequired,
};

export { queryClient };
