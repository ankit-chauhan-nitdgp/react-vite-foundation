import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from './auth-store'
import { ROUTES } from '../constants/routes'

export interface UseRequireAuthOptions {
  redirectTo?: string
  preserveFrom?: boolean
}

export function useRequireAuth(options: UseRequireAuthOptions = {}): void {
  const { redirectTo = ROUTES.auth.login, preserveFrom = true } = options
  const status = useAuthStore((s) => s.status)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (status === 'unauthenticated') {
      navigate(redirectTo, {
        replace: true,
        state: preserveFrom ? { from: location } : undefined,
      })
    }
  }, [status, redirectTo, preserveFrom, navigate, location])
}
