import { create } from 'zustand'
import { generateId } from '../utils/id'
import type { ModalInstance, ModalPropsRegistry, ModalType } from './types'

interface ModalState {
  stack: ModalInstance[]
  open: <T extends ModalType>(
    type: T,
    props: ModalPropsRegistry[T],
    onClose?: () => void,
  ) => string
  close: (id?: string) => void
  closeAll: () => void
}

export const useModalStore = create<ModalState>((set, get) => ({
  stack: [],
  open: (type, props, onClose) => {
    const id = generateId('modal')
    set((state) => ({
      stack: [...state.stack, { id, type, props, onClose } as ModalInstance],
    }))
    return id
  },
  close: (id) => {
    const current = get().stack
    const target = id ? current.find((m) => m.id === id) : current[current.length - 1]
    if (!target) return
    target.onClose?.()
    set({ stack: current.filter((m) => m.id !== target.id) })
  },
  closeAll: () => {
    for (const m of get().stack) m.onClose?.()
    set({ stack: [] })
  },
}))
