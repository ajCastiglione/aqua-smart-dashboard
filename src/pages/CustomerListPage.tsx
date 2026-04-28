import { useQueries } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import type { CustomerProfile } from '../api/types'
import type { CustomerRowMetrics } from '../utils/customer-status'
import { Card } from '../components/ui/Card'
import type { ColumnDef } from '../components/ui/DataTable'
import { DataTable } from '../components/ui/DataTable'
import { ErrorMessage } from '../components/ui/ErrorMessage'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { PaginationControls } from '../components/ui/PaginationControls'
import { StatusBadge } from '../components/features/StatusBadge'
import { useCustomerProfiles } from '../hooks/queries/customer-profile-queries'
import { queryKeys } from '../hooks/queries/query-keys'
import { fetchCustomerRowMetrics } from '../utils/customer-row-metrics'
import { deriveCustomerRowStatus } from '../utils/customer-status'
import { parseApiError } from '../utils/errors'
import { formatFullName, formatStreetAddress } from '../utils/format'

const PER_PAGE = 15

const EMPTY_CUSTOMER_ROWS: CustomerProfile[] = []

/** Renders PSI / GPM / temp from a row metrics query (shared shape reduces column duplication). */
const telemetryMetricCell = (
  rowMetricQuery:
    | {
        isPending: boolean
        isError: boolean
        data?: CustomerRowMetrics
      }
    | undefined,
  metricKey: 'pressurePsi' | 'flowGpm' | 'poolTempFahrenheit',
) => {
  if (rowMetricQuery?.isPending) return <span className="text-slate-400">…</span>
  if (rowMetricQuery?.isError) return '—'
  const metricValue = rowMetricQuery?.data?.[metricKey]
  if (metricValue === undefined) return '—'
  return metricKey === 'poolTempFahrenheit' ? `${metricValue}°` : String(metricValue)
}

export const CustomerListPage = () => {
  const [page, setPage] = useState(1)
  const profilesQuery = useCustomerProfiles({ page, per_page: PER_PAGE })

  const customers = profilesQuery.data?.data ?? EMPTY_CUSTOMER_ROWS

  const customerNumbers = useMemo(
    () => customers.map((customer) => customer.CustomerNumber),
    [customers],
  )

  const rowMetricsQueryDefs = useMemo(
    () =>
      customerNumbers.map((customerNumber) => ({
        queryKey: queryKeys.customerRowMetrics(customerNumber),
        queryFn: () => fetchCustomerRowMetrics(customerNumber),
        enabled: profilesQuery.isSuccess && customerNumbers.length > 0,
      })),
    [customerNumbers, profilesQuery.isSuccess],
  )

  const rowMetricQueries = useQueries({ queries: rowMetricsQueryDefs })

  /** Only block the page on the customer list query — row metrics load in cells (… / —). */
  const profilesListLoading = profilesQuery.isPending

  const columns: ColumnDef<CustomerProfile>[] = useMemo(
    () => [
      {
        id: 'name',
        header: 'Name',
        cell: (customer, rowIndex) => {
          const rowMetrics = rowMetricQueries[rowIndex]?.data
          const status = rowMetrics
            ? deriveCustomerRowStatus(rowMetrics)
            : 'ACTIVE'
          return (
            <span className="inline-flex items-center gap-2 font-medium text-slate-900">
              <StatusBadge status={status} showDot />
              {formatFullName(customer)}
            </span>
          )
        },
      },
      {
        id: 'cust',
        header: 'Cust#',
        cell: (customer) => (
          <span className="font-mono text-xs">{customer.CustomerNumber}</span>
        ),
      },
      {
        id: 'address',
        header: 'Address',
        cell: (customer) => (
          <span className="max-w-[14rem] truncate md:max-w-none">
            {formatStreetAddress(customer)}
          </span>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        cell: (_customer, rowIndex) => {
          const rowMetrics = rowMetricQueries[rowIndex]?.data
          const status = rowMetrics
            ? deriveCustomerRowStatus(rowMetrics)
            : 'ACTIVE'
          return <StatusBadge status={status} />
        },
      },
      {
        id: 'alerts',
        header: 'Alerts',
        cell: (_customer, rowIndex) => {
          const rowMetricQuery = rowMetricQueries[rowIndex]
          if (rowMetricQuery?.isPending) return <span className="text-slate-400">…</span>
          if (rowMetricQuery?.isError) return <span className="text-amber-700">—</span>
          const openAlertCount = rowMetricQuery?.data?.openAlertCount ?? 0
          return <span className="font-mono">{openAlertCount}</span>
        },
      },
      {
        id: 'psi',
        header: 'PSI',
        cell: (_customer, rowIndex) =>
          telemetryMetricCell(rowMetricQueries[rowIndex], 'pressurePsi'),
      },
      {
        id: 'gpm',
        header: 'GPM',
        cell: (_customer, rowIndex) =>
          telemetryMetricCell(rowMetricQueries[rowIndex], 'flowGpm'),
      },
      {
        id: 'temp',
        header: 'Temp',
        cell: (_customer, rowIndex) =>
          telemetryMetricCell(rowMetricQueries[rowIndex], 'poolTempFahrenheit'),
      },
      {
        id: 'action',
        header: 'Action',
        cell: (customer) => (
          <Link
            to={`/customers/${encodeURIComponent(customer.CustomerNumber)}`}
            className="inline-flex rounded-md bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-700"
          >
            Details
          </Link>
        ),
      },
    ],
    [rowMetricQueries],
  )

  const handleRetry = () => {
    void profilesQuery.refetch()
    rowMetricQueries.forEach((rowMetricQuery) => void rowMetricQuery.refetch())
  }

  if (profilesQuery.isError) {
    const listErr = parseApiError(profilesQuery.error)
    return (
      <Card>
        <ErrorMessage
          title={listErr.title}
          message={listErr.message}
          onRetry={handleRetry}
        />
      </Card>
    )
  }

  if (profilesListLoading && !profilesQuery.data) {
    return <LoadingSpinner label="Loading customers" />
  }

  const pagedProfileResponse = profilesQuery.data

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-white drop-shadow md:text-3xl">Customer dashboard</h1>
        <p className="text-sm text-sky-100/90">Read-only view of pool telemetry and alerts.</p>
      </div>

      <Card className="overflow-hidden p-0">
        <DataTable
          columns={columns}
          data={customers}
          getRowKey={(customer) => customer.CustomerNumber}
          emptyMessage="No customer profiles returned."
        />
        {pagedProfileResponse && pagedProfileResponse.last_page > 1 ? (
          <PaginationControls
            currentPage={pagedProfileResponse.current_page}
            lastPage={pagedProfileResponse.last_page}
            total={pagedProfileResponse.total}
            isDisabled={profilesQuery.isFetching}
            onPageChange={(nextPage) => setPage(nextPage)}
          />
        ) : null}
      </Card>
    </div>
  )
}
