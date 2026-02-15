'use client'

import { cn, getPostTypeIcon, getPostTypeLabel } from '@/lib/utils'
import { PostType } from '@/types'

export interface TypeSelectorProps {
  value: PostType
  onChange: (type: PostType) => void
  className?: string
}

const postTypes: PostType[] = ['place', 'hostel', 'people', 'bus', 'photo', 'other']

export function TypeSelector({ value, onChange, className }: TypeSelectorProps) {
  return (
    <div className={cn('grid grid-cols-3 gap-2', className)}>
      {postTypes.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={cn(
            'flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all duration-200',
            value === type
              ? 'border-black bg-gray-50'
              : 'border-gray-100 hover:border-gray-200 bg-white'
          )}
        >
          <span className="text-xl">{getPostTypeIcon(type)}</span>
          <span className="text-xs font-medium text-gray-700">{getPostTypeLabel(type)}</span>
        </button>
      ))}
    </div>
  )
}
