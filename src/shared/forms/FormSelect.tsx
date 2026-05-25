import { useId, type ReactNode } from 'react'
import { useFormContext, Controller, type FieldValues, type Path } from 'react-hook-form'
import { Select, type SelectProps } from '@shared/ui/Select'
import { FormField } from './FormField'

export interface FormSelectProps<TValues extends FieldValues>
  extends Omit<SelectProps, 'name' | 'defaultValue'> {
  name: Path<TValues>
  label?: ReactNode
  description?: ReactNode
  required?: boolean
  containerClassName?: string
}

export function FormSelect<TValues extends FieldValues>({
  name,
  label,
  description,
  required,
  containerClassName,
  ...rest
}: FormSelectProps<TValues>) {
  const { control } = useFormContext<TValues>()
  const id = useId()
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormField
          htmlFor={id}
          label={label}
          description={description}
          required={required}
          error={fieldState.error?.message}
          className={containerClassName}
        >
          <Select
            id={id}
            {...field}
            {...rest}
            invalid={Boolean(fieldState.error)}
            value={field.value ?? ''}
          />
        </FormField>
      )}
    />
  )
}
