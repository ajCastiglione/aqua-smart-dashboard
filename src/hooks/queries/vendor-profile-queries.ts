import { useQuery } from '@tanstack/react-query'
import { getVendorProfile, getVendorProfiles } from '../../api/endpoints/vendor-profile'
import type { PaginationParams } from '../../api/types'
import { queryKeys } from './query-keys'

export const useVendorProfiles = (params: PaginationParams = {}) => {
  const page = params.page ?? 1
  const perPage = params.per_page ?? 25
  return useQuery({
    queryKey: ['vendorProfilesList', { page, perPage }],
    queryFn: () => getVendorProfiles({ page, per_page: perPage }),
  })
}

export const useVendorProfile = (vendorNumber: string | undefined) =>
  useQuery({
    queryKey: queryKeys.vendorProfile(vendorNumber ?? ''),
    queryFn: () => getVendorProfile(vendorNumber!),
    enabled: Boolean(vendorNumber),
  })
