export type Nullable<T> = T | null
export type Maybe<T> = T | null | undefined
export type ValueOf<T> = T[keyof T]
export type Prettify<T> = { [K in keyof T]: T[K] } & {}
export type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'

export interface SelectOption<T = string> {
  label: string
  value: T
  disabled?: boolean
  description?: string
  icon?: React.ReactNode
}

export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}
