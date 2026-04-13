import { useQuery } from '@tanstack/react-query'
import {
  getCustomerPressureDataForCustomer,
  getCustomerPressureDataList,
} from '../../api/endpoints/customer-pressure-data'
import type { CustomerPressureListParams } from '../../api/endpoints/customer-pressure-data'
import { queryKeys } from './query-keys'

export const useCustomerPressureDataList = (params: CustomerPressureListParams = {}) => {
  const page = params.page ?? 1
  const perPage = params.per_page ?? 25
  return useQuery({
    queryKey: ['customerPressureList', { page, perPage, customer_number: params.customer_number }],
    queryFn: () => getCustomerPressureDataList({ ...params, page, per_page: perPage }),
  })
}

export const useCustomerPressureByCustomer = (customerNumber: string | undefined) =>
  useQuery({
    queryKey: queryKeys.customerPressure(customerNumber ?? ''),
    queryFn: () => getCustomerPressureDataForCustomer(customerNumber!),
    enabled: Boolean(customerNumber),
  })
