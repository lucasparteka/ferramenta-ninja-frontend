'use client'

import { useState } from 'react'
import { textToMorse, morseToText } from '@/lib/encoding/morse'
import { Button } from '@/components/ui/button'

const textareaClass =
  'w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none'

const outputClass =
  'w-full rounded-lg border border-border bg-secondary px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none'

export function MorseConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  function resetOutput() {
    setOutput('')
    setError('')
  }

  function handleEncode() {
    setError('')
    const cleaned = input.replace(/\n+/g, ' ').trim()
    if (!cleaned) {
      setError('Digite o texto de entrada.')
      return
    }
    try {
      setOutput(textToMorse(cleaned))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao converter para Morse.')
    }
  }

  function handleDecode() {
    setError('')
    const cleaned = input.trim()
    if (!cleaned) {
      setError('Digite o código Morse.')
      return
    }
    try {
      setOutput(morseToText(cleaned))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao converter para texto.')
    }
  }

  function handleCopy() {
    if (!output) return
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <div className="space-y-4 sm:flex-1">
        <div className="space-y-1">
          <label htmlFor="morse-input" className="flex w-full text-sm font-medium text-foreground">
            Texto de entrada
          </label>
          <textarea
            id="morse-input"
            rows={8}
            placeholder="Digite o texto ou cole o código Morse aqui..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              resetOutput()
            }}
            className={textareaClass}
          />
        </div>

        <div className="rounded-lg border border-border bg-secondary p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Formato do código Morse:</p>
          <p className="mt-1">Letras separadas por espaço · Palavras separadas por <code className="text-foreground">/</code></p>
          <p className="mt-1">Exemplo: <code className="text-foreground">.... --- .-.. .- / -- ..- -. -.. ---</code></p>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleEncode}>Texto → Morse</Button>
          <Button variant="outline" onClick={handleDecode}>
            Morse → Texto
          </Button>
        </div>
      </div>

      <div className="space-y-1 sm:flex-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">Resultado</label>
          {output && (
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? 'Copiado!' : 'Copiar'}
            </Button>
          )}
        </div>
        <textarea
          rows={8}
          readOnly
          value={output}
          placeholder="O resultado aparecerá aqui..."
          className={outputClass}
        />
      </div>
    </div>
  )
}
