import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../axios-instance', () => ({
  api: {
    get: vi.fn(),
  },
}))

import { api } from '../axios-instance'
import {
  getCustomerAlerts,
  getCustomerAlertsForCustomer,
} from './customer-alerts'
import {
  getCustomerCrossReference,
  getCustomerCrossReferences,
} from './customer-cross-reference'
import {
  getCustomerFlowRateDataForCustomer,
  getCustomerFlowRateDataList,
} from './customer-flowrate-data'
import {
  getCustomerPressureDataForCustomer,
  getCustomerPressureDataList,
} from './customer-pressure-data'
import { getCustomerProfile, getCustomerProfiles } from './customer-profile'
import {
  getCustomerProfilePumpCycle,
  getCustomerProfilePumpCyclesList,
} from './customer-pumpcycle'
import {
  getCustomerTempDataForCustomer,
  getCustomerTempDataList,
} from './customer-temp-data'
import { getSerialNumber, getSerialNumbers } from './serial-numbers'
import { getVendorProfile, getVendorProfiles } from './vendor-profile'

const emptyPage = {
  data: [],
  current_page: 1,
  last_page: 1,
  per_page: 25,
  total: 0,
}

describe('API GET endpoints (paths & params)', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset()
    vi.mocked(api.get).mockResolvedValue({ data: emptyPage })
  })

  it('getCustomerProfiles passes pagination params', async () => {
    await getCustomerProfiles({ page: 2, per_page: 10 })
    expect(api.get).toHaveBeenCalledWith('/customer-profiles', {
      params: { page: 2, per_page: 10 },
    })
  })

  it('getCustomerProfile encodes customer number in path', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: {} })
    await getCustomerProfile('CUST#1')
    expect(api.get).toHaveBeenCalledWith(
      `/customer-profiles/${encodeURIComponent('CUST#1')}`,
    )
  })

  it('getCustomerAlerts passes filters', async () => {
    await getCustomerAlerts({ customer_number: 'A1', page: 1 })
    expect(api.get).toHaveBeenCalledWith('/customer-alerts', {
      params: { customer_number: 'A1', page: 1 },
    })
  })

  it('getCustomerAlertsForCustomer uses encoded path', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] })
    await getCustomerAlertsForCustomer('X/Y')
    expect(api.get).toHaveBeenCalledWith(
      `/customer-alerts/${encodeURIComponent('X/Y')}`,
    )
  })

  it('getCustomerCrossReferences passes list params', async () => {
    await getCustomerCrossReferences({
      serial_number: 'S1',
      customer_number: 'C1',
      per_page: 50,
    })
    expect(api.get).toHaveBeenCalledWith('/customer-cross-references', {
      params: { serial_number: 'S1', customer_number: 'C1', per_page: 50 },
    })
  })

  it('getCustomerCrossReference encodes both path segments', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: {} })
    await getCustomerCrossReference('a/b', 'c#d')
    expect(api.get).toHaveBeenCalledWith(
      `/customer-cross-references/${encodeURIComponent('a/b')}/${encodeURIComponent('c#d')}`,
    )
  })

  it('getCustomerFlowRateDataList uses customer-flow-rate-data path', async () => {
    await getCustomerFlowRateDataList({ customer_number: 'N1' })
    expect(api.get).toHaveBeenCalledWith('/customer-flow-rate-data', {
      params: { customer_number: 'N1' },
    })
  })

  it('getCustomerFlowRateDataForCustomer encodes customer number', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [] })
    await getCustomerFlowRateDataForCustomer('N#1')
    expect(api.get).toHaveBeenCalledWith(
      `/customer-flow-rate-data/${encodeURIComponent('N#1')}`,
    )
  })

  it('getCustomerPressureDataList and getCustomerPressureDataForCustomer', async () => {
    await getCustomerPressureDataList({ customer_number: 'P1' })
    expect(api.get).toHaveBeenCalledWith('/customer-pressure-data', {
      params: { customer_number: 'P1' },
    })
    vi.mocked(api.get).mockResolvedValue({ data: [] })
    await getCustomerPressureDataForCustomer('P#1')
    expect(api.get).toHaveBeenCalledWith(
      `/customer-pressure-data/${encodeURIComponent('P#1')}`,
    )
  })

  it('getCustomerProfilePumpCyclesList and getCustomerProfilePumpCycle', async () => {
    await getCustomerProfilePumpCyclesList({ customer_number: 'K1' })
    expect(api.get).toHaveBeenCalledWith('/customer-profile-pump-cycles', {
      params: { customer_number: 'K1' },
    })
    vi.mocked(api.get).mockResolvedValue({ data: {} })
    await getCustomerProfilePumpCycle('C1', 'Seq 1')
    expect(api.get).toHaveBeenCalledWith(
      `/customer-profile-pump-cycles/${encodeURIComponent('C1')}/${encodeURIComponent('Seq 1')}`,
    )
  })

  it('getCustomerTempDataList and getCustomerTempDataForCustomer', async () => {
    await getCustomerTempDataList({ customer_number: 'T1' })
    expect(api.get).toHaveBeenCalledWith('/customer-temp-data', {
      params: { customer_number: 'T1' },
    })
    vi.mocked(api.get).mockResolvedValue({ data: [] })
    await getCustomerTempDataForCustomer('T#1')
    expect(api.get).toHaveBeenCalledWith(
      `/customer-temp-data/${encodeURIComponent('T#1')}`,
    )
  })

  it('getSerialNumbers and getSerialNumber', async () => {
    await getSerialNumbers({ customer_number: 'C1' })
    expect(api.get).toHaveBeenCalledWith('/serial-numbers', {
      params: { customer_number: 'C1' },
    })
    vi.mocked(api.get).mockResolvedValue({ data: {} })
    await getSerialNumber('SN/ABC')
    expect(api.get).toHaveBeenCalledWith(
      `/serial-numbers/${encodeURIComponent('SN/ABC')}`,
    )
  })

  it('getVendorProfiles and getVendorProfile', async () => {
    await getVendorProfiles({ page: 1 })
    expect(api.get).toHaveBeenCalledWith('/vendor-profiles', {
      params: { page: 1 },
    })
    vi.mocked(api.get).mockResolvedValue({ data: {} })
    await getVendorProfile('V#1')
    expect(api.get).toHaveBeenCalledWith(
      `/vendor-profiles/${encodeURIComponent('V#1')}`,
    )
  })
})
