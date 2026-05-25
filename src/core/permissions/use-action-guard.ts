import { useCallback } from 'react'
import { usePermissions } from './use-permissions'
import type { PermissionCheck, RequireOptions } from './types'

export interface UseActionGuardOptions extends RequireOptions {
  onDenied?: (check: PermissionCheck) => void
}

/**
 * Wrap any action handler so it short-circuits when the user lacks permission.
 *
 * @example
 *   const guard = useActionGuard({ onDenied: () => notify.error('Forbidden') })
 *   const onDelete = guard('items.delete', () => deleteItem(id))
 */
export function useActionGuard(options: UseActionGuardOptions = {}) {
  const { can } = usePermissions()
  const { onDenied, match } = options

  return useCallback(
    <Args extends unknown[], R>(check: PermissionCheck, fn: (...args: Args) => R) => {
      return (...args: Args): R | undefined => {
        if (!can(check, { match })) {
          onDenied?.(check)
          return undefined
        }
        return fn(...args)
      }
    },
    [can, match, onDenied],
  )
}
