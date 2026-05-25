import type { ApiErrorPayload } from '../types/api.types'

export class ApiError extends Error {
  public readonly status: number
  public readonly code?: string
  public readonly details?: Record<string, unknown>
  public readonly fieldErrors?: Record<string, string[]>
  public readonly isNetworkError: boolean
  public readonly isCancelled: boolean

  constructor(params: {
    message: string
    status: number
    code?: string
    details?: Record<string, unknown>
    fieldErrors?: Record<string, string[]>
    isNetworkError?: boolean
    isCancelled?: boolean
  }) {
    super(params.message)
    this.name = 'ApiError'
    this.status = params.status
    this.code = params.code
    this.details = params.details
    this.fieldErrors = params.fieldErrors
    this.isNetworkError = params.isNetworkError ?? false
    this.isCancelled = params.isCancelled ?? false
  }

  static fromPayload(payload: ApiErrorPayload, status: number): ApiError {
    return new ApiError({
      message: payload.message,
      status,
      code: payload.code,
      details: payload.details,
      fieldErrors: payload.fieldErrors,
    })
  }

  get isUnauthorized(): boolean {
    return this.status === 401
  }

  get isForbidden(): boolean {
    return this.status === 403
  }

  get isNotFound(): boolean {
    return this.status === 404
  }

  get isValidationError(): boolean {
    return this.status === 422 || Boolean(this.fieldErrors)
  }

  get isServerError(): boolean {
    return this.status >= 500
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError
}
