export { PermissionGate } from './PermissionGate'
export type { PermissionGateProps } from './PermissionGate'
export { ProtectedRoute } from './ProtectedRoute'
export type { ProtectedRouteProps } from './ProtectedRoute'
export { GuestRoute } from './GuestRoute'
export type { GuestRouteProps } from './GuestRoute'
export { usePermissions } from './use-permissions'
export type { UsePermissionsResult } from './use-permissions'
export { useActionGuard } from './use-action-guard'
export type { UseActionGuardOptions } from './use-action-guard'
export {
  evaluate,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  hasRole,
  hasAnyRole,
} from './check'
export type { Permission, PermissionCheck, PermissionContext, RequireOptions, Role } from './types'
