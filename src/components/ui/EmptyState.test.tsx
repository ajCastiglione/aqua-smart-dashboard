import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders title and optional description', () => {
    render(
      <EmptyState title="Notes" description="No API for this in the prototype." />,
    )
    expect(screen.getByText('Notes')).toBeInTheDocument()
    expect(
      screen.getByText('No API for this in the prototype.'),
    ).toBeInTheDocument()
  })
})
