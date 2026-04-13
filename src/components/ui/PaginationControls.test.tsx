import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PaginationControls } from './PaginationControls'

describe('PaginationControls', () => {
  it('calls onPageChange when Next is clicked', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(
      <PaginationControls
        currentPage={2}
        lastPage={5}
        total={100}
        onPageChange={onPageChange}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('disables Previous on first page', () => {
    const onPageChange = vi.fn()
    render(
      <PaginationControls
        currentPage={1}
        lastPage={3}
        total={40}
        onPageChange={onPageChange}
      />,
    )
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
  })
})
