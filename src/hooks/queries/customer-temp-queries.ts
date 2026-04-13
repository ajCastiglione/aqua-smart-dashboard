import { useQuery } from '@tanstack/react-query'
import {
  getCustomerTempDataForCustomer,
  getCustomerTempDataList,
} from '../../api/endpoints/customer-temp-data'
import type { CustomerTempDataListParams } from '../../api/endpoints/customer-temp-data'
import { queryKeys } from './query-keys'

export const useCustomerTempDataList = (params: CustomerTempDataListParams = {}) => {
  const page = params.page ?? 1
  const perPage = params.per_page ?? 25
  return useQuery({
    queryKey: ['customerTempList', { page, perPage, customer_number: params.customer_number }],
    queryFn: () => getCustomerTempDataList({ ...params, page, per_page: perPage }),
  })
}

export const useCustomerTempByCustomer = (customerNumber: string | undefined) =>
  useQuery({
    queryKey: queryKeys.customerTemp(customerNumber ?? ''),
    queryFn: () => getCustomerTempDataForCustomer(customerNumber!),
    enabled: Boolean(customerNumber),
  })
