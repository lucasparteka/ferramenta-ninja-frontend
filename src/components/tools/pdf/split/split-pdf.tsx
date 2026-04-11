'use client'

import { useRef, useState } from 'react'
import { extractPagesByIndex, splitAllPages, downloadPDF } from '@/lib/pdf/split'
import { renderAllPageThumbnails } from '@/lib/pdf/thumbnail'
import { Button } from '@/components/ui/button'

type SplitState = 'idle' | 'processing' | 'done' | 'error'
type SplitMode = 'extract' | 'all'

export function SplitPDF() {
  const [file, setFile] = useState<File | null>(null)
  const [mode, setMode] = useState<SplitMode>('extract')
  const [state, setState] = useState<SplitState>('idle')
  const [thumbnails, setThumbnails] = useState<(string | null)[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [generatingThumbs, setGeneratingThumbs] = useState(false)
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set())
  const [singleResult, setSingleResult] = useState<Uint8Array | null>(null)
  const [multiResults, setMultiResults] = useState<Uint8Array[]>([])
  const [errorMsg, setErrorMsg] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function processFile(selected: File) {
    if (selected.type !== 'application/pdf') {
      setState('error')
      setErrorMsg('O arquivo selecionado não é um PDF válido.')
      return
    }

    setFile(selected)
    setState('idle')
    setSingleResult(null)
    setMultiResults([])
    setErrorMsg('')
    setSelectedPages(new Set())
    setThumbnails([])
    setTotalPages(0)
    setGeneratingThumbs(true)

    try {
      const total = await renderAllPageThumbnails(selected, 220, (index, dataUrl) => {
        setThumbnails((prev) => {
          const next = [...prev]
          next[index] = dataUrl
          return next
        })
      })
      setTotalPages(total)
    } catch {
      // thumbnails are optional — tool still works without them
    } finally {
      setGeneratingThumbs(false)
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) processFile(dropped)
  }

  function handleClear() {
    setFile(null)
    setState('idle')
    setSingleResult(null)
    setMultiResults([])
    setErrorMsg('')
    setThumbnails([])
    setTotalPages(0)
    setSelectedPages(new Set())
    setGeneratingThumbs(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  function togglePage(index: number) {
    setSelectedPages((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  function selectAll() {
    setSelectedPages(new Set(Array.from({ length: totalPages }, (_, i) => i)))
  }

  function clearSelection() {
    setSelectedPages(new Set())
  }

  async function handleSplit() {
    if (!file) return
    setState('processing')
    setErrorMsg('')
    setSingleResult(null)
    setMultiResults([])

    try {
      if (mode === 'extract') {
        if (selectedPages.size === 0) {
          setState('error')
          setErrorMsg('Selecione ao menos uma página para extrair.')
          return
        }
        const bytes = await extractPagesByIndex(file, Array.from(selectedPages))
        setSingleResult(bytes)
      } else {
        const results = await splitAllPages(file)
        setMultiResults(results)
      }
      setState('done')
    } catch (e) {
      setState('error')
      setErrorMsg(e instanceof Error ? e.message : 'Erro ao dividir o PDF.')
    }
  }

  async function handleDownloadAll() {
    const baseName = file ? file.name.replace(/\.pdf$/i, '') : 'pagina'
    for (let i = 0; i < multiResults.length; i++) {
      downloadPDF(multiResults[i], `${baseName}-pagina-${i + 1}.pdf`)
      await new Promise<void>((resolve) => setTimeout(resolve, 150))
    }
  }

  const thumbCount = thumbnails.filter(Boolean).length
  const displayPages = totalPages || thumbnails.length

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground">Selecione um PDF</label>
        <div
          role="button"
          tabIndex={0}
          aria-label="Área de upload de PDF. Clique ou arraste um arquivo."
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
          {file ? (
            <p className="px-4 text-center text-sm font-medium text-foreground">{file.name}</p>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground">
                Arraste um PDF ou clique para selecionar
              </p>
              <p className="text-xs text-muted-foreground">Apenas arquivo PDF</p>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) processFile(f)
          }}
          className="hidden"
          aria-hidden="true"
        />
        {file && (
          <Button variant="outline" className="mt-3 w-full" onClick={handleClear}>
            Limpar
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Modo de divisão</p>
        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="radio"
              name="split-mode"
              value="extract"
              checked={mode === 'extract'}
              onChange={() => {
                setMode('extract')
                setSingleResult(null)
                setMultiResults([])
                if (state === 'done') setState('idle')
              }}
              className="accent-primary"
            />
            <span className="text-sm text-foreground">Extrair páginas específicas</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="radio"
              name="split-mode"
              value="all"
              checked={mode === 'all'}
              onChange={() => {
                setMode('all')
                setSelectedPages(new Set())
                setSingleResult(null)
                setMultiResults([])
                if (state === 'done') setState('idle')
              }}
              className="accent-primary"
            />
            <span className="text-sm text-foreground">Dividir todas as páginas</span>
          </label>
        </div>
      </div>

      {file && (displayPages > 0 || generatingThumbs) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {generatingThumbs
                ? `Gerando miniaturas… (${thumbCount}/${totalPages || '?'})`
                : `${totalPages} página(s)`}
              {mode === 'extract' && selectedPages.size > 0 &&
                ` — ${selectedPages.size} selecionada(s)`}
            </p>
            {mode === 'extract' && totalPages > 0 && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-xs text-primary hover:underline"
                >
                  Selecionar tudo
                </button>
                {selectedPages.size > 0 && (
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="text-xs text-muted-foreground hover:underline"
                  >
                    Limpar seleção
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: displayPages }, (_, i) => {
              const thumb = thumbnails[i]
              const selected = selectedPages.has(i)

              return (
                <button
                  key={i}
                  type="button"
                  disabled={mode === 'all'}
                  onClick={() => mode === 'extract' && togglePage(i)}
                  className={`group relative flex flex-col overflow-hidden rounded-lg border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    mode === 'extract'
                      ? selected
                        ? 'border-primary shadow-sm'
                        : 'border-border hover:border-primary/50'
                      : 'cursor-default border-border'
                  }`}
                  aria-label={`Página ${i + 1}${selected ? ' — selecionada' : ''}`}
                  aria-pressed={mode === 'extract' ? selected : undefined}
                >
                  <div className="flex aspect-3/4 items-center justify-center bg-secondary">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={`Página ${i + 1}`}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
                    )}
                  </div>
                  <span className="block py-1 text-center text-xs text-muted-foreground">
                    {i + 1}
                  </span>
                  {mode === 'extract' && selected && (
                    <div className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      ✓
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          className="sm:flex-1"
          disabled={!file || state === 'processing'}
          onClick={handleSplit}
        >
          {state === 'processing' ? 'Processando...' : 'Dividir PDF'}
        </Button>
        {state === 'done' && mode === 'extract' && singleResult && (
          <Button
            variant="outline"
            className="sm:flex-1"
            onClick={() => {
              const baseName = file ? file.name.replace(/\.pdf$/i, '') : 'paginas'
              downloadPDF(singleResult, `${baseName}-extraido.pdf`)
            }}
          >
            Baixar PDF
          </Button>
        )}
        {state === 'done' && mode === 'all' && multiResults.length > 0 && (
          <Button variant="outline" className="sm:flex-1" onClick={handleDownloadAll}>
            Baixar todos ({multiResults.length} arquivos)
          </Button>
        )}
      </div>

      {state === 'error' && (
        <p aria-live="polite" className="text-sm text-destructive">
          {errorMsg}
        </p>
      )}
      {state === 'done' && mode === 'extract' && (
        <p aria-live="polite" className="text-sm text-foreground">
          Páginas extraídas com sucesso. Clique em "Baixar PDF" para salvar.
        </p>
      )}
      {state === 'done' && mode === 'all' && (
        <p aria-live="polite" className="text-sm text-foreground">
          PDF dividido em {multiResults.length} arquivo(s). Clique em "Baixar todos" para
          iniciar os downloads.
        </p>
      )}
    </div>
  )
}
