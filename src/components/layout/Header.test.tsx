import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Header } from './Header'

describe('Header', () => {
  it('shows branding and keeps prototype actions non-interactive', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )
    expect(screen.getByText('Pinch-A-Penny')).toBeInTheDocument()
    expect(screen.getByText('aquasmart')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Notifications' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Add New' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Settings' })).toBeDisabled()
  })
})
