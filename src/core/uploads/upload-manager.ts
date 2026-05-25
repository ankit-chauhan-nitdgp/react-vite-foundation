import { sleep } from '../utils/promise'
import { generateId } from '../utils/id'
import { logger } from '../utils/logger'
import { useUploadStore } from './upload-store'
import type { UploadItem, UploadOptions, UploadTransport } from './types'

const DEFAULTS: Required<Omit<UploadOptions, 'metadata'>> = {
  concurrency: 3,
  maxAttempts: 3,
  retryDelayMs: 500,
}

export class UploadManager<TResult = unknown> {
  private readonly transport: UploadTransport<TResult>
  private readonly options: Required<Omit<UploadOptions, 'metadata'>> & Pick<UploadOptions, 'metadata'>
  private readonly controllers = new Map<string, AbortController>()
  private active = 0
  private queue: string[] = []

  constructor(transport: UploadTransport<TResult>, options: UploadOptions = {}) {
    this.transport = transport
    this.options = { ...DEFAULTS, ...options }
  }

  add(file: File, metadata?: Record<string, unknown>): UploadItem {
    const item: UploadItem = {
      id: generateId('upload'),
      file,
      status: 'queued',
      progress: 0,
      attempt: 0,
      maxAttempts: this.options.maxAttempts,
      metadata: { ...this.options.metadata, ...metadata },
    }
    useUploadStore.getState().enqueue(item)
    this.queue.push(item.id)
    void this.pump()
    return item
  }

  addMany(files: File[], metadata?: Record<string, unknown>): UploadItem[] {
    return files.map((f) => this.add(f, metadata))
  }

  cancel(id: string): void {
    this.controllers.get(id)?.abort()
    this.controllers.delete(id)
    useUploadStore.getState().setStatus(id, 'cancelled')
  }

  retry(id: string): void {
    const item = useUploadStore.getState().items[id]
    if (!item) return
    if (item.status !== 'failed' && item.status !== 'cancelled') return
    useUploadStore.getState().update(id, { status: 'queued', attempt: 0, error: undefined, progress: 0 })
    this.queue.push(id)
    void this.pump()
  }

  private async pump(): Promise<void> {
    while (this.active < this.options.concurrency && this.queue.length > 0) {
      const id = this.queue.shift()!
      this.active += 1
      void this.run(id).finally(() => {
        this.active -= 1
        if (this.queue.length > 0) void this.pump()
      })
    }
  }

  private async run(id: string): Promise<void> {
    const store = useUploadStore.getState()
    const item = store.items[id]
    if (!item || item.status === 'cancelled') return

    const controller = new AbortController()
    this.controllers.set(id, controller)
    store.update(id, { status: 'uploading', startedAt: Date.now(), attempt: item.attempt + 1 })

    try {
      const result = (await this.transport.upload(
        useUploadStore.getState().items[id]!,
        ({ progress }) => store.setProgress(id, Math.round(progress * 100) / 100),
        controller.signal,
      )) as TResult
      store.update(id, { status: 'completed', progress: 100, result, completedAt: Date.now() })
    } catch (err) {
      if (controller.signal.aborted) {
        store.update(id, { status: 'cancelled' })
        return
      }
      logger.warn(`Upload ${id} attempt failed`, err)
      const current = useUploadStore.getState().items[id]
      if (!current) return
      if (current.attempt < this.options.maxAttempts) {
        const delay = this.options.retryDelayMs * 2 ** (current.attempt - 1)
        await sleep(delay)
        this.queue.push(id)
        store.update(id, { status: 'queued', progress: 0 })
      } else {
        store.update(id, {
          status: 'failed',
          error: err instanceof Error ? err.message : 'Upload failed',
        })
      }
    } finally {
      this.controllers.delete(id)
    }
  }

  cancelAll(): void {
    for (const id of this.controllers.keys()) this.cancel(id)
    this.queue = []
  }
}
