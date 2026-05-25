import { format as formatDate, formatDistanceToNow, parseISO } from 'date-fns'

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

export function formatNumber(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value)
}

export function formatCurrency(value: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value)
}

export function formatPercent(value: number, locale = 'en-US', fractionDigits = 1): string {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits: fractionDigits,
  }).format(value)
}

function toDate(value: Date | string | number): Date {
  if (value instanceof Date) return value
  if (typeof value === 'number') return new Date(value)
  return parseISO(value)
}

export function formatDateTime(value: Date | string | number, pattern = 'PPpp'): string {
  return formatDate(toDate(value), pattern)
}

export function formatRelativeTime(value: Date | string | number): string {
  return formatDistanceToNow(toDate(value), { addSuffix: true })
}

export function truncate(str: string, length: number, suffix = '…'): string {
  if (str.length <= length) return str
  return str.slice(0, length - suffix.length) + suffix
}
