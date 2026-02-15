'use client'

import { Button, Input, Textarea } from '@/components/atoms'
import { FormField, TypeSelector, PhotoUpload } from '@/components/molecules'
import { createClient } from '@/lib/supabase/client'
import { postFormSchema, type PostFormValues } from '@/lib/validations'
import { Post, PostType } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'

export interface PostFormProps {
  editingPost?: Post | null
  onSuccess?: () => void
  onCancel?: () => void
}

// Dynamic placeholders based on post type
const placeholders: Record<PostType, { title: string; location: string; description: string }> = {
  place: {
    title: 'e.g., Arrived in Oaxaca!',
    location: 'e.g., Oaxaca City',
    description: 'What are you doing here? First impressions?',
  },
  hostel: {
    title: 'e.g., Selina Oaxaca',
    location: 'e.g., Centro, Oaxaca',
    description: 'How is it? Vibes, price, wifi quality?',
  },
  people: {
    title: 'e.g., Met Sarah & Tom from UK',
    location: 'Where did you meet?',
    description: 'How did you meet? Any plans together?',
  },
  bus: {
    title: 'e.g., ADO Bus to Puerto Escondido',
    location: 'e.g., From Oaxaca to Puerto Escondido',
    description: 'Departure time, duration, seat class, etc.',
  },
  photo: {
    title: 'e.g., Sunset at Monte Alban',
    location: 'Where was this taken?',
    description: 'Caption for your photo',
  },
  other: {
    title: 'What happened?',
    location: 'Where?',
    description: 'Tell us more...',
  },
}

export function PostForm({ editingPost, onSuccess, onCancel }: PostFormProps) {
  const [photos, setPhotos] = useState<File[]>([])
  const [existingPhotos, setExistingPhotos] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      type: editingPost?.type || 'place',
      title: editingPost?.title || '',
      description: editingPost?.description || '',
      location: editingPost?.location || '',
      country: editingPost?.country || '',
      date: editingPost?.date?.split('T')[0] || new Date().toISOString().split('T')[0],
    },
  })

  // Reset form when editingPost changes
  useEffect(() => {
    if (editingPost) {
      reset({
        type: editingPost.type,
        title: editingPost.title,
        description: editingPost.description || '',
        location: editingPost.location || '',
        country: editingPost.country || '',
        date: editingPost.date?.split('T')[0] || new Date().toISOString().split('T')[0],
      })
      setExistingPhotos(editingPost.photos || [])
    } else {
      reset({
        type: 'place',
        title: '',
        description: '',
        location: '',
        country: '',
        date: new Date().toISOString().split('T')[0],
      })
      setExistingPhotos([])
    }
    setPhotos([])
  }, [editingPost, reset])

  // Watch the type field to update placeholders
  const currentType = useWatch({ control, name: 'type' }) as PostType

  const uploadPhotos = async (files: File[]): Promise<string[]> => {
    const urls: string[] = []

    for (const file of files) {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`
      const { data, error } = await supabase.storage
        .from('photos')
        .upload(fileName, file)

      if (error) throw error

      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(data.path)

      urls.push(urlData.publicUrl)
    }

    return urls
  }

  const onSubmit = async (data: PostFormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('You must be logged in to post')

      // Upload new photos
      let newPhotoUrls: string[] = []
      if (photos.length > 0) {
        newPhotoUrls = await uploadPhotos(photos)
      }

      // Combine existing photos with new ones
      const allPhotos = [...existingPhotos, ...newPhotoUrls]

      if (editingPost) {
        // Update existing post
        const { error: updateError } = await supabase
          .from('posts')
          .update({
            type: data.type,
            title: data.title,
            description: data.description || null,
            location: data.location || null,
            country: data.country || null,
            date: data.date,
            photos: allPhotos,
          })
          .eq('id', editingPost.id)

        if (updateError) throw updateError
      } else {
        // Create new post
        const { error: insertError } = await supabase.from('posts').insert({
          user_id: user.id,
          type: data.type,
          title: data.title,
          description: data.description || null,
          location: data.location || null,
          country: data.country || null,
          date: data.date,
          photos: allPhotos,
        })

        if (insertError) throw insertError
      }

      reset()
      setPhotos([])
      setExistingPhotos([])
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeExistingPhoto = (index: number) => {
    setExistingPhotos(existingPhotos.filter((_, i) => i !== index))
  }

  const currentPlaceholders = placeholders[currentType] || placeholders.other

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Post Type */}
      <FormField label="What are you posting?">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <TypeSelector
              value={field.value as PostType}
              onChange={field.onChange}
            />
          )}
        />
      </FormField>

      {/* Title */}
      <FormField
        label={currentType === 'hostel' ? 'Hostel Name' : currentType === 'people' ? 'Who?' : 'Title'}
        htmlFor="title"
        required
        error={errors.title?.message}
      >
        <Input
          id="title"
          placeholder={currentPlaceholders.title}
          error={!!errors.title}
          {...register('title')}
        />
      </FormField>

      {/* Location & Country */}
      <div className="grid grid-cols-2 gap-3">
        <FormField
          label={currentType === 'bus' ? 'Route' : 'City/Town'}
          htmlFor="location"
          error={errors.location?.message}
        >
          <Input
            id="location"
            placeholder={currentPlaceholders.location}
            error={!!errors.location}
            {...register('location')}
          />
        </FormField>
        <FormField
          label="Country"
          htmlFor="country"
          error={errors.country?.message}
        >
          <Input
            id="country"
            placeholder="e.g., Mexico"
            error={!!errors.country}
            {...register('country')}
          />
        </FormField>
      </div>

      {/* Date */}
      <FormField
        label="Date"
        htmlFor="date"
        required
        error={errors.date?.message}
      >
        <Input
          id="date"
          type="date"
          error={!!errors.date}
          {...register('date')}
        />
      </FormField>

      {/* Description */}
      <FormField
        label="Notes"
        htmlFor="description"
        error={errors.description?.message}
      >
        <Textarea
          id="description"
          rows={3}
          placeholder={currentPlaceholders.description}
          error={!!errors.description}
          {...register('description')}
        />
      </FormField>

      {/* Existing Photos */}
      {existingPhotos.length > 0 && (
        <FormField label="Current Photos">
          <div className="grid grid-cols-4 gap-2">
            {existingPhotos.map((photo, index) => (
              <div key={index} className="relative aspect-square group">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeExistingPhoto(index)}
                  className="absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="text-white text-xs">×</span>
                </button>
              </div>
            ))}
          </div>
        </FormField>
      )}

      {/* New Photos */}
      <FormField label={existingPhotos.length > 0 ? 'Add More Photos' : 'Photos'}>
        <PhotoUpload value={photos} onChange={setPhotos} />
      </FormField>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button type="submit" loading={isSubmitting} className="flex-1">
          {editingPost ? 'Save Changes' : 'Post'}
        </Button>
      </div>
    </form>
  )
}
