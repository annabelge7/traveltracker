'use client'

export const dynamic = 'force-dynamic'

import { MainLayout, PostForm, Timeline } from '@/components'
import { Card, CardContent, CardHeader } from '@/components/atoms'
import { usePosts } from '@/hooks/usePosts'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminPage() {
  const { user, loading, isAdmin } = useAuth()
  const { posts, loading: postsLoading, error, refetch } = usePosts()
  const router = useRouter()

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/auth?redirect=/admin')
    }
  }, [user, loading, isAdmin, router])

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </MainLayout>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <MainLayout>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Post Form */}
        <div>
          <Card variant="bordered">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900">New Post</h2>
              <p className="text-sm text-gray-500">Share an update from your journey</p>
            </CardHeader>
            <CardContent>
              <PostForm onSuccess={refetch} />
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h2>
          <Timeline
            posts={posts.slice(0, 5)}
            loading={postsLoading}
            error={error}
          />
        </div>
      </div>
    </MainLayout>
  )
}
