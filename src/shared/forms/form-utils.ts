import type { UseFormSetError, FieldValues, Path } from 'react-hook-form'
import { ApiError } from '@core/api/api-error'

/**
 * Maps an ApiError's fieldErrors onto a react-hook-form instance.
 * Returns `true` if any field-level error was applied (useful to decide
 * whether to also show a toast for top-level error).
 */
export function applyApiErrorToForm<TValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TValues>,
): boolean {
  if (!(error instanceof ApiError)) return false
  const fieldErrors = error.fieldErrors
  if (!fieldErrors) return false
  let applied = false
  for (const [name, messages] of Object.entries(fieldErrors)) {
    const message = Array.isArray(messages) ? messages[0] : String(messages)
    if (!message) continue
    setError(name as Path<TValues>, { type: 'server', message })
    applied = true
  }
  return applied
}
