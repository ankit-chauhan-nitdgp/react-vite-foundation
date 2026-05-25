export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  APP_NAME: import.meta.env.VITE_APP_NAME ?? 'App',
  APP_VERSION: import.meta.env.VITE_APP_VERSION ?? '0.0.0',
  ENABLE_DEVTOOLS: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
  AUTH_STORAGE_KEY: import.meta.env.VITE_AUTH_STORAGE_KEY ?? '__auth__',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE,
} as const
