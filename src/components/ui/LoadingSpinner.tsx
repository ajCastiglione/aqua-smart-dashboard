export const LoadingSpinner = ({ label = 'Loading' }: { label?: string }) => (
  <div
    className="flex flex-col items-center justify-center gap-3 py-12 text-slate-600"
    role="status"
    aria-live="polite"
  >
    <div
      className="h-10 w-10 animate-spin rounded-full border-2 border-sky-600 border-t-transparent"
      aria-hidden
    />
    <span className="text-sm font-medium">{label}</span>
  </div>
)
