'use client'

import { Card, CardContent, Badge } from '@/components/atoms'
import { Post } from '@/types'
import { formatDate, formatRelativeDate } from '@/lib/utils'
import { MapPin, Calendar, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export interface PostCardProps {
  post: Post
  isAdmin?: boolean
  onEdit?: (post: Post) => void
  onDelete?: (postId: string) => void
  onClick?: (post: Post) => void
  className?: string
}

export function PostCard({ post, isAdmin, onEdit, onDelete, onClick, className }: PostCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const hasPhotos = post.photos && post.photos.length > 0

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this post?')) return
    setIsDeleting(true)
    onDelete?.(post.id)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(post)
  }

  return (
    <Card
      variant="bordered"
      className={cn('overflow-hidden cursor-pointer hover:shadow-md transition-shadow', className)}
      onClick={() => onClick?.(post)}
    >
      {/* Photo gallery */}
      {hasPhotos && (
        <div className="-mx-4 -mt-4 mb-4">
          {post.photos.length === 1 ? (
            <img
              src={post.photos[0]}
              alt={post.title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="grid grid-cols-2 gap-0.5">
              {post.photos.slice(0, 4).map((photo, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={photo}
                    alt={`${post.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 3 && post.photos.length > 4 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-lg font-medium">
                        +{post.photos.length - 4}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <CardContent>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
            {post.location && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{post.location}</span>
                {post.country && (
                  <span className="text-gray-400">• {post.country}</span>
                )}
              </div>
            )}
          </div>
          <Badge type={post.type} />
        </div>

        {/* Description */}
        {post.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-3">
            {post.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            <time dateTime={post.date} title={formatDate(post.date)}>
              {formatRelativeDate(post.date)}
            </time>
          </div>

          {/* Admin actions */}
          {isAdmin && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleEdit}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                title="Edit post"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                title="Delete post"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
