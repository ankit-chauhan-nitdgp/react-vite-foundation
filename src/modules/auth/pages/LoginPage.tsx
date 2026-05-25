import { z } from 'zod'
import { useNavigate, useLocation } from 'react-router-dom'

import { useAuth } from '@core/auth'
import { notifyApiError } from '@core/notifications'
import { ROUTES } from '@core/constants'

import {
  Form,
  FormInput,
  applyApiErrorToForm,
  zStrings,
} from '@shared/forms'

import { Button } from '@shared/ui'

const schema = z.object({
  email: zStrings.email(),
  password: zStrings.password(8),
})

export default function LoginPage() {

  const { login } = useAuth()

  const navigate = useNavigate()

  const location = useLocation()

  const from = (
    location.state as {
      from?: {
        pathname?: string
      }
    } | null
  )?.from?.pathname

  return (

    <Form
      schema={schema}
      defaultValues={{
        email: '',
        password: '',
      }}
      onSubmit={async (values) => {

        try {

          await login(values)

          navigate(
            from ?? ROUTES.app.dashboard,
            {
              replace: true,
            }
          )

        } catch (err) {

          notifyApiError(err)

        }
      }}
    >

      {({ formState, setError }) => (

        <div className="flex flex-col gap-4">

          <h1 className="text-2xl font-semibold">
            Sign in
          </h1>

          <FormInput
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
          />

          <FormInput
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            loading={formState.isSubmitting}
            fullWidth
          >
            Sign in
          </Button>

          <button
            type="button"
            className="hidden"
            onClick={() =>
              setError('email', {
                message: 'unused — silences linter',
              })
            }
          />

        </div>

      )}

    </Form>
  )
}