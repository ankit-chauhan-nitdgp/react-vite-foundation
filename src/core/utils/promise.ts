export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface RetryOptions {
  attempts?: number
  delayMs?: number
  factor?: number
  maxDelayMs?: number
  shouldRetry?: (error: unknown, attempt: number) => boolean
  signal?: AbortSignal
}

export async function retry<T>(
  fn: (attempt: number) => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    attempts = 3,
    delayMs = 300,
    factor = 2,
    maxDelayMs = 10_000,
    shouldRetry = () => true,
    signal,
  } = options

  let attempt = 0
  let lastError: unknown

  while (attempt < attempts) {
    if (signal?.aborted) throw signal.reason ?? new Error('Aborted')
    try {
      return await fn(attempt)
    } catch (err) {
      lastError = err
      attempt += 1
      if (attempt >= attempts || !shouldRetry(err, attempt)) break
      const wait = Math.min(delayMs * Math.pow(factor, attempt - 1), maxDelayMs)
      await sleep(wait)
    }
  }
  throw lastError
}
