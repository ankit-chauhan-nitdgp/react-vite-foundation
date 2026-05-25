import { type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@core/utils/cn'

export interface SidebarNavItem {
  key: string
  label: ReactNode
  to: string
  icon?: ReactNode
  end?: boolean
  badge?: ReactNode
}

export interface SidebarSection {
  key: string
  label?: ReactNode
  items: SidebarNavItem[]
}

export interface SidebarProps {
  header?: ReactNode
  footer?: ReactNode
  sections: SidebarSection[]
  collapsed?: boolean
  className?: string
}

export function Sidebar({ header, footer, sections, collapsed, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-border bg-card text-card-foreground',
        collapsed ? 'w-16' : 'w-64',
        'transition-[width] duration-200',
        className,
      )}
      aria-label="Sidebar navigation"
    >
      {header && <div className="border-b border-border px-4 py-4">{header}</div>}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {sections.map((section) => (
          <div key={section.key} className="mb-4 last:mb-0">
            {section.label && !collapsed && (
              <div className="mb-1 px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {section.label}
              </div>
            )}
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <li key={item.key}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors',
                        'hover:bg-muted hover:text-foreground',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                        isActive ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground',
                        collapsed && 'justify-center',
                      )
                    }
                  >
                    {item.icon && <span className="shrink-0" aria-hidden>{item.icon}</span>}
                    {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                    {!collapsed && item.badge}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      {footer && <div className="border-t border-border px-4 py-3">{footer}</div>}
    </aside>
  )
}
