import { useId, type ReactNode } from 'react'
import { useFormContext, Controller, type FieldValues, type Path } from 'react-hook-form'
import { TextArea, type TextAreaProps } from '@shared/ui/TextArea'
import { FormField } from './FormField'

export interface FormTextAreaProps<TValues extends FieldValues>
  extends Omit<TextAreaProps, 'name' | 'defaultValue'> {
  name: Path<TValues>
  label?: ReactNode
  description?: ReactNode
  required?: boolean
  containerClassName?: string
}

export function FormTextArea<TValues extends FieldValues>({
  name,
  label,
  description,
  required,
  containerClassName,
  ...rest
}: FormTextAreaProps<TValues>) {
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
          <TextArea
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
