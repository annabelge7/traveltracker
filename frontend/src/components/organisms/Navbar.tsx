'use client'

import { Button, Avatar } from '@/components/atoms'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MapPin, Plus, LogOut } from 'lucide-react'

export interface NavbarProps {
  showAddButton?: boolean
  onAddClick?: () => void
}

export function Navbar({ showAddButton = false, onAddClick }: NavbarProps) {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-black" />
          <span className="font-semibold text-gray-900">TravelTracker</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {isAdmin && showAddButton && (
                <Button size="sm" onClick={onAddClick}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              )}
              {isAdmin && (
                <Link href="/admin">
                  <Button size="sm" variant="ghost">
                    Admin
                  </Button>
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
              <Avatar
                alt={user.email || ''}
                fallback={user.email?.charAt(0).toUpperCase()}
                size="sm"
              />
            </>
          ) : (
            <Link href="/auth">
              <Button size="sm" variant="secondary">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
