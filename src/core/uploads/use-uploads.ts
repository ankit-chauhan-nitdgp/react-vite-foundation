import { useMemo } from 'react'
import { useUploadStore } from './upload-store'
import type { UploadItem } from './types'

export interface UseUploadsResult {
  items: UploadItem[]
  byStatus: {
    queued: UploadItem[]
    uploading: UploadItem[]
    completed: UploadItem[]
    failed: UploadItem[]
    cancelled: UploadItem[]
    paused: UploadItem[]
  }
  /** Aggregate progress (0–100) across in-flight + queued items. */
  totalProgress: number
  isUploading: boolean
}

export function useUploads(): UseUploadsResult {
  const items = useUploadStore((s) => s.items)
  return useMemo(() => {
    const list = Object.values(items)
    const byStatus = {
      queued: list.filter((i) => i.status === 'queued'),
      uploading: list.filter((i) => i.status === 'uploading'),
      completed: list.filter((i) => i.status === 'completed'),
      failed: list.filter((i) => i.status === 'failed'),
      cancelled: list.filter((i) => i.status === 'cancelled'),
      paused: list.filter((i) => i.status === 'paused'),
    }
    const active = list.filter((i) => i.status === 'uploading' || i.status === 'queued')
    const totalProgress = active.length
      ? Math.round(active.reduce((sum, i) => sum + i.progress, 0) / active.length)
      : list.length === 0
        ? 0
        : 100
    return {
      items: list,
      byStatus,
      totalProgress,
      isUploading: byStatus.uploading.length > 0 || byStatus.queued.length > 0,
    }
  }, [items])
}
