import { Outlet } from 'react-router-dom'
import { DashboardLayout } from './DashboardLayout'
import { Sidebar, type SidebarSection } from '@shared/ui/Sidebar'
import { ENV } from '@core/constants/env'

/**
 * Default opinionated host for the dashboard area. Replace `sections` and
 * `topbarSlot` in host products without touching the layout primitive itself.
 */
export interface AppShellProps {
  sections?: SidebarSection[]
  topbarSlot?: React.ReactNode
}

const EMPTY_SECTIONS: SidebarSection[] = []

export function AppShell({ sections = EMPTY_SECTIONS, topbarSlot }: AppShellProps) {
  return (
    <DashboardLayout
      sidebar={
        <Sidebar
          header={<div className="font-semibold text-foreground">{ENV.APP_NAME}</div>}
          sections={sections}
        />
      }
      topbar={topbarSlot ?? <div />}
    >
      <Outlet />
    </DashboardLayout>
  )
}
