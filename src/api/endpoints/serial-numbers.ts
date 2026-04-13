import { api } from '../axios-instance'
import type { PaginatedResponse, PaginationParams, SerialNumberRecord } from '../types'

export type SerialNumbersListParams = PaginationParams & {
  customer_number?: string
}

export const getSerialNumbers = async (
  params?: SerialNumbersListParams,
): Promise<PaginatedResponse<SerialNumberRecord>> => {
  const { data } = await api.get<PaginatedResponse<SerialNumberRecord>>('/serial-numbers', {
    params,
  })
  return data
}

export const getSerialNumber = async (serialNumber: string): Promise<SerialNumberRecord> => {
  const { data } = await api.get<SerialNumberRecord>(
    `/serial-numbers/${encodeURIComponent(serialNumber)}`,
  )
  return data
}
