import { toast } from 'sonner'

export interface NotifyOptions {
  description?: string
  duration?: number
  id?: string | number
  action?: { label: string; onClick: () => void }
}

export const notify = {
  success: (message: string, opts?: NotifyOptions) => toast.success(message, opts),
  error: (message: string, opts?: NotifyOptions) => toast.error(message, opts),
  info: (message: string, opts?: NotifyOptions) => toast.info(message, opts),
  warning: (message: string, opts?: NotifyOptions) => toast.warning(message, opts),
  message: (message: string, opts?: NotifyOptions) => toast(message, opts),
  loading: (message: string, opts?: NotifyOptions) => toast.loading(message, opts),
  dismiss: (id?: string | number) => toast.dismiss(id),
  promise: <T>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: unknown) => string)
    },
  ) => toast.promise(promise, messages),
}
