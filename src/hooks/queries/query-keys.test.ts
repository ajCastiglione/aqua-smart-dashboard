import { describe, expect, it } from 'vitest'
import { queryKeys } from './query-keys'

describe('queryKeys', () => {
  it('uses stable tuple shapes for cache identity', () => {
    expect(queryKeys.customerProfiles(2, 15)).toEqual([
      'customerProfiles',
      { page: 2, perPage: 15 },
    ])
    expect(queryKeys.customerProfile('A#1')).toEqual(['customerProfile', 'A#1'])
    expect(queryKeys.customerRowMetrics('N1')).toEqual(['customerRowMetrics', 'N1'])
    expect(queryKeys.customerAlerts('C1')).toEqual(['customerAlerts', 'C1'])
    expect(queryKeys.customerPressure('C1')).toEqual(['customerPressure', 'C1'])
    expect(queryKeys.customerFlowRate('C1')).toEqual(['customerFlowRate', 'C1'])
    expect(queryKeys.customerTemp('C1')).toEqual(['customerTemp', 'C1'])
    expect(queryKeys.customerPumpCycles('C1')).toEqual(['customerPumpCycles', 'C1'])
    expect(queryKeys.vendorProfile('V1')).toEqual(['vendorProfile', 'V1'])
    expect(queryKeys.serialNumber('SN/1')).toEqual(['serialNumber', 'SN/1'])
    expect(queryKeys.customerCrossReferences('C1')).toEqual([
      'customerCrossReferences',
      'C1',
    ])
  })
})
