import { useMemo } from 'react'
import { useAuthStore } from '../auth/auth-store'
import {
  evaluate,
  hasAllPermissions,
  hasAnyPermission,
  hasAnyRole,
  hasPermission,
  hasRole,
} from './check'
import type { Permission, PermissionCheck, PermissionContext, RequireOptions, Role } from './types'

export interface UsePermissionsResult extends PermissionContext {
  can: (check: PermissionCheck, opts?: RequireOptions) => boolean
  has: (permission: Permission) => boolean
  hasAll: (permissions: Permission[]) => boolean
  hasAny: (permissions: Permission[]) => boolean
  hasRole: (role: Role) => boolean
  hasAnyRole: (roles: Role[]) => boolean
}

export function usePermissions(): UsePermissionsResult {
  const user = useAuthStore((s) => s.user)

  return useMemo(() => {
    const ctx: PermissionContext = {
      permissions: user?.permissions ?? [],
      roles: user?.roles ?? [],
    }
    return {
      ...ctx,
      can: (check, opts) => evaluate(ctx, check, opts),
      has: (p) => hasPermission(ctx, p),
      hasAll: (ps) => hasAllPermissions(ctx, ps),
      hasAny: (ps) => hasAnyPermission(ctx, ps),
      hasRole: (r) => hasRole(ctx, r),
      hasAnyRole: (rs) => hasAnyRole(ctx, rs),
    }
  }, [user])
}
