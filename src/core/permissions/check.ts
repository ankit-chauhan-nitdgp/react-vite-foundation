import type {
  Permission,
  PermissionCheck,
  PermissionContext,
  RequireOptions,
  Role,
} from './types'

const WILDCARD = '*'

function matchPermission(granted: Permission, required: Permission): boolean {
  if (granted === required || granted === WILDCARD) return true
  if (granted.endsWith(`.${WILDCARD}`)) {
    const prefix = granted.slice(0, -1)
    return required.startsWith(prefix)
  }
  return false
}

export function hasPermission(ctx: PermissionContext, required: Permission): boolean {
  return ctx.permissions.some((p) => matchPermission(p, required))
}

export function hasAllPermissions(ctx: PermissionContext, required: Permission[]): boolean {
  return required.every((p) => hasPermission(ctx, p))
}

export function hasAnyPermission(ctx: PermissionContext, required: Permission[]): boolean {
  return required.some((p) => hasPermission(ctx, p))
}

export function hasRole(ctx: PermissionContext, role: Role): boolean {
  return ctx.roles.includes(role)
}

export function hasAnyRole(ctx: PermissionContext, roles: Role[]): boolean {
  return roles.some((r) => hasRole(ctx, r))
}

export function evaluate(
  ctx: PermissionContext,
  check: PermissionCheck,
  options: RequireOptions = {},
): boolean {
  if (typeof check === 'function') return check(ctx)
  if (typeof check === 'string') return hasPermission(ctx, check)
  if (Array.isArray(check)) {
    return options.match === 'any'
      ? hasAnyPermission(ctx, check)
      : hasAllPermissions(ctx, check)
  }
  return false
}
