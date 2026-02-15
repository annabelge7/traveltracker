'use client'

import { Label } from '@/components/atoms'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export interface FormFieldProps {
  label: string
  htmlFor?: string
  required?: boolean
  error?: string
  children: ReactNode
  className?: string
}

export function FormField({ label, htmlFor, required, error, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
}
