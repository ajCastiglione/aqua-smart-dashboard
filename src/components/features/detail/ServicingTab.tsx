import type { CustomerProfilePumpCycle } from '../../../api/types'

type ServicingTabProps = {
  cycles: CustomerProfilePumpCycle[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

export const ServicingTab = ({ cycles, isLoading, isError, onRetry }: ServicingTabProps) => {
  if (isLoading) {
    return <p className="text-sky-200/80">Loading pump schedules…</p>
  }
  if (isError) {
    return (
      <div>
        <p className="text-red-300">Could not load pump cycles.</p>
        <button
          type="button"
          className="mt-2 rounded-md bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
          onClick={onRetry}
        >
          Retry
        </button>
      </div>
    )
  }
  if (cycles.length === 0) {
    return <p className="text-sky-200/80">No pump cycle records for this customer.</p>
  }

  return (
    <ul className="space-y-3">
      {cycles.map((cycle) => (
        <li
          key={`${cycle.SequenceNumber}-${cycle.DayofWeek}-${cycle.StartTime}`}
          className="rounded-lg border border-white/10 bg-slate-800/60 px-4 py-3 text-sm text-sky-100"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-white">{cycle.DayofWeek}</span>
            <span className="rounded bg-white/10 px-2 py-0.5 text-xs">
              Cleaning: {cycle.CleaningCycle}
            </span>
          </div>
          <p className="mt-1 text-sky-200/90">
            {cycle.StartTime} {cycle['Start-AM-PM']} → {cycle.EndTime} {cycle['End-AM-PM']} (
            {cycle.TimeZone})
          </p>
        </li>
      ))}
    </ul>
  )
}
