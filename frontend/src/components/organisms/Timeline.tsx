'use client'

import { Spinner } from '@/components/atoms'
import { PostCard } from '@/components/molecules'
import { Post } from '@/types'
import { cn } from '@/lib/utils'

export interface TimelineProps {
  posts: Post[]
  loading?: boolean
  error?: string | null
  isAdmin?: boolean
  onEdit?: (post: Post) => void
  onDelete?: (postId: string) => void
  onPostClick?: (post: Post) => void
  className?: string
}

export function Timeline({ posts, loading, error, isAdmin, onEdit, onDelete, onPostClick, className }: TimelineProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{error}</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No posts yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Check back soon for updates!
        </p>
      </div>
    )
  }

  // Group posts by date, sorted by created_at within each day
  const groupedPosts = posts.reduce((groups, post) => {
    const date = post.date.split('T')[0]
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(post)
    return groups
  }, {} as Record<string, Post[]>)

  // Sort posts within each date group by created_at (most recent first)
  Object.keys(groupedPosts).forEach((date) => {
    groupedPosts[date].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  })

  // Sort date groups by most recent first
  const sortedDates = Object.keys(groupedPosts).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  )

  return (
    <div className={cn('space-y-6', className)}>
      {sortedDates.map((date) => {
        const datePosts = groupedPosts[date]
        return (
          <div key={date}>
            {/* Date header */}
            <div className="sticky top-14 bg-gray-50/80 backdrop-blur-sm z-10 py-2 mb-3">
              <time className="text-sm font-medium text-gray-500">
                {new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>

            {/* Posts for this date */}
            <div className="space-y-4">
              {datePosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isAdmin={isAdmin}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onClick={onPostClick}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
