import { storage } from '../utils/storage'
import { STORAGE_KEYS } from '../constants/storage-keys'
import type { AuthUser } from '../types/auth.types'

const USER_KEY = `${STORAGE_KEYS.auth}::user`

export const sessionManager = {
  getUser(): AuthUser | null {
    return storage.get<AuthUser>(USER_KEY)
  },
  setUser(user: AuthUser): void {
    storage.set(USER_KEY, user)
  },
  clear(): void {
    storage.remove(USER_KEY)
  },
}
