'use client'

export const dynamic = 'force-dynamic'

import { MainLayout, Timeline, FilterBar, MobilePostDrawer, PostDetailModal } from '@/components'
import { CurrentStatusCard } from '@/components/organisms/CurrentStatusCard'
import { usePosts } from '@/hooks/usePosts'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { Post } from '@/types'
import { useMemo, useState } from 'react'

export default function HomePage() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const { isAdmin } = useAuth()
  const supabase = createClient()

  const { posts, loading, error, refetch } = usePosts(
    selectedCountry ? { country: selectedCountry } : undefined
  )

  // Extract unique countries from posts
  const countries = useMemo(() => {
    const countrySet = new Set(posts.map((p) => p.country).filter(Boolean) as string[])
    return Array.from(countrySet).sort()
  }, [posts])

  // Get current status from most recent posts
  const currentStatus = useMemo(() => {
    const recentPlace = posts.find((p) => p.type === 'place')
    const recentHostel = posts.find((p) => p.type === 'hostel')
    const recentPeople = posts.find((p) => p.type === 'people')
    const recentBus = posts.find((p) => p.type === 'bus')

    return {
      location: recentPlace?.location || recentHostel?.location || null,
      country: recentPlace?.country || recentHostel?.country || null,
      hostel: recentHostel?.title || null,
      travelingWith: recentPeople?.title || null,
      nextDestination: recentBus?.description || null,
      lastUpdate: posts[0]?.date || null,
    }
  }, [posts])

  const handleAddClick = () => {
    setEditingPost(null)
    setDrawerOpen(true)
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setDrawerOpen(true)
  }

  const handleDelete = async (postId: string) => {
    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId)
      if (error) throw error
      refetch()
    } catch (err) {
      console.error('Failed to delete post:', err)
      alert('Failed to delete post')
    }
  }

  const handleDrawerClose = (open: boolean) => {
    setDrawerOpen(open)
    if (!open) {
      setEditingPost(null)
    }
  }

  return (
    <MainLayout
      showAddButton={isAdmin}
      onAddClick={handleAddClick}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Journey</h1>
        <p className="text-gray-500 mt-1">
          Central & South America Adventure
        </p>
      </div>

      {/* Current Status Overview */}
      <CurrentStatusCard status={currentStatus} className="mb-6" />

      {/* Filters */}
      <FilterBar
        countries={countries}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        className="mb-6"
      />

      {/* Timeline */}
      <Timeline
        posts={posts}
        loading={loading}
        error={error}
        isAdmin={isAdmin}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPostClick={setSelectedPost}
      />

      {/* Mobile drawer for adding/editing posts */}
      {isAdmin && (
        <MobilePostDrawer
          open={drawerOpen}
          onOpenChange={handleDrawerClose}
          onPostSuccess={refetch}
          editingPost={editingPost}
        />
      )}

      {/* Post detail modal */}
      <PostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </MainLayout>
  )
}
