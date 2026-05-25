import { useModalStore } from './modal-store'
import type { ModalPropsRegistry, ModalType } from './types'

export interface OpenModalOptions<T extends ModalType> {
  type: T
  props: ModalPropsRegistry[T]
  onClose?: () => void
}

export function openModal<T extends ModalType>(options: OpenModalOptions<T>): string {
  return useModalStore.getState().open(options.type, options.props, options.onClose)
}

export function closeModal(id?: string): void {
  useModalStore.getState().close(id)
}

export function closeAllModals(): void {
  useModalStore.getState().closeAll()
}

export function useModalController() {
  const open = useModalStore((s) => s.open)
  const close = useModalStore((s) => s.close)
  const closeAll = useModalStore((s) => s.closeAll)
  return { openModal: open, closeModal: close, closeAllModals: closeAll }
}
