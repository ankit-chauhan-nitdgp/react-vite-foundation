import {
  useQuery,
  useMutation,
  type QueryKey,
  type UseQueryOptions,
  type UseMutationOptions,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query'
import type { ApiError } from '../api/api-error'

export interface CreateQueryHookOptions<TArgs, TData> {
  /** Stable key prefix or factory. */
  key: (args: TArgs) => QueryKey
  fetcher: (args: TArgs) => Promise<TData>
  /** Default overrides applied at hook creation time. */
  defaults?: Omit<UseQueryOptions<TData, ApiError, TData, QueryKey>, 'queryKey' | 'queryFn'>
}

export type QueryHook<TArgs, TData> = (
  args: TArgs,
  overrides?: Omit<UseQueryOptions<TData, ApiError, TData, QueryKey>, 'queryKey' | 'queryFn'>,
) => UseQueryResult<TData, ApiError>

/**
 * Build a typed query hook from a key + fetcher.
 *
 * @example
 *   const useThings = createQueryHook({
 *     key: (id: string) => ['things', id],
 *     fetcher: (id) => api.get<Thing>(`/things/${id}`),
 *   })
 */
export function createQueryHook<TArgs, TData>(
  options: CreateQueryHookOptions<TArgs, TData>,
): QueryHook<TArgs, TData> {
  return (args, overrides) =>
    useQuery<TData, ApiError, TData, QueryKey>({
      queryKey: options.key(args),
      queryFn: () => options.fetcher(args),
      ...options.defaults,
      ...overrides,
    })
}

export interface CreateMutationHookOptions<TVariables, TData> {
  mutationFn: (variables: TVariables) => Promise<TData>
  defaults?: UseMutationOptions<TData, ApiError, TVariables>
}

export type MutationHook<TVariables, TData> = (
  overrides?: UseMutationOptions<TData, ApiError, TVariables>,
) => UseMutationResult<TData, ApiError, TVariables>

export function createMutationHook<TVariables, TData>(
  options: CreateMutationHookOptions<TVariables, TData>,
): MutationHook<TVariables, TData> {
  return (overrides) =>
    useMutation<TData, ApiError, TVariables>({
      mutationFn: options.mutationFn,
      ...options.defaults,
      ...overrides,
    })
}
