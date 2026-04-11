'use client'

import { useRef, useState } from 'react'
import { mergePDFs, downloadPDF } from '@/lib/pdf/merge'
import { Button } from '@/components/ui/button'

type MergeState = 'idle' | 'processing' | 'done' | 'error'

export function MergePDF() {
  const [files, setFiles] = useState<File[]>([])
  const [state, setState] = useState<MergeState>('idle')
  const [result, setResult] = useState<Uint8Array | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function addFiles(incoming: FileList | null) {
    if (!incoming) return
    const pdfs = Array.from(incoming).filter((f) => f.type === 'application/pdf')
    if (pdfs.length === 0) return
    setFiles((prev) => [...prev, ...pdfs])
    setState('idle')
    setResult(null)
    setErrorMsg('')
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setState('idle')
    setResult(null)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }

  async function handleMerge() {
    if (files.length < 2) return
    setState('processing')
    setErrorMsg('')
    try {
      const bytes = await mergePDFs(files)
      setResult(bytes)
      setState('done')
    } catch {
      setState('error')
      setErrorMsg('Erro ao juntar os PDFs. Verifique se os arquivos são PDFs válidos.')
    }
  }

  function handleDownload() {
    if (!result) return
    downloadPDF(result, 'documento-juntado.pdf')
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground">
          Selecione os arquivos PDF
        </label>
        <div
          role="button"
          tabIndex={0}
          aria-label="Área de upload de PDFs. Clique ou arraste arquivos."
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border bg-secondary hover:border-primary hover:bg-primary/5'
          }`}
        >
          <p className="text-sm font-medium text-foreground">
            Arraste os PDFs ou clique para selecionar
          </p>
          <p className="text-xs text-muted-foreground">Apenas arquivos PDF</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          onChange={(e) => addFiles(e.target.files)}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            Arquivos selecionados ({files.length})
          </p>
          <ul className="space-y-2" aria-label="Lista de arquivos PDF selecionados">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded-lg border border-border bg-secondary px-4 py-2"
              >
                <span className="truncate text-sm text-foreground">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  aria-label={`Remover ${file.name}`}
                  className="ml-4 shrink-0 text-sm text-muted-foreground hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          className="sm:flex-1"
          disabled={files.length < 2 || state === 'processing'}
          onClick={handleMerge}
        >
          {state === 'processing' ? 'Processando...' : 'Juntar PDFs'}
        </Button>
        {state === 'done' && result && (
          <Button variant="outline" className="sm:flex-1" onClick={handleDownload}>
            Baixar PDF
          </Button>
        )}
      </div>

      {state === 'error' && (
        <p aria-live="polite" className="text-sm text-destructive">
          {errorMsg}
        </p>
      )}
      {state === 'done' && (
        <p aria-live="polite" className="text-sm text-foreground">
          PDFs juntados com sucesso. Clique em "Baixar PDF" para salvar o resultado.
        </p>
      )}
    </div>
  )
}
