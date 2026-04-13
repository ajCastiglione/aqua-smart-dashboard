import { useQuery } from '@tanstack/react-query'
import { fetchCustomerRowMetrics } from '../../utils/customer-row-metrics'
import { queryKeys } from './query-keys'

/** Single-customer convenience hook (same cache key as list `useQueries`). The list page calls `fetchCustomerRowMetrics` inside `useQueries` instead to batch many rows. */
export const useCustomerRowMetrics = (customerNumber: string | undefined) =>
  useQuery({
    queryKey: queryKeys.customerRowMetrics(customerNumber ?? ''),
    queryFn: () => fetchCustomerRowMetrics(customerNumber!),
    enabled: Boolean(customerNumber),
  })
