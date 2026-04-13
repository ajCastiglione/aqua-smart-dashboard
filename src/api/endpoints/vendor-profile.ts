import { api } from '../axios-instance'
import type { PaginatedResponse, PaginationParams, VendorProfile } from '../types'

export const getVendorProfiles = async (
  params?: PaginationParams,
): Promise<PaginatedResponse<VendorProfile>> => {
  const { data } = await api.get<PaginatedResponse<VendorProfile>>('/vendor-profiles', {
    params,
  })
  return data
}

export const getVendorProfile = async (vendorNumber: string): Promise<VendorProfile> => {
  const { data } = await api.get<VendorProfile>(
    `/vendor-profiles/${encodeURIComponent(vendorNumber)}`,
  )
  return data
}
