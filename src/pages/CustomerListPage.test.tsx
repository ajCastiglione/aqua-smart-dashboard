import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { CustomerProfile } from '../api/types'
import { CustomerListPage } from './CustomerListPage'

const sampleProfile: CustomerProfile = {
  CustomerNumber: 'C-100',
  FirstName: 'Test',
  LastName: 'User',
  Street: '1 Pool Ln',
  City: 'Tampa',
  State: 'FL',
  ZipCode: '33601',
  EmailAddress: 't@example.com',
  PhoneNumber: '555-0100',
  VendorNumber: 'V1',
  VendorName: 'Vendor',
  TechName: 'Tech',
  SerialNumber: 'SN-1',
  IPAddress: '10.0.0.1',
}

const mockUseCustomerProfiles = vi.fn()
const mockUseQueries = vi.fn()

vi.mock('../hooks/queries/customer-profile-queries', () => ({
  useCustomerProfiles: () => mockUseCustomerProfiles(),
}))

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>()
  return {
    ...actual,
    useQueries: (opts: Parameters<typeof actual.useQueries>[0]) => mockUseQueries(opts),
  }
})

describe('CustomerListPage', () => {
  beforeEach(() => {
    mockUseCustomerProfiles.mockReset()
    mockUseQueries.mockReset()
    mockUseCustomerProfiles.mockReturnValue({
      data: {
        data: [sampleProfile],
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 1,
      },
      isPending: false,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
      error: null,
    })
    mockUseQueries.mockReturnValue([
      {
        data: {
          openAlertCount: 0,
          pressurePsi: 42,
          flowGpm: 80,
          poolTempFahrenheit: 88,
          pumpStatus: 'on',
        },
        isPending: false,
        isError: false,
        refetch: vi.fn(),
      },
    ])
  })

  it('renders dashboard title and table with customer row', () => {
    render(
      <MemoryRouter>
        <CustomerListPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: /customer dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Cust#' })).toBeInTheDocument()
    expect(screen.getByText('C-100')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Details' })).toHaveAttribute(
      'href',
      '/customers/C-100',
    )
  })
})
