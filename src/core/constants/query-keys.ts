export const QUERY_KEYS = {
  auth: {
    session: ['auth', 'session'] as const,
    user: ['auth', 'user'] as const,
  },
} as const

export const queryKey = {
  list: (resource: string, params?: Record<string, unknown>) =>
    params ? ([resource, 'list', params] as const) : ([resource, 'list'] as const),
  detail: (resource: string, id: string | number) => [resource, 'detail', id] as const,
  infinite: (resource: string, params?: Record<string, unknown>) =>
    params ? ([resource, 'infinite', params] as const) : ([resource, 'infinite'] as const),
}
