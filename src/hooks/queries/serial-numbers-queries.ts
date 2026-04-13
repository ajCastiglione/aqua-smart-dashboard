import { useQuery } from '@tanstack/react-query'
import { getSerialNumber, getSerialNumbers } from '../../api/endpoints/serial-numbers'
import type { SerialNumbersListParams } from '../../api/endpoints/serial-numbers'
import { queryKeys } from './query-keys'

export const useSerialNumbers = (params: SerialNumbersListParams = {}) => {
  const page = params.page ?? 1
  const perPage = params.per_page ?? 25
  return useQuery({
    queryKey: ['serialNumbersList', { page, perPage, customer_number: params.customer_number }],
    queryFn: () => getSerialNumbers({ ...params, page, per_page: perPage }),
  })
}

export const useSerialNumber = (serialNumber: string | undefined) =>
  useQuery({
    queryKey: queryKeys.serialNumber(serialNumber ?? ''),
    queryFn: () => getSerialNumber(serialNumber!),
    enabled: Boolean(serialNumber),
  })
