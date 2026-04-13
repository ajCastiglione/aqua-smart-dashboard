import { useQuery } from '@tanstack/react-query'
import {
  getCustomerAlerts,
  getCustomerAlertsForCustomer,
} from '../../api/endpoints/customer-alerts'
import type { CustomerAlertsListParams } from '../../api/endpoints/customer-alerts'
import { queryKeys } from './query-keys'

export const useCustomerAlerts = (params: CustomerAlertsListParams = {}) => {
  const page = params.page ?? 1
  const perPage = params.per_page ?? 25
  return useQuery({
    queryKey: ['customerAlertsList', { page, perPage, customer_number: params.customer_number }],
    queryFn: () => getCustomerAlerts({ ...params, page, per_page: perPage }),
  })
}

export const useCustomerAlertsByCustomer = (customerNumber: string | undefined) =>
  useQuery({
    queryKey: queryKeys.customerAlerts(customerNumber ?? ''),
    queryFn: () => getCustomerAlertsForCustomer(customerNumber!),
    enabled: Boolean(customerNumber),
  })
