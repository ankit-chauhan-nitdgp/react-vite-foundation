export { ModalProvider } from './ModalProvider'
export type { ModalProviderProps } from './ModalProvider'
export { openModal, closeModal, closeAllModals, useModalController } from './modal-controller'
export type { OpenModalOptions } from './modal-controller'
export { registerModal, getRegisteredModal, listRegisteredModals } from './modal-registry'
export { useModalStore } from './modal-store'
export type {
  ModalType,
  ModalInstance,
  ModalComponent,
  ModalPropsRegistry,
  ConfirmModalProps,
  AlertModalProps,
} from './types'
