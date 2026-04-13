type ErrorMessageProps = {
  title?: string
  message: string
  onRetry?: () => void
}

export const ErrorMessage = ({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorMessageProps) => (
  <div
    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-900 shadow-sm"
    role="alert"
  >
    <p className="font-semibold">{title}</p>
    <p className="mt-1 text-sm opacity-90">{message}</p>
    {onRetry ? (
      <button
        type="button"
        className="mt-3 rounded-md bg-red-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        onClick={onRetry}
      >
        Retry
      </button>
    ) : null}
  </div>
)
