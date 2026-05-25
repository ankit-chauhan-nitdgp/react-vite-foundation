import { useState } from 'react'
import { Modal } from '@shared/ui/Modal'
import { Button } from '@shared/ui/Button'
import type { ConfirmModalProps } from '../types'

export interface ConfirmModalHostProps extends ConfirmModalProps {
  modalId: string
  close: () => void
}

export function ConfirmModal({
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
  close,
}: ConfirmModalHostProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    try {
      setLoading(true)
      await onConfirm()
      close()
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    onCancel?.()
    close()
  }

  return (
    <Modal
      open
      onOpenChange={(o) => !o && handleCancel()}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={handleCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'danger' : 'primary'}
            onClick={handleConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    />
  )
}
