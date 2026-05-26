# React Vite Foundation — Internal Engineering Handbook

> This document is the **canonical implementation guide** for the foundation.
> It is not marketing material — it is the contract every host product builds on top of.
> Whenever new infrastructure is added to this repo, this file must be updated in the same commit.

---

## Table of Contents

1. [Architecture](#architecture)
2. [Folder Layout](#folder-layout)
3. [Path Aliases](#path-aliases)
4. [Environment Variables](#environment-variables)
5. [Bootstrap & App Composition](#bootstrap--app-composition)
6. [Authentication](#authentication)
7. [Routing](#routing)
8. [Protected Routes & Action Guards](#protected-routes--action-guards)
9. [Permission System](#permission-system)
10. [API Layer](#api-layer)
11. [Query System (React Query)](#query-system-react-query)
12. [Modal System](#modal-system)
13. [Notification (Toast) System](#notification-toast-system)
14. [Upload Infrastructure](#upload-infrastructure)
15. [Theme System](#theme-system)
16. [Shared UI](#shared-ui)
17. [Form System](#form-system)
18. [Layouts](#layouts)
19. [Creating a New Module](#creating-a-new-module)
20. [Engineering Rules](#engineering-rules)

---

## Architecture

The repo follows a strict **4-layer architecture**:

| Layer       | Owns                                                              | Imports from                |
|-------------|-------------------------------------------------------------------|-----------------------------|
| `app/`      | Bootstrap, providers, layouts, router                             | `core`, `shared`, `modules` |
| `core/`     | Reusable infrastructure (api, auth, modals, perms, query, etc.)   | `core` only                 |
| `shared/`   | Reusable UI components and form primitives                        | `core`                      |
| `modules/`  | Product-specific feature modules (added by the host product)       | `core`, `shared`            |

Hard rules:
- `core/` must never depend on `shared/`, `app/`, or `modules/`.
- `shared/` must never depend on `modules/` or `app/`.
- `app/` is the *only* layer that wires concrete product configuration.
- `modules/` is the *only* layer where business-specific code lives.

The foundation ships with `modules/` empty by design.

---

## Folder Layout

```
src/
├── app/
│   ├── layouts/        DashboardLayout, PublicLayout, AuthLayout, AppShell
│   ├── providers/      AppProviders (composes Query/Theme/Auth/Toast/Modal)
│   └── router/         AppRouter, buildRoutes, error pages, RootErrorBoundary
│
├── core/
│   ├── api/            axios client, interceptors, ApiError, auth-bridge
│   ├── auth/           token-manager, session-manager, AuthProvider, useAuth
│   ├── constants/      env, routes, query-keys, storage-keys
│   ├── hooks/          useDebounce, useDisclosure, useLocalStorage, ...
│   ├── modals/         modal store + registry + provider + built-ins
│   ├── notifications/  ToastProvider, notify(), notifyApiError()
│   ├── permissions/    PermissionGate, ProtectedRoute, GuestRoute, usePermissions
│   ├── query/          QueryClient, QueryProvider, createQueryHook, createMutationHook
│   ├── theme/          ThemeProvider, useTheme
│   ├── types/          ApiResponse, AuthUser, common helpers
│   ├── uploads/        UploadManager, upload-store, transports, useUploads
│   └── utils/          cn, storage, logger, format, promise (retry/sleep), id
│
├── shared/
│   ├── forms/          Form, FormField, FormInput, FormTextArea, FormSelect, zod helpers
│   └── ui/             Button, Input, TextArea, Select, Dropdown, Modal,
│                       Table, Tabs, Sidebar, Loader, EmptyState, ErrorState,
│                       PageHeader, Badge, Avatar, Skeleton, Card
│
├── modules/            (empty — host products add features here)
├── assets/
├── App.tsx             Renders <AppProviders><AppRouter /></AppProviders>
├── main.tsx            React root
└── index.css           Tailwind v4 + theme tokens (light/dark)
```

---

## Path Aliases

Configured in `tsconfig.app.json` + `vite.config.ts`:

```ts
'@/*'        → 'src/*'
'@app/*'     → 'src/app/*'
'@core/*'    → 'src/core/*'
'@shared/*'  → 'src/shared/*'
'@modules/*' → 'src/modules/*'
'@assets/*'  → 'src/assets/*'
```

**Always** prefer `@core/...` over `../../core/...` in imports.

---

## Environment Variables

Defined in `.env.example`. Type-checked through `src/vite-env.d.ts`.

| Var                       | Purpose                                                  |
|---------------------------|----------------------------------------------------------|
| `VITE_API_BASE_URL`       | Base URL for the axios client.                           |
| `VITE_APP_NAME`           | Human app name (sidebar header, document title, etc.).   |
| `VITE_APP_VERSION`        | Version string surfaced in logs / about pages.           |
| `VITE_ENABLE_DEVTOOLS`    | Toggle React Query devtools / verbose logs.              |
| `VITE_AUTH_STORAGE_KEY`   | Storage key prefix for auth tokens + user session.       |

Read everywhere via `ENV` from `@core/constants/env` — never call `import.meta.env` directly.

---

## Bootstrap & App Composition

The entire foundation is wired in `src/App.tsx`:

```tsx
import { AppProviders } from '@app/providers'
import { AppRouter } from '@app/router'

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  )
}
```

`AppProviders` composes everything cross-cutting (order matters):

```
ThemeProvider
  └── QueryProvider
        └── AuthProvider          (registers auth ↔ api bridge, hydrates session)
              ├── ToastProvider
              └── ModalProvider
                    └── children
```

Never re-implement this — extend `AppProviders` only when adding a new cross-cutting provider.

---

## Authentication

### Concepts

- **Token manager** (`@core/auth/tokenManager`): persists `{ accessToken, refreshToken, expiresAt }`.
- **Session manager** (`@core/auth/sessionManager`): persists the `AuthUser`.
- **Auth store** (Zustand): single source of truth (`status`, `user`, `tokens`, `error`).
- **Auth service** (`getAuthService()`): swappable contract for `login | logout | me | refresh`.
- **Auth bridge** (`@core/api/auth-bridge`): decouples the api client from the auth store
  so the axios refresh interceptor can read/write tokens without circular imports.
- **`AuthProvider`**: registers the bridge and calls `restoreSession()` on mount.

### Customizing the backend contract

```ts
import { configureAuthEndpoints, configureAuthService } from '@core/auth'

// Just change paths:
configureAuthEndpoints({ login: '/v2/sign-in', refresh: '/v2/token/refresh' })

// Or fully override:
configureAuthService({
  login: async ({ email, password }) => {
    const { data } = await api.post('/sign-in', { email, password })
    return { user: data.user, tokens: { accessToken: data.jwt, refreshToken: data.rt } }
  },
})
```

### Login (form usage)

```tsx
import { useAuth } from '@core/auth'
import { notifyApiError } from '@core/notifications'
import { Form, FormInput, applyApiErrorToForm } from '@shared/forms'
import { Button } from '@shared/ui'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export function LoginForm() {
  const { login } = useAuth()
  return (
    <Form
      schema={schema}
      defaultValues={{ email: '', password: '' }}
      onSubmit={async (values, _ctx) => {
        try { await login(values) }
        catch (err) {
          // 1. show field errors on the form
          // 2. fall back to a toast if there were no field errors
          const handled = applyApiErrorToForm(err, _ctx.setError)
          if (!handled) notifyApiError(err)
        }
      }}
    >
      {({ formState }) => (
        <>
          <FormInput name="email" label="Email" type="email" />
          <FormInput name="password" label="Password" type="password" />
          <Button type="submit" loading={formState.isSubmitting} fullWidth>
            Sign in
          </Button>
        </>
      )}
    </Form>
  )
}
```

> Note: the `onSubmit` second arg shown above (`_ctx`) is illustrative. In practice
> grab `setError` directly from the render-prop `methods` or via `useFormContext()`.
> See `applyApiErrorToForm` in `@shared/forms/form-utils.ts`.

### Reading auth state anywhere

```tsx
const { user, isAuthenticated, isLoading, logout } = useAuth()
```

### Requiring auth imperatively in a page

```tsx
import { useRequireAuth } from '@core/auth'

export function AccountPage() {
  useRequireAuth() // redirects to /auth/login if unauthenticated
  return <div>...</div>
}
```

### Refresh flow

Already wired: the response interceptor (`@core/api/interceptors`) catches `401`,
calls `bridge.refreshTokens()`, persists the new tokens, retries the original
request once, and on failure clears the session. Concurrent 401s are coalesced
into a single in-flight refresh.

---

## Routing

Routes are declared via a **config object**, not by editing the foundation:

```tsx
// src/app.config.tsx — host product
import { type AppRouteConfig } from '@app/router'
import { ROUTES } from '@core/constants'

export const appRouteConfig: AppRouteConfig = {
  publicRoutes: [
    { path: '/about', element: <AboutPage /> },
  ],
  guestRoutes: [
    { path: ROUTES.auth.login, element: <LoginPage /> },
    { path: ROUTES.auth.register, element: <RegisterPage /> },
  ],
  protectedRoutes: [
    { path: ROUTES.app.dashboard, element: <DashboardPage /> },
    { path: ROUTES.app.settings, element: <SettingsPage /> },
  ],
}
```

Pass it through to `App.tsx`:

```tsx
<AppProviders>
  <AppRouter config={appRouteConfig} />
</AppProviders>
```

### src\app\router\types.ts
layouts?: {
    public?: ReactNode
    guest?: ReactNode
    protected?: ReactNode
  }
  
### Behind the scenes `buildRoutes(config)` automatically:
- wraps `protectedRoutes` in `<ProtectedRoute>` + `<AppShell>`
- wraps `guestRoutes` in `<GuestRoute>` + `<AuthLayout>`
- wraps `publicRoutes` in `<PublicLayout>`
- attaches `RootErrorBoundary` and 403/404/500 pages.

### Route constants

Always declare routes in `@core/constants/routes`:

```ts
export const ROUTES = {
  root: '/',
  auth:   { login: '/auth/login', register: '/auth/register', ... },
  app:    { dashboard: '/dashboard', settings: '/settings' },
  errors: { notFound: '/404', forbidden: '/403', serverError: '/500' },
}
```

Never hardcode path strings in components — extend `ROUTES` and import it.

---

## Protected Routes & Action Guards

### Page-level protection

```tsx
import { ProtectedRoute } from '@core/permissions'

<ProtectedRoute permission="billing.read">
  <BillingPage />
</ProtectedRoute>
```

- No `permission` ⇒ requires only authentication.
- Array + `match="any" | "all"` is supported.
- `role="admin"` or `role={['admin', 'owner']}` checks roles.
- Unauthenticated ⇒ redirects to `ROUTES.auth.login` (configurable via `redirectTo`).
- Authenticated but missing permission ⇒ redirects to `ROUTES.errors.forbidden`.

### Inline element gating

```tsx
import { PermissionGate } from '@core/permissions'

<PermissionGate permission="users.invite" fallback={<UpgradePrompt />}>
  <InviteUserButton />
</PermissionGate>
```

### Action guards (event handlers)

```tsx
import { useActionGuard } from '@core/permissions'
import { notify } from '@core/notifications'

const guard = useActionGuard({
  onDenied: () => notify.error('You do not have permission to perform this action.'),
})

const onDelete = guard('items.delete', () => deleteItem(itemId))

return <Button onClick={onDelete}>Delete</Button>
```

If the user lacks the permission, the inner function never runs and `onDenied` fires once.

---

## Permission System

Conventions:

- Permission strings follow `resource.action` — e.g. `users.read`, `billing.write`.
- A wildcard `*` grants everything. `users.*` grants every `users.*` action.
- Roles are plain strings; the foundation does not hardcode any.

Programmatic check from any component:

```tsx
const { can, has, hasAll, hasAny, hasRole } = usePermissions()

can('billing.write')                  // single permission
can(['users.read', 'users.write'])    // ALL by default
can(['users.read', 'users.write'], { match: 'any' })
can((ctx) => ctx.roles.includes('owner') && ctx.permissions.length > 0)
```

### Wiring permissions to your user

`AuthUser.permissions` and `AuthUser.roles` are populated by your `auth-service.me`
response. Make sure your backend returns:

```json
{
  "id": "...",
  "email": "...",
  "roles": ["admin"],
  "permissions": ["users.*", "billing.read"]
}
```

The store is reactive — flipping a permission on the user instantly re-renders
every `<PermissionGate>` / `<ProtectedRoute>`.

---

## API Layer

Always go through the abstraction. Never call axios directly from a component.

```ts
import { api } from '@core/api'

const user = await api.get<User>('/users/me')
const created = await api.post<User, NewUser>('/users', body)
await api.delete(`/users/${id}`)
```

Helpers:
- `api.get/post/put/patch/delete` automatically unwrap `{ data: T }` envelopes.
- `apiClient` (the raw axios instance) is exported for special cases (multipart, streaming).
- `RequestOptions` extends `AxiosRequestConfig` with `{ skipAuth: true }` for endpoints
  that must not include the `Authorization` header (login, password reset, etc.).
- `buildUrl(path, params)` URL-encodes query params safely.

### Errors

All errors thrown from `api.*` are `ApiError` instances:

```ts
import { ApiError, isApiError } from '@core/api'

try {
  await api.post('/foo', body)
} catch (err) {
  if (isApiError(err)) {
    if (err.isUnauthorized)     // 401
    if (err.isForbidden)        // 403
    if (err.isValidationError)  // 422 / fieldErrors present
    err.fieldErrors             // Record<string, string[]>
  }
}
```

Surface them uniformly:

```ts
import { notifyApiError } from '@core/notifications'
notifyApiError(err)  // toast with smart formatting
```

### Module-level API files

Inside a module: `modules/<name>/api/<name>.api.ts`

```ts
import { api } from '@core/api'
import type { Thing, NewThing } from '../types'

export const thingsApi = {
  list:   (params?: { search?: string }) => api.get<Thing[]>('/things', { params }),
  byId:   (id: string)                   => api.get<Thing>(`/things/${id}`),
  create: (body: NewThing)               => api.post<Thing, NewThing>('/things', body),
  update: (id: string, body: Partial<NewThing>) => api.patch<Thing>(`/things/${id}`, body),
  remove: (id: string)                   => api.delete<void>(`/things/${id}`),
}
```

---

## Query System (React Query)

The foundation provides factories so each module gets typed hooks with one line.

### Query hook

```ts
// modules/things/hooks/use-things.ts
import { createQueryHook } from '@core/query'
import { queryKey } from '@core/constants'
import { thingsApi } from '../api/things.api'

export const useThings = createQueryHook({
  key: (params: { search?: string }) => queryKey.list('things', params),
  fetcher: (params) => thingsApi.list(params),
})

export const useThing = createQueryHook({
  key: (id: string) => queryKey.detail('things', id),
  fetcher: (id) => thingsApi.byId(id),
})
```

Usage:

```tsx
const { data, isLoading, error } = useThings({ search: 'foo' })
```

### Mutation hook + invalidation

```ts
import { createMutationHook, invalidatePrefix } from '@core/query'

export const useCreateThing = createMutationHook({
  mutationFn: (body) => thingsApi.create(body),
  defaults: {
    onSuccess: () => invalidatePrefix(['things']),
  },
})
```

Usage:

```tsx
const create = useCreateThing({ onSuccess: () => notify.success('Created') })
create.mutate(payload)
```

### Manual cache control

```ts
import { setQueryData, getQueryData, removeQueries, invalidate } from '@core/query'

setQueryData<Thing>(queryKey.detail('things', id), patched)
invalidate(queryKey.list('things'))
```

---

## Modal System

A central registry-based engine. Three pieces:

1. **Store** (`useModalStore`) — a stack of active modal instances.
2. **Registry** — `registerModal('type', Component)` exposes new modal types.
3. **Provider** (`<ModalProvider>`) — mounted inside `AppProviders`, renders the stack.

### Built-ins

`confirm` and `alert` are pre-registered.

```ts
import { openModal } from '@core/modals'

openModal({
  type: 'confirm',
  props: {
    title: 'Delete this item?',
    description: 'This action cannot be undone.',
    destructive: true,
    onConfirm: async () => {
      await thingsApi.remove(id)
      notify.success('Deleted')
    },
  },
})
```

```ts
openModal({
  type: 'alert',
  props: { title: 'Heads up', description: 'Saved successfully.' },
})
```

### Registering a custom modal

```tsx
// 1. Type augmentation — host product (modules/things/modals/invite-modal.tsx)
declare module '@core/modals' {
  interface ModalPropsRegistry {
    'things.invite': { thingId: string }
  }
}

// 2. Component
function InviteModalHost({ thingId, close }: { thingId: string; close: () => void }) {
  return (
    <Modal open onOpenChange={(o) => !o && close()} title="Invite" size="md">
      {/* ... */}
    </Modal>
  )
}

// 3. Register once at module init
registerModal('things.invite', InviteModalHost)

// 4. Use it
openModal({ type: 'things.invite', props: { thingId: '42' } })
```

### Closing programmatically

```ts
import { closeModal, closeAllModals } from '@core/modals'

const id = openModal({ ... })
closeModal(id)
closeAllModals()
```

### Stack semantics

- `openModal` returns the new modal's id and pushes it onto the stack.
- The Escape key closes the topmost modal first.
- Each registered component receives `{ modalId, close }` along with its typed props.

---

## Notification (Toast) System

Built on `sonner`. The `<ToastProvider />` is already mounted by `AppProviders`.

```ts
import { notify } from '@core/notifications'

notify.success('Saved')
notify.error('Could not save', { description: 'Try again later.' })
notify.info('Heads up')
notify.warning('Be careful')
notify.loading('Uploading…')

notify.promise(
  thingsApi.create(body),
  {
    loading: 'Creating…',
    success: (thing) => `Created ${thing.name}`,
    error: (err) => (err instanceof Error ? err.message : 'Failed'),
  },
)

notify.dismiss()
```

For API errors, prefer the dedicated helper:

```ts
import { notifyApiError } from '@core/notifications'
notifyApiError(err)
```

It already handles `ApiError.isCancelled`, network errors, and validation field details.

---

## Upload Infrastructure

The foundation ships **only** the engine. Backends/transports are injected.

### Setup

```ts
// modules/<feature>/uploads/uploader.ts
import { UploadManager, createAxiosUploadTransport } from '@core/uploads'

export const uploader = new UploadManager(
  createAxiosUploadTransport({ url: '/uploads' }),
  { concurrency: 3, maxAttempts: 3, retryDelayMs: 500 },
)
```

Want a different transport (S3 signed PUT, tus, etc.)? Implement `UploadTransport`:

```ts
const customTransport: UploadTransport<{ url: string }> = {
  async upload(item, onProgress, signal) {
    // your transport here — must call onProgress({ id, loaded, total, progress })
    // and respect signal.aborted
    return { url: '...' }
  },
}
```

### Queueing files

```ts
const items = uploader.addMany(Array.from(fileList), { folderId: '42' })
items.forEach((i) => console.log(i.id))
```

### Observing progress in a component

```tsx
import { useUploads } from '@core/uploads'

function UploadTray() {
  const { items, byStatus, totalProgress, isUploading } = useUploads()
  return (
    <div>
      <progress value={totalProgress} max={100} />
      <ul>
        {items.map((i) => (
          <li key={i.id}>
            {i.file.name} — {i.status} ({i.progress}%)
            {i.status === 'failed' && (
              <button onClick={() => uploader.retry(i.id)}>Retry</button>
            )}
            {(i.status === 'uploading' || i.status === 'queued') && (
              <button onClick={() => uploader.cancel(i.id)}>Cancel</button>
            )}
          </li>
        ))}
      </ul>
      {isUploading && <span>{byStatus.uploading.length} uploading…</span>}
    </div>
  )
}
```

### Retry & backoff

- Per-item attempts default to 3 (configurable).
- Exponential backoff: `retryDelayMs * 2^(attempt-1)`.
- Aborted uploads do **not** retry.

---

## Theme System

Light / Dark / System with class-based toggle. CSS tokens live in `src/index.css`.

```tsx
import { useTheme } from '@core/theme'

function ThemeSwitch() {
  const { mode, resolved, setMode, toggle } = useTheme()
  return (
    <button onClick={toggle}>
      {resolved === 'dark' ? 'Switch to light' : 'Switch to dark'}
    </button>
  )
}
```

- Mode is persisted under `STORAGE_KEYS.theme`.
- `mode === 'system'` follows `prefers-color-scheme` and updates live.
- `<ThemeProvider>` (in `AppProviders`) toggles `.dark` / `.light` on `<html>`.

To recolor the design system, edit the CSS tokens under `@theme { ... }` and the `.dark { ... }`
block in `src/index.css` — every component reads from these variables.

---

## Shared UI

All components in `@shared/ui`. Import from the directory or the barrel:

```ts
import { Button, Input, Modal, Table, Tabs, Sidebar, Badge, Avatar } from '@shared/ui'
```

### Button

```tsx
<Button variant="primary" size="md" loading={isSubmitting} leftIcon={<Plus />}>
  Save
</Button>
```

Variants: `primary | secondary | outline | ghost | danger | success | link`.
Sizes: `xs | sm | md | lg | xl | icon`. `fullWidth` available.

### Input / TextArea / Select

```tsx
<Input placeholder="Search…" leftSlot={<SearchIcon />} />
<TextArea rows={6} placeholder="Notes" />
<Select options={[{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }]} placeholder="Pick one" />
```

Pass `invalid` to surface validation styling.

### Modal (low-level)

```tsx
const [open, setOpen] = useState(false)

<Modal
  open={open}
  onOpenChange={setOpen}
  title="Edit thing"
  description="Update the name."
  size="md"
  footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button>Save</Button></>}
>
  <Form schema={schema} ...>{/* … */}</Form>
</Modal>
```

For most flows, use the **modal engine** (`openModal({...})`) instead of mounting `<Modal>` manually.

### Dropdown

```tsx
<Dropdown
  trigger={<Button variant="ghost" size="icon"><MoreIcon /></Button>}
  align="end"
  items={[
    { key: 'edit',   label: 'Edit',   onSelect: () => onEdit() },
    { key: 'sep',    separator: true, label: '' },
    { key: 'delete', label: 'Delete', destructive: true, onSelect: () => onDelete() },
  ]}
/>
```

### Table

```tsx
import { Table, type TableColumn } from '@shared/ui'

interface Row { id: string; name: string; status: 'active' | 'paused' }

const columns: TableColumn<Row>[] = [
  { key: 'name',   header: 'Name' },
  { key: 'status', header: 'Status', cell: (r) => <Badge>{r.status}</Badge> },
  { key: 'actions', header: '', align: 'right', cell: (r) => <Dropdown ... /> },
]

<Table
  data={rows}
  columns={columns}
  rowKey={(r) => r.id}
  loading={isLoading}
  emptyTitle="No items yet"
  onRowClick={(r) => navigate(`/items/${r.id}`)}
/>
```

### Tabs

```tsx
<Tabs defaultValue="general">
  <TabsList>
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="security">Security</TabsTrigger>
  </TabsList>
  <TabsContent value="general">…</TabsContent>
  <TabsContent value="security">…</TabsContent>
</Tabs>
```

### Sidebar

```tsx
<Sidebar
  header={<div className="font-semibold">{ENV.APP_NAME}</div>}
  sections={[
    {
      key: 'main',
      label: 'Main',
      items: [
        { key: 'home', to: '/', label: 'Home', icon: <HomeIcon /> },
        { key: 'settings', to: '/settings', label: 'Settings', icon: <CogIcon /> },
      ],
    },
  ]}
/>
```

### PageHeader

```tsx
<PageHeader
  title="Users"
  description="Manage organization users."
  breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Users' }]}
  actions={<Button>Invite</Button>}
/>
```

### Status helpers

- `<Loader size="md" />` and `<PageLoader />` for spinners.
- `<EmptyState title="No data" description="..." action={<Button>Create</Button>} />`
- `<ErrorState onRetry={refetch} />`
- `<Skeleton className="h-4 w-24" />` while loading.

---

## Form System

Built on **react-hook-form** + **zod**. Three ingredients:

1. `<Form schema={...} onSubmit={...}>` — provides `FormProvider`.
2. `FormInput | FormTextArea | FormSelect` — RHF-aware field wrappers.
3. `applyApiErrorToForm` — maps server `fieldErrors` onto the form.

```tsx
import { z } from 'zod'
import { Form, FormInput, FormTextArea, FormSelect, zStrings, applyApiErrorToForm } from '@shared/forms'
import { Button } from '@shared/ui'

const schema = z.object({
  name:        zStrings.required('Name'),
  description: z.string().max(200).optional(),
  status:      z.enum(['active', 'paused']),
})

type Values = z.infer<typeof schema>

export function ThingForm({ defaultValues, onSubmit }: { defaultValues?: Partial<Values>; onSubmit: (v: Values) => Promise<void> }) {
  return (
    <Form<typeof schema, Values>
      schema={schema}
      defaultValues={{ name: '', description: '', status: 'active', ...defaultValues }}
      onSubmit={async (values) => {
        try { await onSubmit(values) }
        catch (err) {
          // Surface field-level errors; toast everything else.
          // Use the methods render prop or useFormContext() for setError.
        }
      }}
    >
      {({ formState, setError }) => (
        <>
          <FormInput<Values>    name="name" label="Name" required />
          <FormTextArea<Values> name="description" label="Description" />
          <FormSelect<Values>   name="status" label="Status" options={[
            { label: 'Active', value: 'active' },
            { label: 'Paused', value: 'paused' },
          ]} />
          <Button type="submit" loading={formState.isSubmitting}>Save</Button>
        </>
      )}
    </Form>
  )
}
```

Server-side validation errors:

```ts
try { await api.post('/things', values) }
catch (err) {
  const handled = applyApiErrorToForm(err, setError)
  if (!handled) notifyApiError(err)
}
```

### Building schemas

Use the helpers in `@shared/forms/zod-helpers`:

```ts
import { z } from 'zod'
import { zStrings, zNumbers, zCommon } from '@shared/forms'

const schema = z.object({
  email:    zStrings.email(),
  password: zStrings.password(8),
  count:    zNumbers.positive(),
  bio:      zCommon.optionalText(),
})
```

---

## Layouts

Three reusable layouts under `@app/layouts`:

- `DashboardLayout` — sidebar + topbar + main scroll area. Responsive sidebar (drawer on mobile).
- `PublicLayout` — header / footer slots + outlet.
- `AuthLayout` — centered form column + decorative aside on large screens.

`AppShell` is the opinionated host that combines `DashboardLayout` + `<Sidebar>` with
the foundation defaults. Replace it with a product-specific shell by passing your own
component via `AppRouteConfig.layouts.protected`:

```tsx
<AppRouter
  config={{
    ...appRouteConfig,
    layouts: { protected: <MyAppShell /> },
  }}
/>
```

---

## Creating a New Module

Each module is self-contained under `src/modules/<name>/`:

```
modules/things/
├── api/
│   └── things.api.ts        # api.get/post/... only — no React
├── hooks/
│   ├── use-things.ts        # createQueryHook + createMutationHook
│   └── use-thing.ts
├── components/
│   ├── ThingCard.tsx
│   └── ThingDropdownMenu.tsx
├── pages/
│   ├── ThingsListPage.tsx   # route-level container
│   └── ThingDetailPage.tsx
├── modals/                  # optional — registerModal(...) at module init
├── schemas/
│   └── thing.schema.ts      # zod schemas + inferred types
├── types/
│   └── thing.types.ts
└── index.ts                 # public surface — re-export pages + hooks only
```

### Rules per layer

| File             | May import                                                  |
|------------------|--------------------------------------------------------------|
| `api/*.api.ts`   | `@core/api`, the module's own types/schemas                  |
| `hooks/*.ts`     | `@core/query`, this module's `api/`                          |
| `components/*`   | `@shared/*`, this module's `hooks/`, sibling components      |
| `pages/*`        | everything above + `@app/router` (for navigation)            |

Never call axios from a component. Never call `useQuery` from a component — always
build a hook with `createQueryHook` so caching is consistent across consumers.

### Wiring routes

In your host product (e.g. `src/app.config.tsx`):

```ts
import { lazy } from 'react'
const ThingsListPage  = lazy(() => import('@modules/things/pages/ThingsListPage'))
const ThingDetailPage = lazy(() => import('@modules/things/pages/ThingDetailPage'))

export const appRouteConfig: AppRouteConfig = {
  protectedRoutes: [
    { path: '/things',      element: <ThingsListPage /> },
    { path: '/things/:id',  element: <ThingDetailPage /> },
  ],
}
```

For permission-gated routes, wrap individual pages explicitly:

```ts
{
  path: '/things',
  element: (
    <ProtectedRoute permission="things.read" forbiddenRedirect="/403">
      <ThingsListPage />
    </ProtectedRoute>
  ),
}
```

### Registering module-owned modals

```ts
// modules/things/modals/index.ts
import { registerModal } from '@core/modals'
import { InviteThingModal } from './InviteThingModal'

declare module '@core/modals' {
  interface ModalPropsRegistry {
    'things.invite': { thingId: string }
  }
}

export function registerThingsModals() {
  registerModal('things.invite', InviteThingModal)
}
```

Call `registerThingsModals()` once from the module's `index.ts` or from the host
product bootstrap before `<AppRouter />` renders.

---

## Engineering Rules

These are **non-negotiable** and the foundation enforces them via structure:

1. **No axios in components.** All HTTP goes through `@core/api`.
2. **No business logic in `core/` or `shared/`.** Only infrastructure and primitives.
3. **No hard-coded route strings.** Extend `ROUTES`.
4. **No hard-coded permission/role strings outside `modules/`.** Each module
   owns its own permission constants.
5. **No direct `import.meta.env` in components.** Read through `ENV`.
6. **Strong typing.** No `any` without a written justification. Prefer narrow generics.
7. **One responsibility per file.** Split when components exceed ~200 LOC or mix
   render + data-fetching + side-effects.
8. **Modal/Toast/Permission state is global.** Never reimplement them inside a module.
9. **Update this document whenever new infrastructure is added** — usage example +
   convention + integration pattern must accompany every reusable system.

---

## Quick Reference

| Need…                              | Use                                                              |
|------------------------------------|-------------------------------------------------------------------|
| Read auth state                    | `useAuth()`                                                       |
| Require auth in a page             | `useRequireAuth()` or wrap route in `<ProtectedRoute>`            |
| Check permission inline            | `<PermissionGate permission="…">`                                 |
| Guard an action handler            | `useActionGuard()(permission, fn)`                                |
| Call the API                       | `api.get/post/put/patch/delete` from `@core/api`                  |
| Build a query/mutation hook        | `createQueryHook` / `createMutationHook` from `@core/query`       |
| Open a confirmation/alert          | `openModal({ type: 'confirm' \| 'alert', props: { … } })`         |
| Notify the user                    | `notify.success/error/info/warning/promise`                       |
| Map server errors to a form        | `applyApiErrorToForm(err, setError)`                              |
| Upload files                       | `new UploadManager(transport, opts).add(file)` + `useUploads()`   |
| Switch theme                       | `useTheme().toggle()`                                             |
| Add a route                        | Extend `AppRouteConfig` in your host product                      |
| Build a form                       | `<Form schema>{...}</Form>` + `FormInput / FormSelect / ...`      |
