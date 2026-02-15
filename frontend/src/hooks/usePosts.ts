'use client'

import { createClient } from '@/lib/supabase/client'
import { Post } from '@/types'
import { useEffect, useState, useCallback } from 'react'

export function usePosts(filters?: { country?: string; startDate?: string; endDate?: string }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)

    let query = supabase
      .from('posts')
      .select('*')
      .order('date', { ascending: false })

    if (filters?.country) {
      query = query.eq('country', filters.country)
    }
    if (filters?.startDate) {
      query = query.gte('date', filters.startDate)
    }
    if (filters?.endDate) {
      query = query.lte('date', filters.endDate)
    }

    const { data, error: fetchError } = await query

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setPosts(data || [])
    }
    setLoading(false)
  }, [supabase, filters?.country, filters?.startDate, filters?.endDate])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('posts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, fetchPosts])

  return { posts, loading, error, refetch: fetchPosts }
}
