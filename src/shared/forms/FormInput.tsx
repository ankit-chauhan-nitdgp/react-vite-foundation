import { useId, type ReactNode } from 'react'
import { useFormContext, Controller, type FieldValues, type Path } from 'react-hook-form'
import { Input, type InputProps } from '@shared/ui/Input'
import { FormField } from './FormField'

export interface FormInputProps<TValues extends FieldValues>
  extends Omit<InputProps, 'name' | 'defaultValue'> {
  name: Path<TValues>
  label?: ReactNode
  description?: ReactNode
  required?: boolean
  containerClassName?: string
}

export function FormInput<TValues extends FieldValues>({
  name,
  label,
  description,
  required,
  containerClassName,
  ...inputProps
}: FormInputProps<TValues>) {
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
          <Input
            id={id}
            {...field}
            {...inputProps}
            invalid={Boolean(fieldState.error)}
            value={field.value ?? ''}
          />
        </FormField>
      )}
    />
  )
}
