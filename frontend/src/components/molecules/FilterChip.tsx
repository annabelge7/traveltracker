'use client'

import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

export interface FilterChipProps {
  label: string
  active?: boolean
  onSelect?: () => void
  onRemove?: () => void
  className?: string
}

export function FilterChip({ label, active, onSelect, onRemove, className }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200',
        active
          ? 'bg-black text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        className
      )}
    >
      <span>{label}</span>
      {active && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-1 hover:bg-white/20 rounded-full p-0.5"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </button>
  )
}
