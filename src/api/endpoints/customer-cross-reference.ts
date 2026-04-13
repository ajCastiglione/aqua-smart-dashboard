import { api } from '../axios-instance'
import type { CustomerCrossReference, PaginatedResponse, PaginationParams } from '../types'

export type CustomerCrossReferencesListParams = PaginationParams & {
  serial_number?: string
  customer_number?: string
}

export const getCustomerCrossReferences = async (
  params?: CustomerCrossReferencesListParams,
): Promise<PaginatedResponse<CustomerCrossReference>> => {
  const { data } = await api.get<PaginatedResponse<CustomerCrossReference>>(
    '/customer-cross-references',
    { params },
  )
  return data
}

export const getCustomerCrossReference = async (
  serialNumber: string,
  customerNumber: string,
): Promise<CustomerCrossReference> => {
  const { data } = await api.get<CustomerCrossReference>(
    `/customer-cross-references/${encodeURIComponent(serialNumber)}/${encodeURIComponent(customerNumber)}`,
  )
  return data
}
