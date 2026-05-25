import type { QueryParams } from '../types/api.types'

export function buildQueryString(params?: QueryParams): string {
  if (!params) return ''
  const usp = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    usp.append(key, String(value))
  }
  const qs = usp.toString()
  return qs ? `?${qs}` : ''
}

export function buildUrl(path: string, params?: QueryParams): string {
  return `${path}${buildQueryString(params)}`
}
