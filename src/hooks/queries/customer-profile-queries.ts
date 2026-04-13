import { useQuery } from '@tanstack/react-query'
import { getCustomerProfile, getCustomerProfiles } from '../../api/endpoints/customer-profile'
import type { PaginationParams } from '../../api/types'
import { queryKeys } from './query-keys'

export const useCustomerProfiles = (params: PaginationParams = {}) => {
  const page = params.page ?? 1
  const perPage = params.per_page ?? 25
  return useQuery({
    queryKey: queryKeys.customerProfiles(page, perPage),
    queryFn: () => getCustomerProfiles({ page, per_page: perPage }),
  })
}

export const useCustomerProfile = (customerNumber: string | undefined) =>
  useQuery({
    queryKey: queryKeys.customerProfile(customerNumber ?? ''),
    queryFn: () => getCustomerProfile(customerNumber!),
    enabled: Boolean(customerNumber),
  })
