'use client'

import { Navbar } from '@/components/organisms'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export interface MainLayoutProps {
  children: ReactNode
  showAddButton?: boolean
  onAddClick?: () => void
  className?: string
}

export function MainLayout({ children, showAddButton, onAddClick, className }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showAddButton={showAddButton} onAddClick={onAddClick} />
      <main className={cn('max-w-2xl mx-auto px-4 py-6', className)}>
        {children}
      </main>
    </div>
  )
}
