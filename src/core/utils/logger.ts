import { ENV } from '../constants/env'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LoggerOptions {
  scope?: string
}

function format(scope: string | undefined, level: LogLevel): string {
  const tag = scope ? `[${scope}]` : ''
  return `${tag}[${level.toUpperCase()}]`
}

export function createLogger(options: LoggerOptions = {}) {
  const { scope } = options
  const enabled = ENV.IS_DEV

  return {
    debug: (...args: unknown[]) => {
      if (enabled) console.debug(format(scope, 'debug'), ...args)
    },
    info: (...args: unknown[]) => {
      if (enabled) console.info(format(scope, 'info'), ...args)
    },
    warn: (...args: unknown[]) => console.warn(format(scope, 'warn'), ...args),
    error: (...args: unknown[]) => console.error(format(scope, 'error'), ...args),
  }
}

export const logger = createLogger()
