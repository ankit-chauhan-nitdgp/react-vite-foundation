import axios, { type AxiosError } from 'axios'
import { ApiError } from './api-error'
import type { ApiErrorPayload } from '../types/api.types'

export function normalizeAxiosError(error: unknown): ApiError {
  if (axios.isCancel(error)) {
    return new ApiError({
      message: 'Request cancelled',
      status: 0,
      isCancelled: true,
    })
  }

  if (axios.isAxiosError(error)) {
    return fromAxiosError(error)
  }

  if (error instanceof ApiError) return error

  if (error instanceof Error) {
    return new ApiError({ message: error.message, status: 0, isNetworkError: true })
  }

  return new ApiError({ message: 'Unknown error', status: 0 })
}

function fromAxiosError(error: AxiosError): ApiError {
  if (!error.response) {
    return new ApiError({
      message: error.message || 'Network error',
      status: 0,
      isNetworkError: true,
      code: error.code,
    })
  }

  const { status, data } = error.response
  const payload = (data ?? {}) as Partial<ApiErrorPayload> & { error?: ApiErrorPayload }
  const errorBody = payload.error ?? payload

  return new ApiError({
    message: errorBody.message ?? error.message ?? `Request failed with status ${status}`,
    status,
    code: errorBody.code,
    details: errorBody.details,
    fieldErrors: errorBody.fieldErrors,
  })
}
