'use client'

import { PostForm } from './PostForm'
import { Drawer } from 'vaul'
import { X } from 'lucide-react'
import { Post } from '@/types'

export interface MobilePostDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPostSuccess?: () => void
  editingPost?: Post | null
}

export function MobilePostDrawer({ open, onOpenChange, onPostSuccess, editingPost }: MobilePostDrawerProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="bg-white flex flex-col fixed bottom-0 left-0 right-0 max-h-[90vh] rounded-t-2xl z-50">
          {/* Handle */}
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-200 mt-4" />

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <Drawer.Title className="font-semibold text-gray-900">
              {editingPost ? 'Edit Post' : 'New Post'}
            </Drawer.Title>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-4">
            <PostForm
              editingPost={editingPost}
              onSuccess={() => {
                onOpenChange(false)
                onPostSuccess?.()
              }}
              onCancel={() => onOpenChange(false)}
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
