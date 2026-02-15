'use client'

import { Card, CardContent } from '@/components/atoms'
import { LoginForm } from '@/components/organisms'
import { MapPin } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AuthContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const redirectTo = searchParams.get('redirect') || '/'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <MapPin className="h-8 w-8 text-black" />
          <span className="text-2xl font-bold text-gray-900">TravelTracker</span>
        </Link>

        <Card variant="bordered">
          <CardContent>
            <h1 className="text-xl font-semibold text-gray-900 text-center mb-1">
              Welcome
            </h1>
            <p className="text-sm text-gray-500 text-center mb-6">
              Sign in to follow my journey
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <LoginForm redirectTo={redirectTo} />
          </CardContent>
        </Card>

        <p className="text-xs text-gray-400 text-center mt-6">
          We&apos;ll send you a magic link to sign in.
          <br />
          No password needed.
        </p>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
}
