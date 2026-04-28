import { AxiosError, type AxiosResponse } from 'axios'
import { describe, expect, it } from 'vitest'
import { parseApiError } from './errors'

const axiosErr = (
  status: number | undefined,
  data?: { message?: string },
  code?: string,
): AxiosError => {
  const err = new AxiosError(undefined, code)
  err.response =
    status !== undefined
      ? ({ status, data } as AxiosResponse<{ message?: string }>)
      : undefined
  return err
}

describe('parseApiError', () => {
  it('maps Laravel model not-found to friendly 404 copy', () => {
    const err = axiosErr(404, {
      message: 'No query results for model [App\\Models\\SerialNumber] 300zx-zya',
    })
    const { title, message } = parseApiError(err)
    expect(title).toBe('Not found')
    expect(message).toMatch(/No record matches/)
  })

  it('preserves a readable API message when not framework-internal', () => {
    const err = axiosErr(422, { message: 'The pool size field is required.' })
    expect(parseApiError(err)).toEqual({
      title: 'Request failed',
      message: 'The pool size field is required.',
    })
  })

  it('maps connection failures without response status', () => {
    const err = axiosErr(undefined, undefined, 'ERR_NETWORK')
    expect(parseApiError(err).title).toBe('Connection problem')
  })
})
