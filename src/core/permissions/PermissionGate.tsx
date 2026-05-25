import type { ReactNode } from 'react'
import { usePermissions } from './use-permissions'
import type { PermissionCheck, RequireOptions } from './types'

export interface PermissionGateProps extends RequireOptions {
  permission?: PermissionCheck
  role?: string | string[]
  fallback?: ReactNode
  /** Render `children` only if check returns false. */
  invert?: boolean
  children: ReactNode
}

export function PermissionGate({
  permission,
  role,
  match,
  fallback = null,
  invert = false,
  children,
}: PermissionGateProps) {
  const { can, hasRole, hasAnyRole } = usePermissions()

  let allowed = true
  if (permission !== undefined) allowed = allowed && can(permission, { match })
  if (role !== undefined) {
    allowed = allowed && (Array.isArray(role) ? hasAnyRole(role) : hasRole(role))
  }

  const shouldRender = invert ? !allowed : allowed
  return <>{shouldRender ? children : fallback}</>
}
