import { FormProvider, useForm, type UseFormProps, type UseFormReturn, type FieldValues, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type FormHTMLAttributes, type ReactNode } from 'react'
import type { ZodTypeAny } from 'zod'
import { cn } from '@core/utils/cn'

export interface FormProps<TSchema extends ZodTypeAny, TValues extends FieldValues>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'> {
  schema: TSchema
  defaultValues?: UseFormProps<TValues>['defaultValues']
  onSubmit: SubmitHandler<TValues>
  children: ReactNode | ((methods: UseFormReturn<TValues>) => ReactNode)
  formOptions?: Omit<UseFormProps<TValues>, 'resolver' | 'defaultValues'>
}

export function Form<TSchema extends ZodTypeAny, TValues extends FieldValues = FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
  formOptions,
  ...rest
}: FormProps<TSchema, TValues>) {
  const methods = useForm<TValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onBlur',
    ...formOptions,
  })

  return (
    <FormProvider {...methods}>
      <form
        noValidate
        onSubmit={methods.handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-4', className)}
        {...rest}
      >
        {typeof children === 'function' ? children(methods) : children}
      </form>
    </FormProvider>
  )
}
