type StorageDriver = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

const memoryStore = new Map<string, string>()

const memoryDriver: StorageDriver = {
  getItem: (k) => memoryStore.get(k) ?? null,
  setItem: (k, v) => void memoryStore.set(k, v),
  removeItem: (k) => void memoryStore.delete(k),
}

function resolveDriver(persistent: boolean): StorageDriver {
  if (typeof window === 'undefined') return memoryDriver
  try {
    return persistent ? window.localStorage : window.sessionStorage
  } catch {
    return memoryDriver
  }
}

export interface StorageOptions {
  persistent?: boolean
}

export const storage = {
  get<T>(key: string, opts: StorageOptions = { persistent: true }): T | null {
    const driver = resolveDriver(opts.persistent ?? true)
    const raw = driver.getItem(key)
    if (raw == null) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  },
  set<T>(key: string, value: T, opts: StorageOptions = { persistent: true }): void {
    const driver = resolveDriver(opts.persistent ?? true)
    driver.setItem(key, JSON.stringify(value))
  },
  remove(key: string, opts: StorageOptions = { persistent: true }): void {
    const driver = resolveDriver(opts.persistent ?? true)
    driver.removeItem(key)
  },
}
