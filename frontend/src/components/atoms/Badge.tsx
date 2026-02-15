'use client'

import { cn, getPostTypeIcon } from '@/lib/utils'

export interface BadgeProps {
  type: 'place' | 'hostel' | 'people' | 'bus' | 'photo' | 'other'
  className?: string
}

const typeColors = {
  place: 'bg-blue-50 text-blue-700 border-blue-200',
  hostel: 'bg-purple-50 text-purple-700 border-purple-200',
  people: 'bg-green-50 text-green-700 border-green-200',
  bus: 'bg-orange-50 text-orange-700 border-orange-200',
  photo: 'bg-pink-50 text-pink-700 border-pink-200',
  other: 'bg-gray-50 text-gray-700 border-gray-200',
}

export function Badge({ type, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border',
        typeColors[type],
        className
      )}
    >
      <span>{getPostTypeIcon(type)}</span>
      <span className="capitalize">{type}</span>
    </span>
  )
}
