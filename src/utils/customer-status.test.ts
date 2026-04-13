import { describe, expect, it } from 'vitest'
import { deriveCustomerRowStatus } from './customer-status'

describe('deriveCustomerRowStatus', () => {
  it('returns SERVICE when there are open alerts', () => {
    expect(
      deriveCustomerRowStatus({
        openAlertCount: 1,
        pressurePsi: 10,
        flowGpm: 5,
        pumpStatus: null,
      }),
    ).toBe('SERVICE')
  })

  it('returns SERVICE when psi or gpm is zero', () => {
    expect(
      deriveCustomerRowStatus({
        openAlertCount: 0,
        pressurePsi: 0,
        flowGpm: 10,
        pumpStatus: null,
      }),
    ).toBe('SERVICE')
  })

  it('returns IDLE when pump suggests off', () => {
    expect(
      deriveCustomerRowStatus({
        openAlertCount: 0,
        pressurePsi: 10,
        flowGpm: 10,
        pumpStatus: 'off',
      }),
    ).toBe('IDLE')
  })

  it('returns ACTIVE otherwise', () => {
    expect(
      deriveCustomerRowStatus({
        openAlertCount: 0,
        pressurePsi: 12,
        flowGpm: 40,
        pumpStatus: 'on',
      }),
    ).toBe('ACTIVE')
  })
})
