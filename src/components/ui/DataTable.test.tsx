import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DataTable } from './DataTable'

type Row = { id: string; name: string }

describe('DataTable', () => {
  it('shows empty message when data is empty', () => {
    render(
      <DataTable<Row>
        columns={[{ id: 'n', header: 'Name', cell: (row) => row.name }]}
        data={[]}
        getRowKey={(row) => row.id}
        emptyMessage="Nothing here."
      />,
    )
    expect(screen.getByText('Nothing here.')).toBeInTheDocument()
  })

  it('renders headers and cell content', () => {
    render(
      <DataTable<Row>
        columns={[
          { id: 'n', header: 'Name', cell: (row) => row.name },
          { id: 'x', header: 'Extra', cell: () => 'ok' },
        ]}
        data={[{ id: '1', name: 'Ada' }]}
        getRowKey={(row) => row.id}
      />,
    )
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Ada' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'ok' })).toBeInTheDocument()
  })
})
