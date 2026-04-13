import { useQuery } from '@tanstack/react-query'
import {
  getCustomerProfilePumpCycle,
  getCustomerProfilePumpCyclesList,
} from '../../api/endpoints/customer-pumpcycle'
import type { CustomerPumpCyclesListParams } from '../../api/endpoints/customer-pumpcycle'
import { queryKeys } from './query-keys'

export const useCustomerProfilePumpCyclesList = (params: CustomerPumpCyclesListParams = {}) => {
  const page = params.page ?? 1
  const perPage = params.per_page ?? 25
  return useQuery({
    queryKey: [
      'customerPumpCyclesList',
      { page, perPage, customer_number: params.customer_number },
    ],
    queryFn: () => getCustomerProfilePumpCyclesList({ ...params, page, per_page: perPage }),
  })
}

export const useCustomerPumpCyclesByCustomer = (customerNumber: string | undefined) =>
  useQuery({
    queryKey: queryKeys.customerPumpCycles(customerNumber ?? ''),
    queryFn: () =>
      getCustomerProfilePumpCyclesList({
        customer_number: customerNumber,
        per_page: 100,
        page: 1,
      }),
    enabled: Boolean(customerNumber),
  })

export const useCustomerProfilePumpCycle = (
  customerNumber: string | undefined,
  sequenceNumber: string | undefined,
) =>
  useQuery({
    queryKey: ['customerPumpCycle', customerNumber ?? '', sequenceNumber ?? ''],
    queryFn: () => getCustomerProfilePumpCycle(customerNumber!, sequenceNumber!),
    enabled: Boolean(customerNumber && sequenceNumber),
  })
