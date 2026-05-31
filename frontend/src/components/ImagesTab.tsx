'use client'

import { useRef, useState } from 'react'
import type { DragEvent } from 'react'
import { UploadCloud, Images, Trash2, ImagePlus } from 'lucide-react'
import { ImageData } from '@/types'
import { ImageCarousel } from './ImageCarousel'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface ImagesTabProps {
  imagesLimit: string
  imagesCursor: string
  imageFile: File | null
  images: ImageData[]
  activeImage: ImageData | null
  loading: boolean
  onSelectImage: (index: number) => void
  onDeleteImage: (publicId: string) => void
  onImagesLimitChange: (value: string) => void
  onImagesCursorChange: (value: string) => void
  onImageFileChange: (file: File | null) => void
  onUploadSingle: () => void
  onUploadMany: (files: FileList) => void
  onFetchImages: () => void
  onDeleteActiveImage: () => void
  onCarouselPrev: () => void
  onCarouselNext: () => void
}

export function ImagesTab({
  imagesLimit,
  imagesCursor,
  imageFile,
  images,
  activeImage,
  loading,
  onSelectImage,
  onDeleteImage,
  onImagesLimitChange,
  onImagesCursorChange,
  onImageFileChange,
  onUploadSingle,
  onUploadMany,
  onFetchImages,
  onDeleteActiveImage,
  onCarouselPrev,
  onCarouselNext,
}: ImagesTabProps) {
  const singleInputRef = useRef<HTMLInputElement | null>(null)
  const multiInputRef = useRef<HTMLInputElement | null>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file) onImageFileChange(file)
  }

  return (
    <section className="grid gap-5">
      <Card className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Images</h2>
            <p className="text-xs text-slate-500">Upload or manage your gallery assets.</p>
          </div>
          <Badge variant="outline">{images.length} items</Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            type="number"
            min="1"
            max="100"
            value={imagesLimit}
            onChange={(e) => onImagesLimitChange(e.target.value)}
            placeholder="Limit"
          />
          <Input
            type="text"
            value={imagesCursor}
            onChange={(e) => onImagesCursorChange(e.target.value)}
            placeholder="nextCursor"
          />
        </div>

        <div
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-4 text-center transition ${
            dragging ? 'border-cyan-400 bg-cyan-500/10' : 'border-slate-700 bg-slate-950/40'
          }`}
        >
          <UploadCloud className="h-6 w-6 text-cyan-300" />
          <p className="text-sm font-medium text-slate-200">
            Drag and drop an image, or pick a file
          </p>
          <p className="text-xs text-slate-500">PNG, JPG, or WebP up to 10MB.</p>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => singleInputRef.current?.click()}
          >
            Browse Files
          </Button>
          <input
            ref={singleInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => onImageFileChange(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>

        {imageFile && (
          <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-3 text-xs text-slate-300">
            Selected: <span className="font-semibold text-cyan-300">{imageFile.name}</span>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button type="button" onClick={onUploadSingle} isLoading={loading}>
            <ImagePlus className="h-4 w-4" /> Upload One
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => multiInputRef.current?.click()}
          >
            <Images className="h-4 w-4" /> Upload Many
          </Button>
          <input
            ref={multiInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && onUploadMany(e.target.files)}
            className="hidden"
          />
          <Button type="button" variant="outline" onClick={onFetchImages} isLoading={loading}>
            Get Images
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onDeleteActiveImage}
            disabled={loading || !activeImage?.publicId}
          >
            <Trash2 className="h-4 w-4" /> Delete Active
          </Button>
        </div>
      </Card>

      <Card className="grid gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-md font-semibold">Gallery Carousel</h3>
            <p className="text-xs text-slate-500">Select an image to make it active.</p>
          </div>
          <Badge variant="default">{images.length} Total</Badge>
        </div>

        <ImageCarousel
          images={images}
          activeImage={activeImage}
          onSelect={onSelectImage}
          onDelete={onDeleteImage}
          onPrev={onCarouselPrev}
          onNext={onCarouselNext}
        />
      </Card>
    </section>
  )
}