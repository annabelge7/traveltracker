'use client'

import { Badge, Button } from '@/components/atoms'
import { Post } from '@/types'
import { formatDate } from '@/lib/utils'
import { MapPin, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'

export interface PostDetailModalProps {
  post: Post | null
  onClose: () => void
}

export function PostDetailModal({ post, onClose }: PostDetailModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  // Reset photo index when post changes
  useEffect(() => {
    setCurrentPhotoIndex(0)
  }, [post])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  if (!post) return null

  const hasPhotos = post.photos && post.photos.length > 0
  const hasMultiplePhotos = post.photos && post.photos.length > 1

  const nextPhoto = () => {
    if (post.photos) {
      setCurrentPhotoIndex((prev) => (prev + 1) % post.photos.length)
    }
  }

  const prevPhoto = () => {
    if (post.photos) {
      setCurrentPhotoIndex((prev) => (prev - 1 + post.photos.length) % post.photos.length)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        {/* Photo gallery */}
        {hasPhotos && (
          <div className="relative bg-gray-900 flex items-center justify-center">
            <img
              src={post.photos[currentPhotoIndex]}
              alt={post.title}
              className="w-full max-h-[60vh] object-contain"
            />

            {/* Photo navigation */}
            {hasMultiplePhotos && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>

                {/* Photo indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {post.photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentPhotoIndex
                          ? 'bg-white'
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{post.title}</h2>
              {(post.location || post.country) && (
                <div className="flex items-center gap-1.5 text-gray-500 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {[post.location, post.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
            </div>
            <Badge type={post.type} />
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>

          {/* Description */}
          {post.description && (
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600 whitespace-pre-wrap">{post.description}</p>
            </div>
          )}

          {/* Photo thumbnails */}
          {hasMultiplePhotos && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2">All photos ({post.photos.length})</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {post.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentPhotoIndex
                        ? 'border-black'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
