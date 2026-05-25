export type UploadStatus =
  | 'queued'
  | 'uploading'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled'

export interface UploadItem<TResult = unknown> {
  id: string
  file: File
  status: UploadStatus
  progress: number
  attempt: number
  maxAttempts: number
  error?: string
  result?: TResult
  metadata?: Record<string, unknown>
  startedAt?: number
  completedAt?: number
}

export interface UploadProgressEvent {
  id: string
  loaded: number
  total: number
  progress: number
}

/**
 * Pluggable transport. Host products provide the actual implementation
 * (e.g. signed S3 PUT, multipart, presigned tus, etc.). The foundation
 * itself ships no backend-specific logic.
 */
export interface UploadTransport<TResult = unknown> {
  upload: (
    item: UploadItem,
    onProgress: (event: UploadProgressEvent) => void,
    signal: AbortSignal,
  ) => Promise<TResult>
}

export interface UploadOptions {
  /** Max simultaneous active uploads. Default: 3. */
  concurrency?: number
  /** Max retry attempts per item. Default: 3. */
  maxAttempts?: number
  /** Base retry delay in ms (exponential backoff). Default: 500. */
  retryDelayMs?: number
  /** Optional metadata persisted on every item. */
  metadata?: Record<string, unknown>
}
