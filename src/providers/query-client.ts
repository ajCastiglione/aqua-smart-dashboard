import { QueryClient } from '@tanstack/react-query'

/**
 * List row metrics (`customerRowMetrics` key) and detail telemetry (`customerPressure`, etc.) are
 * separate caches — navigating list → detail refetches the same endpoints (acceptable for a
 * prototype; could seed detail from `getQueryData(customerRowMetrics)` if payloads matched).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
