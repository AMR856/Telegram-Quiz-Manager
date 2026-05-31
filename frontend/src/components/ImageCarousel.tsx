'use client'

import { Trash2, CheckCircle } from 'lucide-react'
import { ImageData } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ImageCarouselProps {
  images: ImageData[]
  activeImage: ImageData | null
  onSelect: (index: number) => void
  onDelete: (publicId: string) => void
  onPrev: () => void
  onNext: () => void
}

export function ImageCarousel({
  images,
  activeImage,
  onSelect,
  onDelete,
  onPrev,
  onNext,
}: ImageCarouselProps) {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Active selection</span>
          {activeImage ? (
            <Badge variant="success" className="gap-1">
              <CheckCircle className="h-3 w-3" /> Active
            </Badge>
          ) : (
            <Badge variant="warning">None</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" size="sm" onClick={onPrev}>
            Prev
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={onNext}>
            Next
          </Button>
        </div>
      </div>

      {images.length === 0 ? (
        <p className="text-sm text-slate-400">No images yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => {
            const imageUrl = image.url || image.secureUrl || image.path || ''
            const imageAlt = image.originalName || image.publicId || 'uploaded image'
            const imageLabel =
              image.originalName ||
              image.publicId ||
              image.url ||
              image.secureUrl ||
              image.path ||
              'image'
            const isActive =
              activeImage === image ||
              (activeImage?.publicId && activeImage.publicId === image.publicId)

            return (
              <article
                key={`${image.publicId || image.url || index}`}
                className={`group rounded-2xl border bg-slate-950/40 p-3 transition ${
                  isActive
                    ? 'border-cyan-400/60 shadow-[0_0_0_1px_rgba(6,182,212,0.4)]'
                    : 'border-slate-800'
                }`}
              >
                <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={imageAlt}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center text-xs text-slate-500">
                      No preview
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="truncate text-sm font-semibold text-slate-200">
                      {imageLabel}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {image.publicId || 'local upload'}
                    </p>
                  </div>
                  {isActive && <Badge variant="default">Active</Badge>}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onSelect(index)}
                  >
                    {isActive ? 'Selected' : 'Select'}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => image.publicId && onDelete(image.publicId)}
                    disabled={!image.publicId}
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}