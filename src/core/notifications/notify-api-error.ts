import { notify } from './notify'
import { ApiError } from '../api/api-error'

/**
 * Surface an ApiError as a toast in a uniform way. Returns the message
 * displayed so callers can also log or pass it elsewhere.
 */
export function notifyApiError(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof ApiError) {
    if (error.isCancelled) return ''
    if (error.isNetworkError) {
      notify.error('Network error', { description: 'Check your connection and try again.' })
      return 'Network error'
    }
    if (error.isValidationError && error.fieldErrors) {
      const first = Object.values(error.fieldErrors)[0]
      const description = Array.isArray(first) ? first[0] : undefined
      notify.error(error.message || 'Validation failed', { description })
      return error.message
    }
    notify.error(error.message || fallback)
    return error.message || fallback
  }
  const message = error instanceof Error ? error.message : fallback
  notify.error(message)
  return message
}
