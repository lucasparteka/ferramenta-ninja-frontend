'use client'

import { useState } from 'react'
import { generateMultipleCPF } from '@/lib/cpf/generate'
import { Button } from '@/components/ui/button'
import { CpfList } from './cpf-list'

export function CpfGenerator() {
  const [quantity, setQuantity] = useState(1)
  const [formatted, setFormatted] = useState(true)
  const [cpfs, setCpfs] = useState<string[]>([])
  const [copiedAll, setCopiedAll] = useState(false)

  function handleQuantity(raw: string) {
    const value = Number(raw)
    if (!Number.isNaN(value)) {
      setQuantity(Math.min(100, Math.max(1, value)))
    }
  }

  function handleGenerate() {
    setCpfs(generateMultipleCPF(quantity, formatted))
    setCopiedAll(false)
  }

  function handleCopyAll() {
    navigator.clipboard.writeText(cpfs.join('\n'))
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="cpf-quantity" className="text-sm font-medium text-foreground mr-3">
            Quantidade de CPFs
          </label>
          <input
            id="cpf-quantity"
            type="number"
            min={1}
            max={100}
            value={quantity}
            onChange={(e) => handleQuantity(e.target.value)}
            className="w-24 rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={formatted}
            onChange={(e) => setFormatted(e.target.checked)}
            className="accent-primary"
          />
          <span className="text-sm text-foreground">Formatar CPF (###.###.###-##)</span>
        </label>
      </div>

      <Button onClick={handleGenerate}>Gerar CPF</Button>

      {cpfs.length > 0 && (
        <CpfList cpfs={cpfs} onCopyAll={handleCopyAll} copiedAll={copiedAll} />
      )}
    </div>
  )
}
