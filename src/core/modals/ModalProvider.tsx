import { useEffect, type ReactNode } from 'react'
import { useModalStore } from './modal-store'
import { getRegisteredModal, registerModal } from './modal-registry'
import { ConfirmModal } from './builtin/ConfirmModal'
import { AlertModal } from './builtin/AlertModal'
import { logger } from '../utils/logger'

function registerBuiltins(): void {
  registerModal('confirm', ConfirmModal)
  registerModal('alert', AlertModal)
}
registerBuiltins()

export interface ModalProviderProps {
  children: ReactNode
}

export function ModalProvider({ children }: ModalProviderProps) {
  const stack = useModalStore((s) => s.stack)
  const close = useModalStore((s) => s.close)

  useEffect(() => {
    if (!stack.length) return
    const onKey = (e: KeyboardEvent) => {
      // Modal component handles its own escape; this is a safety net for
      // custom modals that opt out of Radix Dialog.
      if (e.key === 'Escape' && stack.length > 0) {
        const top = stack[stack.length - 1]
        if (top) close(top.id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [stack, close])

  return (
    <>
      {children}
      {stack.map((instance) => {
        const Component = getRegisteredModal(instance.type)
        if (!Component) {
          logger.warn(`No modal registered for type "${instance.type}"`)
          return null
        }
        return (
          <Component
            key={instance.id}
            {...instance.props}
            modalId={instance.id}
            close={() => close(instance.id)}
          />
        )
      })}
    </>
  )
}
