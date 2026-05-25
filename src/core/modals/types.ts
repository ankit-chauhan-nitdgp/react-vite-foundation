import type { ComponentType } from 'react'

/**
 * Augment this interface inside a host product to gain typed `openModal()` calls.
 *
 * @example
 *   // inside the host product
 *   declare module '@core/modals' {
 *     interface ModalPropsRegistry {
 *       'user.invite': { teamId: string }
 *     }
 *   }
 */
export interface ModalPropsRegistry {
  confirm: ConfirmModalProps
  alert: AlertModalProps
}

export type ModalType = keyof ModalPropsRegistry & string

export interface ModalInstance<T extends ModalType = ModalType> {
  id: string
  type: T
  props: ModalPropsRegistry[T]
  onClose?: () => void
}

export type ModalComponent<T extends ModalType> = ComponentType<
  ModalPropsRegistry[T] & {
    modalId: string
    close: () => void
  }
>

export interface ConfirmModalProps {
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
}

export interface AlertModalProps {
  title?: string
  description?: string
  closeLabel?: string
  onClose?: () => void
}
