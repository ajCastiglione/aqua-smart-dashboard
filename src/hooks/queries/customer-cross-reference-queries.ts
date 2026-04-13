import { useQuery } from '@tanstack/react-query'
import {
  getCustomerCrossReference,
  getCustomerCrossReferences,
} from '../../api/endpoints/customer-cross-reference'
import type { CustomerCrossReferencesListParams } from '../../api/endpoints/customer-cross-reference'
import { queryKeys } from './query-keys'

export const useCustomerCrossReferences = (params: CustomerCrossReferencesListParams = {}) => {
  const page = params.page ?? 1
  const perPage = params.per_page ?? 25
  return useQuery({
    queryKey: [
      'customerCrossReferencesList',
      { page, perPage, serial_number: params.serial_number, customer_number: params.customer_number },
    ],
    queryFn: () => getCustomerCrossReferences({ ...params, page, per_page: perPage }),
  })
}

export const useCustomerCrossReference = (
  serialNumber: string | undefined,
  customerNumber: string | undefined,
) =>
  useQuery({
    queryKey: ['customerCrossReference', serialNumber ?? '', customerNumber ?? ''],
    queryFn: () => getCustomerCrossReference(serialNumber!, customerNumber!),
    enabled: Boolean(serialNumber && customerNumber),
  })

export const useCustomerCrossReferencesByCustomer = (customerNumber: string | undefined) =>
  useQuery({
    queryKey: queryKeys.customerCrossReferences(customerNumber ?? ''),
    queryFn: () =>
      getCustomerCrossReferences({
        customer_number: customerNumber,
        per_page: 100,
        page: 1,
      }),
    enabled: Boolean(customerNumber),
  })
