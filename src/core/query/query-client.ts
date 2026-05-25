import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '../api/api-error'

export interface CreateQueryClientOptions {
  staleTime?: number
  gcTime?: number
  retry?: number
}

const DEFAULTS = { staleTime: 60_000, gcTime: 5 * 60_000, retry: 1 }

export function createQueryClient(options: CreateQueryClientOptions = {}): QueryClient {
  const { staleTime, gcTime, retry } = { ...DEFAULTS, ...options }
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime,
        gcTime,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (error instanceof ApiError) {
            if (error.isUnauthorized || error.isForbidden || error.isNotFound) return false
            if (error.isValidationError) return false
            if (error.isCancelled) return false
          }
          return failureCount < retry
        },
      },
      mutations: {
        retry: false,
      },
    },
  })
}

export const queryClient = createQueryClient()
