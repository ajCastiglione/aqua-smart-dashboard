import type { RowStatus } from '../../utils/customer-status'

const dotClass: Record<RowStatus, string> = {
  ACTIVE: 'bg-emerald-500',
  IDLE: 'bg-slate-600',
  SERVICE: 'bg-red-600',
}

const labelClass: Record<RowStatus, string> = {
  ACTIVE: 'text-emerald-700',
  IDLE: 'text-slate-800',
  SERVICE: 'text-red-700',
}

type StatusBadgeProps = {
  status: RowStatus
  showDot?: boolean
}

export const StatusBadge = ({ status, showDot }: StatusBadgeProps) => (
  <span className="inline-flex items-center gap-2">
    {showDot ? (
      <span className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${dotClass[status]}`} aria-hidden />
    ) : null}
    <span className={`text-xs font-bold uppercase tracking-wide ${labelClass[status]}`}>{status}</span>
  </span>
)
