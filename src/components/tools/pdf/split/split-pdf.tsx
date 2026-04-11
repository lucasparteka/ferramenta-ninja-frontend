'use client'

import { useRef, useState } from 'react'
import { extractPages, splitAllPages, downloadPDF } from '@/lib/pdf/split'
import { Button } from '@/components/ui/button'

type SplitState = 'idle' | 'processing' | 'done' | 'error'
type SplitMode = 'extract' | 'all'

export function SplitPDF() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [mode, setMode] = useState<SplitMode>('extract')
  const [pageRange, setPageRange] = useState('')
  const [state, setState] = useState<SplitState>('idle')
  const [singleResult, setSingleResult] = useState<Uint8Array | null>(null)
  const [multiResults, setMultiResults] = useState<Uint8Array[]>([])
  const [errorMsg, setErrorMsg] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function processFile(selected: File) {
    if (selected.type !== 'application/pdf') {
      setState('error')
      setErrorMsg('O arquivo selecionado não é um PDF válido.')
      return
    }
    setFile(selected)
    setPreview(selected.name)
    setState('idle')
    setSingleResult(null)
    setMultiResults([])
    setErrorMsg('')
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) processFile(dropped)
  }

  function handleClear() {
    setFile(null)
    setPreview('')
    setState('idle')
    setSingleResult(null)
    setMultiResults([])
    setErrorMsg('')
    setPageRange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleSplit() {
    if (!file) return
    setState('processing')
    setErrorMsg('')
    setSingleResult(null)
    setMultiResults([])
    try {
      if (mode === 'extract') {
        if (!pageRange.trim()) {
          setState('error')
          setErrorMsg('Informe as páginas que deseja extrair.')
          return
        }
        const bytes = await extractPages(file, pageRange)
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

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground">
          Selecione um PDF
        </label>
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
          {preview ? (
            <p className="px-4 text-center text-sm font-medium text-foreground">{preview}</p>
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
        {preview && (
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
              onChange={() => setMode('extract')}
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
              onChange={() => setMode('all')}
              className="accent-primary"
            />
            <span className="text-sm text-foreground">Dividir todas as páginas</span>
          </label>
        </div>
      </div>

      {mode === 'extract' && (
        <div className="space-y-1">
          <label
            htmlFor="page-range"
            className="block text-sm font-medium text-foreground"
          >
            Páginas (ex: 1,3,5-7)
          </label>
          <input
            id="page-range"
            type="text"
            value={pageRange}
            onChange={(e) => setPageRange(e.target.value)}
            placeholder="ex: 1,3,5-7"
            className="w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <p className="text-xs text-muted-foreground">
            Use vírgulas para separar páginas e hífens para intervalos.
          </p>
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
