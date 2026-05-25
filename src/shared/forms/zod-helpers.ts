import { z } from 'zod'

export const zStrings = {
  required: (label = 'This field') => z.string().min(1, `${label} is required`),
  email: () => z.string().email('Enter a valid email'),
  url: () => z.string().url('Enter a valid URL'),
  password: (min = 8) =>
    z
      .string()
      .min(min, `Password must be at least ${min} characters`)
      .max(128, 'Password is too long'),
}

export const zNumbers = {
  positive: () => z.coerce.number().positive('Must be positive'),
  nonNegative: () => z.coerce.number().nonnegative('Must be non-negative'),
  int: () => z.coerce.number().int('Must be an integer'),
}

export const zCommon = {
  id: () => z.string().min(1),
  optionalText: () => z
    .string()
    .optional()
    .transform((v) => (v?.trim() ? v.trim() : undefined)),
}
