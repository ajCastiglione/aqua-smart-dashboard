import { api } from '../axios-instance'
import type { CustomerProfile, PaginatedResponse, PaginationParams } from '../types'

export const getCustomerProfiles = async (
  params?: PaginationParams,
): Promise<PaginatedResponse<CustomerProfile>> => {
  const { data } = await api.get<PaginatedResponse<CustomerProfile>>('/customer-profiles', {
    params,
  })
  return data
}

export const getCustomerProfile = async (
  customerNumber: string,
): Promise<CustomerProfile> => {
  const { data } = await api.get<CustomerProfile>(
    `/customer-profiles/${encodeURIComponent(customerNumber)}`,
  )
  return data
}
