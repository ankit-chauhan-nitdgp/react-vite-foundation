import { create } from 'zustand'
import type { UploadItem, UploadStatus } from './types'

interface UploadState {
  items: Record<string, UploadItem>
  enqueue: (item: UploadItem) => void
  update: (id: string, patch: Partial<UploadItem>) => void
  setStatus: (id: string, status: UploadStatus) => void
  setProgress: (id: string, progress: number) => void
  remove: (id: string) => void
  clearCompleted: () => void
  reset: () => void
}

export const useUploadStore = create<UploadState>((set) => ({
  items: {},
  enqueue: (item) => set((s) => ({ items: { ...s.items, [item.id]: item } })),
  update: (id, patch) =>
    set((s) => {
      const existing = s.items[id]
      if (!existing) return s
      return { items: { ...s.items, [id]: { ...existing, ...patch } } }
    }),
  setStatus: (id, status) =>
    set((s) => {
      const existing = s.items[id]
      if (!existing) return s
      return { items: { ...s.items, [id]: { ...existing, status } } }
    }),
  setProgress: (id, progress) =>
    set((s) => {
      const existing = s.items[id]
      if (!existing) return s
      return { items: { ...s.items, [id]: { ...existing, progress } } }
    }),
  remove: (id) =>
    set((s) => {
      const next = { ...s.items }
      delete next[id]
      return { items: next }
    }),
  clearCompleted: () =>
    set((s) => {
      const next: Record<string, UploadItem> = {}
      for (const [k, v] of Object.entries(s.items)) {
        if (v.status !== 'completed') next[k] = v
      }
      return { items: next }
    }),
  reset: () => set({ items: {} }),
}))
