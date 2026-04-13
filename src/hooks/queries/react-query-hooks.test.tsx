import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import {
  getCustomerProfile,
  getCustomerProfiles,
} from '../../api/endpoints/customer-profile'
import {
  getCustomerProfilePumpCyclesList,
} from '../../api/endpoints/customer-pumpcycle'
import { fetchCustomerRowMetrics } from '../../utils/customer-row-metrics'
import { useCustomerProfile, useCustomerProfiles } from './customer-profile-queries'
import { useCustomerPumpCyclesByCustomer } from './customer-pumpcycle-queries'
import { useCustomerRowMetrics } from './useCustomerRowMetrics'
import { createQueryWrapper, createTestQueryClient } from './test-utils'

vi.mock('../../api/endpoints/customer-profile', () => ({
  getCustomerProfiles: vi.fn(),
  getCustomerProfile: vi.fn(),
}))

vi.mock('../../api/endpoints/customer-pumpcycle', () => ({
  getCustomerProfilePumpCyclesList: vi.fn(),
  getCustomerProfilePumpCycle: vi.fn(),
}))

vi.mock('../../utils/customer-row-metrics', () => ({
  fetchCustomerRowMetrics: vi.fn(),
}))

const emptyPaginated = {
  data: [] as never[],
  current_page: 1,
  last_page: 1,
  per_page: 25,
  total: 0,
}

describe('useCustomerProfiles', () => {
  beforeEach(() => {
    vi.mocked(getCustomerProfiles).mockReset()
    vi.mocked(getCustomerProfiles).mockResolvedValue(emptyPaginated)
  })

  it('calls list endpoint with normalized page and per_page', async () => {
    const client = createTestQueryClient()
    const { result } = renderHook(
      () => useCustomerProfiles({ page: 3, per_page: 15 }),
      { wrapper: createQueryWrapper(client) },
    )
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(getCustomerProfiles).toHaveBeenCalledWith({ page: 3, per_page: 15 })
  })
})

describe('useCustomerProfile', () => {
  beforeEach(() => {
    vi.mocked(getCustomerProfile).mockReset()
  })

  it('does not fetch when customerNumber is undefined', () => {
    const client = createTestQueryClient()
    renderHook(() => useCustomerProfile(undefined), {
      wrapper: createQueryWrapper(client),
    })
    expect(getCustomerProfile).not.toHaveBeenCalled()
  })

  it('fetches when customerNumber is set', async () => {
    vi.mocked(getCustomerProfile).mockResolvedValue({
      CustomerNumber: 'C1',
      FirstName: 'A',
      LastName: 'B',
      Street: '1 Main',
      City: 'X',
      State: 'ST',
      ZipCode: '00000',
      EmailAddress: 'a@b.c',
      PhoneNumber: '1',
      VendorNumber: 'V',
      VendorName: 'Vn',
      TechName: 'T',
      SerialNumber: 'S',
      IPAddress: '0.0.0.0',
    })
    const client = createTestQueryClient()
    const { result } = renderHook(() => useCustomerProfile('C1'), {
      wrapper: createQueryWrapper(client),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(getCustomerProfile).toHaveBeenCalledWith('C1')
  })
})

describe('useCustomerPumpCyclesByCustomer', () => {
  beforeEach(() => {
    vi.mocked(getCustomerProfilePumpCyclesList).mockReset()
    vi.mocked(getCustomerProfilePumpCyclesList).mockResolvedValue(emptyPaginated)
  })

  it('requests pump cycles list filtered by customer with high per_page', async () => {
    const client = createTestQueryClient()
    const { result } = renderHook(() => useCustomerPumpCyclesByCustomer('K1'), {
      wrapper: createQueryWrapper(client),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(getCustomerProfilePumpCyclesList).toHaveBeenCalledWith({
      customer_number: 'K1',
      page: 1,
      per_page: 100,
    })
  })
})

describe('useCustomerRowMetrics', () => {
  beforeEach(() => {
    vi.mocked(fetchCustomerRowMetrics).mockReset()
    vi.mocked(fetchCustomerRowMetrics).mockResolvedValue({
      openAlertCount: 0,
      pressurePsi: 10,
      flowGpm: 20,
      poolTempFahrenheit: 72,
      pumpStatus: null,
    })
  })

  it('delegates to fetchCustomerRowMetrics', async () => {
    const client = createTestQueryClient()
    const { result } = renderHook(() => useCustomerRowMetrics('Z9'), {
      wrapper: createQueryWrapper(client),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(fetchCustomerRowMetrics).toHaveBeenCalledWith('Z9')
    expect(result.current.data?.poolTempFahrenheit).toBe(72)
  })

  it('stays idle when customerNumber is undefined', () => {
    const client = createTestQueryClient()
    renderHook(() => useCustomerRowMetrics(undefined), {
      wrapper: createQueryWrapper(client),
    })
    expect(fetchCustomerRowMetrics).not.toHaveBeenCalled()
  })
})
