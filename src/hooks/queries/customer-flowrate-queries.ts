import { useQuery } from '@tanstack/react-query'
import {
  getCustomerFlowRateDataForCustomer,
  getCustomerFlowRateDataList,
} from '../../api/endpoints/customer-flowrate-data'
import type { CustomerFlowRateListParams } from '../../api/endpoints/customer-flowrate-data'
import { queryKeys } from './query-keys'

export const useCustomerFlowRateDataList = (params: CustomerFlowRateListParams = {}) => {
  const page = params.page ?? 1
  const perPage = params.per_page ?? 25
  return useQuery({
    queryKey: ['customerFlowRateList', { page, perPage, customer_number: params.customer_number }],
    queryFn: () => getCustomerFlowRateDataList({ ...params, page, per_page: perPage }),
  })
}

export const useCustomerFlowRateByCustomer = (customerNumber: string | undefined) =>
  useQuery({
    queryKey: queryKeys.customerFlowRate(customerNumber ?? ''),
    queryFn: () => getCustomerFlowRateDataForCustomer(customerNumber!),
    enabled: Boolean(customerNumber),
  })
