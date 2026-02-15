import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Parse date string safely to avoid timezone issues
function parseDate(date: string | Date): Date {
  if (date instanceof Date) return date
  // If it's just a date (YYYY-MM-DD), add noon time to avoid timezone shift
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return new Date(date + 'T12:00:00')
  }
  return new Date(date)
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parseDate(date))
}

export function formatRelativeDate(date: string | Date) {
  const now = new Date()
  const then = parseDate(date)
  const diff = now.getTime() - then.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return formatDate(date)
}

export function getPostTypeIcon(type: string) {
  const icons: Record<string, string> = {
    place: '📍',
    hostel: '🏨',
    people: '👥',
    bus: '🚌',
    photo: '📸',
    other: '✨',
  }
  return icons[type] || '📝'
}

export function getPostTypeLabel(type: string) {
  const labels: Record<string, string> = {
    place: 'Place',
    hostel: 'Hostel',
    people: 'People',
    bus: 'Bus',
    photo: 'Photo',
    other: 'Other',
  }
  return labels[type] || 'Post'
}
