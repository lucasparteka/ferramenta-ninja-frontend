'use client'

import { useState } from 'react'
import { removeDuplicateLines } from '@/lib/text/deduplicate'
import { Button } from '@/components/ui/button'
import { RemoveDuplicatesInput } from './input'
import { RemoveDuplicatesOptions } from './options'
import { RemoveDuplicatesOutput } from './output'

type DeduplicateOptions = {
  keepOrder: boolean
  ignoreCase: boolean
  removeEmpty: boolean
}

type ProcessResult = {
  output: string
  totalLines: number
  uniqueLines: number
  removedLines: number
}

const DEFAULT_OPTIONS: DeduplicateOptions = {
  keepOrder: true,
  ignoreCase: false,
  removeEmpty: true,
}

export function RemoveDuplicates() {
  const [input, setInput] = useState('')
  const [options, setOptions] = useState<DeduplicateOptions>(DEFAULT_OPTIONS)
  const [result, setResult] = useState<ProcessResult | null>(null)
  const [copied, setCopied] = useState(false)

  function handleInput(value: string) {
    setInput(value)
    setResult(null)
  }

  function handleProcess() {
    const output = removeDuplicateLines(input, options)
    const totalLines = input
      .split('\n')
      .filter((line) => !(options.removeEmpty && line.trim() === '')).length
    const uniqueLines = output === '' ? 0 : output.split('\n').length

    setResult({
      output,
      totalLines,
      uniqueLines,
      removedLines: totalLines - uniqueLines,
    })
    setCopied(false)
  }

  function handleCopy() {
    if (!result?.output) return
    navigator.clipboard.writeText(result.output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <RemoveDuplicatesInput value={input} onChange={handleInput} />
      <RemoveDuplicatesOptions options={options} onChange={setOptions} />
      <Button onClick={handleProcess} disabled={!input.trim()}>
        Remover duplicados
      </Button>

      {result && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Linhas originais', value: result.totalLines },
            { label: 'Linhas únicas', value: result.uniqueLines },
            { label: 'Removidas', value: result.removedLines },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-secondary p-3 text-center"
            >
              <p className="text-xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      <RemoveDuplicatesOutput
        value={result?.output ?? ''}
        onCopy={handleCopy}
        copied={copied}
      />
    </div>
  )
}
