'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'

type ImageUploadProps = {
  preview: string
  isDragging: boolean
  onFile: (file: File) => void
  onClear: () => void
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void
}

export function ImageUpload({
  preview,
  isDragging,
  onFile,
  onClear,
  onDragOver,
  onDragLeave,
  onDrop,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) onFile(file)
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-foreground">
        Selecione uma imagem
      </label>
      <div
        role="button"
        tabIndex={0}
        aria-label="Área de upload de imagem. Clique ou arraste uma imagem."
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`flex min-h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border bg-secondary hover:border-primary hover:bg-primary/5'
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Pré-visualização da imagem selecionada"
            className="max-h-48 max-w-full rounded object-contain"
          />
        ) : (
          <>
            <p className="text-sm font-medium text-foreground">
              Arraste uma imagem ou clique para selecionar
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WebP</p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
      {preview && (
        <Button variant="outline" className="mt-3 w-full" onClick={onClear}>
          Limpar
        </Button>
      )}
    </div>
  )
}
