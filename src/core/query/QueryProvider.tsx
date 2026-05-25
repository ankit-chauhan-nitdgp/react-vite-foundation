import { QueryClientProvider } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { queryClient as defaultClient } from './query-client'

export interface QueryProviderProps {
  client?: QueryClient
  children: ReactNode
}

export function QueryProvider({ client = defaultClient, children }: QueryProviderProps) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
