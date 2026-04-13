import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { CustomerProfilePumpCycle } from '../../../api/types'
import { ServicingTab } from './ServicingTab'

const sampleCycle: CustomerProfilePumpCycle = {
  CustomerNumber: 'C1',
  SequenceNumber: '1',
  TimeZone: 'America/New_York',
  DayofWeek: 'Monday',
  StartTime: '8:00',
  'Start-AM-PM': 'AM',
  EndTime: '5:00',
  'End-AM-PM': 'PM',
  CleaningCycle: 'Y',
}

describe('ServicingTab', () => {
  it('shows loading copy', () => {
    render(
      <ServicingTab
        cycles={[]}
        isLoading
        isError={false}
        onRetry={() => {}}
      />,
    )
    expect(screen.getByText(/Loading pump schedules/)).toBeInTheDocument()
  })

  it('shows retry on error', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(
      <ServicingTab cycles={[]} isLoading={false} isError onRetry={onRetry} />,
    )
    await user.click(screen.getByRole('button', { name: 'Retry' }))
    expect(onRetry).toHaveBeenCalled()
  })

  it('lists pump cycle rows when data exists', () => {
    render(
      <ServicingTab
        cycles={[sampleCycle]}
        isLoading={false}
        isError={false}
        onRetry={() => {}}
      />,
    )
    expect(screen.getByText('Monday')).toBeInTheDocument()
    expect(screen.getByText(/Cleaning: Y/)).toBeInTheDocument()
  })
})
