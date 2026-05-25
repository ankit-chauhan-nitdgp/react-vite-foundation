import * as Dialog from '@radix-ui/react-dialog'
import { forwardRef, type ReactNode } from 'react'
import { cn } from '@core/utils/cn'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw] h-[90vh]',
}

export interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  size?: ModalSize
  closeOnOverlayClick?: boolean
  showClose?: boolean
  className?: string
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  showClose = true,
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          onPointerDownOutside={(e) => {
            if (!closeOnOverlayClick) e.preventDefault()
          }}
          onEscapeKeyDown={(e) => {
            if (!closeOnOverlayClick) e.preventDefault()
          }}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'w-full bg-background border border-border rounded-lg shadow-lg',
            'flex flex-col max-h-[90vh]',
            sizeClasses[size],
            className,
          )}
        >
          {(title || description || showClose) && (
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
              <div className="flex flex-col gap-1">
                {title && (
                  <Dialog.Title className="text-lg font-semibold text-foreground">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="text-sm text-muted-foreground">
                    {description}
                  </Dialog.Description>
                )}
              </div>
              {showClose && (
                <Dialog.Close
                  aria-label="Close"
                  className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <CloseIcon />
                </Dialog.Close>
              )}
            </div>
          )}
          <div className="flex-1 overflow-auto px-6 py-4">{children}</div>
          {footer && (
            <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

const CloseIcon = forwardRef<SVGSVGElement>(function CloseIcon(_, ref) {
  return (
    <svg
      ref={ref}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
})
