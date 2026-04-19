import { format } from 'date-fns'

export function formatDate(date: string | Date) {
  return format(new Date(date), 'MMM dd, yyyy')
}

export function formatDateTime(date: string | Date) {
  return format(new Date(date), 'MMM dd, yyyy h:mm a')
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatPercentage(value: number, decimals = 0) {
  return `${value.toFixed(decimals)}%`
}

export function formatScore(score: number) {
  return score.toFixed(1)
}

export function formatPhoneNumber(phone: string) {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}