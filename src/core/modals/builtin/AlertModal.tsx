import { Modal } from '@shared/ui/Modal'
import { Button } from '@shared/ui/Button'
import type { AlertModalProps } from '../types'

export interface AlertModalHostProps extends AlertModalProps {
  modalId: string
  close: () => void
}

export function AlertModal({
  title = 'Notice',
  description,
  closeLabel = 'OK',
  onClose,
  close,
}: AlertModalHostProps) {
  const handleClose = () => {
    onClose?.()
    close()
  }
  return (
    <Modal
      open
      onOpenChange={(o) => !o && handleClose()}
      title={title}
      description={description}
      size="sm"
      footer={
        <Button onClick={handleClose}>
          {closeLabel}
        </Button>
      }
    />
  )
}
