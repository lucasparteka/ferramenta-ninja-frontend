'use client'

import { useRef, useState } from 'react'
import jsQR from 'jsqr'
import { Button } from '@/components/ui/button'

type ReaderState = 'idle' | 'loading' | 'success' | 'error'

async function decodeQRFromFile(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Não foi possível criar o contexto de canvas.')
  ctx.drawImage(bitmap, 0, 0)
  const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height)
  const code = jsQR(imageData.data, imageData.width, imageData.height)
  if (!code) throw new Error('Nenhum QR Code encontrado na imagem.')
  return code.data
}

export function QRReader() {
  const [state, setState] = useState<ReaderState>('idle')
  const [result, setResult] = useState('')
  const [preview, setPreview] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [copied, setCopied] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function processFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setState('error')
      setErrorMsg('O arquivo selecionado não é uma imagem válida.')
      return
    }
    setState('loading')
    setResult('')
    setErrorMsg('')
    setPreview(URL.createObjectURL(file))
    try {
      const data = await decodeQRFromFile(file)
      setResult(data)
      setState('success')
    } catch (e) {
      setState('error')
      setErrorMsg(e instanceof Error ? e.message : 'Erro ao processar a imagem.')
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  function handleCopy() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <div className="sm:flex-1">
        <div className="space-y-1">
          <span className="flex w-full text-sm font-medium text-foreground">
            Imagem com QR Code
          </span>
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex min-h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors ${
              isDragging ? 'border-primary bg-primary/5' : 'border-border bg-secondary hover:border-primary hover:bg-primary/5'
            }`}
          >
            {preview ? (
              <img
                src={preview}
                alt="Imagem carregada"
                className="max-h-48 max-w-full rounded object-contain"
              />
            ) : (
              <>
                <p className="text-sm font-medium text-foreground">
                  Arraste uma imagem ou clique para selecionar
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG, WebP, GIF, BMP</p>
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        {preview && (
          <Button
            variant="outline"
            className="mt-3 w-full"
            onClick={() => {
              setPreview('')
              setResult('')
              setState('idle')
              setErrorMsg('')
              if (inputRef.current) inputRef.current.value = ''
            }}
          >
            Limpar
          </Button>
        )}
      </div>

      <div className="space-y-1 sm:flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Conteúdo decodificado</span>
          {result && (
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? 'Copiado!' : 'Copiar'}
            </Button>
          )}
        </div>
        <div className="min-h-56 rounded-lg border border-border bg-secondary p-4">
          {state === 'idle' && (
            <p className="text-sm text-muted-foreground">
              O conteúdo do QR Code aparecerá aqui após o carregamento da imagem.
            </p>
          )}
          {state === 'loading' && (
            <p className="text-sm text-muted-foreground">Processando imagem...</p>
          )}
          {state === 'success' && (
            <p className="break-all text-sm text-foreground">{result}</p>
          )}
          {state === 'error' && (
            <p className="text-sm text-destructive">{errorMsg}</p>
          )}
        </div>
      </div>
    </div>
  )
}
