'use client'

import { cn } from '@/lib/utils'
import { forwardRef, TextareaHTMLAttributes } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full px-3 py-2 text-sm border rounded-lg transition-colors duration-200 resize-none',
          'bg-white border-gray-200',
          'placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'
