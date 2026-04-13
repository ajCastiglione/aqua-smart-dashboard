import { isAxiosError } from 'axios'

export const getErrorMessage = (e: unknown): string => {
  if (isAxiosError(e)) {
    const msg = e.response?.data
    if (typeof msg === 'object' && msg !== null && 'message' in msg) {
      const serverMessage = (msg as { message?: unknown }).message
      if (typeof serverMessage === 'string') return serverMessage
    }
    return e.message
  }
  if (e instanceof Error) return e.message
  return 'Unknown error'
}
