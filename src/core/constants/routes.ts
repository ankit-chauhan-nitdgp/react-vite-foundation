export const ROUTES = {
  root: '/',

  auth: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },

  app: {
    dashboard: '/dashboard',
    settings: '/settings',
  },

  errors: {
    notFound: '/404',
    forbidden: '/403',
    serverError: '/500',
  },
} as const

export type AppRoute = string
