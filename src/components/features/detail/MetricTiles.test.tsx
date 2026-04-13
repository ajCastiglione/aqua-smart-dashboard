import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MetricTiles } from './MetricTiles'

describe('MetricTiles', () => {
  it('shows em dashes when values missing', () => {
    render(<MetricTiles />)
    const dashes = screen.getAllByText('—')
    expect(dashes.length).toBeGreaterThanOrEqual(1)
  })

  it('shows numeric temp, psi, gpm when provided', () => {
    render(<MetricTiles poolTempFahrenheit={82} pressurePsi={12} flowGpm={45} />)
    expect(screen.getByText('82°')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('45')).toBeInTheDocument()
  })
})
