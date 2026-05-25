/**
 * Permission strings follow `resource.action` convention (e.g. `users.read`).
 * Roles are plain strings to keep this layer business-agnostic.
 */
export type Permission = string
export type Role = string

export interface PermissionContext {
  permissions: Permission[]
  roles: Role[]
}

export type PermissionCheck =
  | Permission
  | Permission[]
  | ((ctx: PermissionContext) => boolean)

export interface RequireOptions {
  /** Match strategy when multiple permissions are given. Default: 'all'. */
  match?: 'all' | 'any'
}
