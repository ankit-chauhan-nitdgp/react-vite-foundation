import { PageHeader, Card, CardContent } from '@shared/ui'
import { useAuth } from '@core/auth'

export default function DashboardPage() {

  const { user } = useAuth()

  return (

    <div className="flex flex-col gap-6">

      <PageHeader
        title={`Welcome${user?.name ? `, ${user.name}` : ''}`}
        description="Your SAS dashboard"
      />

      <Card>

        <CardContent>
          Empty for now — drop widgets here.
        </CardContent>

      </Card>

    </div>
  )
}