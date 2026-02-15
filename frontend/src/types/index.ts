export type PostType = 'place' | 'hostel' | 'people' | 'bus' | 'photo' | 'other'

export interface Post {
  id: string
  created_at: string
  updated_at: string
  type: PostType
  title: string
  description: string | null
  location: string | null
  country: string | null
  latitude: number | null
  longitude: number | null
  date: string
  photos: string[]
  metadata: Record<string, unknown> | null
  user_id: string
}

export interface PostFormData {
  type: PostType
  title: string
  description?: string
  location?: string
  country?: string
  date: string
  photos: File[]
}

export interface User {
  id: string
  email: string
  created_at: string
}
