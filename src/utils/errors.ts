import { isAxiosError } from 'axios'

export type ApiErrorDisplay = {
  title: string
  message: string
}

const extractServerMessage = (data: unknown): string | undefined => {
  if (typeof data !== 'object' || data === null || !('message' in data)) return undefined
  const m = (data as { message?: unknown }).message
  return typeof m === 'string' ? m : undefined
}

/** Laravel / framework messages that should not be shown verbatim to end users. */
const isFrameworkOrInternalMessage = (msg: string): boolean => {
  if (/No query results for model/i.test(msg)) return true
  if (msg.includes('App\\Models\\')) return true
  if (msg.includes('Symfony\\Component\\')) return true
  return false
}

/**
 * Human-readable title + message for API and client errors. Prefer this for full-page or
 * prominent alerts; use {@link getErrorMessage} when only the message string is needed.
 */
export const parseApiError = (error: unknown): ApiErrorDisplay => {
  if (!isAxiosError(error)) {
    if (error instanceof Error) {
      return { title: 'Something went wrong', message: error.message }
    }
    return {
      title: 'Something went wrong',
      message: 'An unexpected error occurred. Please try again.',
    }
  }

  const status = error.response?.status
  const rawMessage = extractServerMessage(error.response?.data)

  if (status === undefined) {
    const code = error.code
    const message =
      code === 'ECONNABORTED'
        ? 'The request took too long. Check your connection and try again.'
        : 'Unable to reach the server. Check your connection and try again.'
    return { title: 'Connection problem', message }
  }

  if (status === 404) {
    const message =
      rawMessage && !isFrameworkOrInternalMessage(rawMessage)
        ? rawMessage
        : 'No record matches this link. It may have been removed or the address may be incorrect.'
    return { title: 'Not found', message }
  }

  if (status === 401) {
    return {
      title: 'Sign-in required',
      message: 'Your session may have expired. Please sign in again.',
    }
  }

  if (status === 403) {
    return {
      title: 'Access denied',
      message: "You don't have permission to view this data.",
    }
  }

  if (status === 408) {
    return {
      title: 'Request timed out',
      message: 'The server took too long to respond. Please try again.',
    }
  }

  if (status === 429) {
    return {
      title: 'Too many requests',
      message: 'Please wait a moment and try again.',
    }
  }

  if (status >= 500) {
    return {
      title: 'Server error',
      message: 'Something went wrong on the server. Please try again in a moment.',
    }
  }

  if (rawMessage && !isFrameworkOrInternalMessage(rawMessage)) {
    return { title: 'Request failed', message: rawMessage }
  }

  return {
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Please try again.',
  }
}

export const getErrorMessage = (error: unknown): string => parseApiError(error).message
