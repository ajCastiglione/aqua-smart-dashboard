type EmptyStateProps = {
  title: string
  description?: string
}

export const EmptyState = ({ title, description }: EmptyStateProps) => (
  <div className="rounded-lg border border-slate-200 bg-white/80 px-6 py-10 text-center text-slate-600 shadow-sm">
    <p className="text-lg font-medium text-slate-800">{title}</p>
    {description ? <p className="mt-2 text-sm">{description}</p> : null}
  </div>
)
