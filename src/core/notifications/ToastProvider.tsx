import { Toaster, type ToasterProps } from 'sonner'

export interface ToastProviderProps extends Omit<ToasterProps, 'theme'> {
  /** Inherits from ThemeProvider when set to 'system' (default). */
  theme?: 'light' | 'dark' | 'system'
}

export function ToastProvider({
  position = 'bottom-right',
  richColors = true,
  closeButton = true,
  theme = 'system',
  ...rest
}: ToastProviderProps) {
  return (
    <Toaster
      position={position}
      richColors={richColors}
      closeButton={closeButton}
      theme={theme}
      {...rest}
    />
  )
}
