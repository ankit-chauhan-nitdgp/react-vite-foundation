import { ENV } from './env'

export const STORAGE_KEYS = {
  auth: ENV.AUTH_STORAGE_KEY,
  theme: '__theme__',
  sidebar: '__sidebar__',
} as const
