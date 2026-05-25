import {
  useRef,
  useState,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cn } from '@core/utils/cn'
import { useOnClickOutside } from '@core/hooks/use-on-click-outside'

export interface DropdownItem {
  key: string
  label: ReactNode
  icon?: ReactNode
  onSelect?: () => void
  disabled?: boolean
  destructive?: boolean
  separator?: boolean
}

export interface DropdownProps {
  trigger: ReactElement<{ onClick?: (e: React.MouseEvent) => void }>
  items: DropdownItem[]
  align?: 'start' | 'end'
  className?: string
}

export function Dropdown({ trigger, items, align = 'start', className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, () => setOpen(false), { enabled: open })

  const triggerEl = isValidElement(trigger)
    ? cloneElement(trigger, {
        onClick: (e: React.MouseEvent) => {
          trigger.props.onClick?.(e)
          setOpen((v) => !v)
        },
      })
    : trigger

  return (
    <div ref={ref} className={cn('relative inline-block', className)}>
      {triggerEl}
      {open && (
        <div
          role="menu"
          className={cn(
            'absolute z-40 mt-1 min-w-[180px] rounded-md border border-border bg-popover p-1 shadow-md',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          {items.map((item) =>
            item.separator ? (
              <div key={item.key} className="my-1 h-px bg-border" />
            ) : (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  if (item.disabled) return
                  item.onSelect?.()
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-left',
                  'hover:bg-muted focus-visible:bg-muted focus-visible:outline-none',
                  'disabled:opacity-50 disabled:pointer-events-none',
                  item.destructive && 'text-destructive hover:bg-destructive/10',
                )}
              >
                {item.icon}
                <span className="flex-1">{item.label}</span>
              </button>
            ),
          )}
        </div>
      )}
    </div>
  )
}
