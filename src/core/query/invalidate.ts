import type { QueryKey } from '@tanstack/react-query'
import { queryClient } from './query-client'

export function invalidate(key: QueryKey): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: key })
}

export function invalidateMany(keys: QueryKey[]): Promise<void[]> {
  return Promise.all(keys.map((k) => invalidate(k)))
}

export function invalidatePrefix(prefix: QueryKey): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: prefix, exact: false })
}

export function removeQueries(key: QueryKey): void {
  queryClient.removeQueries({ queryKey: key })
}

export function setQueryData<T>(key: QueryKey, updater: T | ((prev: T | undefined) => T)): void {
  queryClient.setQueryData<T>(key, updater as never)
}

export function getQueryData<T>(key: QueryKey): T | undefined {
  return queryClient.getQueryData<T>(key)
}
