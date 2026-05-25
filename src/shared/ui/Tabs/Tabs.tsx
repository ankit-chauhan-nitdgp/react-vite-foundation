import { createContext, useContext, useId, useState, type ReactNode } from 'react'
import { cn } from '@core/utils/cn'

interface TabsContextValue {
  value: string
  onChange: (value: string) => void
  baseId: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs components must be used inside <Tabs>.')
  return ctx
}

export interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: ReactNode
  className?: string
}

export function Tabs({ defaultValue = '', value, onValueChange, children, className }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue)
  const baseId = useId()
  const current = value ?? internal
  const onChange = (v: string) => {
    if (value === undefined) setInternal(v)
    onValueChange?.(v)
  }
  return (
    <TabsContext.Provider value={{ value: current, onChange, baseId }}>
      <div className={cn('flex flex-col gap-2', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export interface TabsListProps {
  children: ReactNode
  className?: string
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center gap-1 rounded-md bg-muted p-1 text-muted-foreground',
        className,
      )}
    >
      {children}
    </div>
  )
}

export interface TabsTriggerProps {
  value: string
  children: ReactNode
  disabled?: boolean
  className?: string
}

export function TabsTrigger({ value, children, disabled, className }: TabsTriggerProps) {
  const { value: current, onChange, baseId } = useTabsContext()
  const selected = current === value
  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-trigger-${value}`}
      aria-controls={`${baseId}-panel-${value}`}
      aria-selected={selected}
      disabled={disabled}
      tabIndex={selected ? 0 : -1}
      onClick={() => onChange(value)}
      className={cn(
        'inline-flex items-center justify-center rounded px-3 py-1.5 text-sm font-medium',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:opacity-50 disabled:pointer-events-none',
        selected
          ? 'bg-background text-foreground shadow-sm'
          : 'hover:bg-background/60 hover:text-foreground',
        className,
      )}
    >
      {children}
    </button>
  )
}

export interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { value: current, baseId } = useTabsContext()
  if (current !== value) return null
  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-trigger-${value}`}
      className={cn('focus-visible:outline-none', className)}
    >
      {children}
    </div>
  )
}
