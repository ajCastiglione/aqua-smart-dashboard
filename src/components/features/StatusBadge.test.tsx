import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it('renders status label and optional dot', () => {
    const { rerender } = render(<StatusBadge status="ACTIVE" />)
    expect(screen.getByText('ACTIVE')).toBeInTheDocument()

    rerender(<StatusBadge status="SERVICE" showDot />)
    expect(screen.getByText('SERVICE')).toBeInTheDocument()
  })
})
