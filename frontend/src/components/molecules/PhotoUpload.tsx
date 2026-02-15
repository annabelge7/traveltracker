'use client'

import { cn } from '@/lib/utils'
import { useCallback, useState } from 'react'
import { Camera, X, ImagePlus } from 'lucide-react'

export interface PhotoUploadProps {
  value: File[]
  onChange: (files: File[]) => void
  maxFiles?: number
  className?: string
}

export function PhotoUpload({ value, onChange, maxFiles = 10, className }: PhotoUploadProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith('image/')
    )
    if (files.length > 0) {
      onChange([...value, ...files].slice(0, maxFiles))
    }
  }, [value, onChange, maxFiles])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length > 0) {
      onChange([...value, ...files].slice(0, maxFiles))
    }
    e.target.value = ''
  }, [value, onChange, maxFiles])

  const removeFile = useCallback((index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }, [value, onChange])

  return (
    <div className={cn('space-y-3', className)}>
      {/* Drop zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 transition-colors duration-200 text-center',
          dragActive ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="photo-upload"
        />
        <label
          htmlFor="photo-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <div className="flex gap-2">
            <ImagePlus className="h-6 w-6 text-gray-400" />
            <Camera className="h-6 w-6 text-gray-400" />
          </div>
          <span className="text-sm text-gray-600">
            Drop photos here or tap to upload
          </span>
          <span className="text-xs text-gray-400">
            {value.length}/{maxFiles} photos
          </span>
        </label>
      </div>

      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {value.map((file, index) => (
            <div key={index} className="relative aspect-square group">
              <img
                src={URL.createObjectURL(file)}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
