'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

type CnpjListProps = {
  cnpjs: string[]
  onCopyAll: () => void
  copiedAll: boolean
}

export function CnpjList({ cnpjs, onCopyAll, copiedAll }: CnpjListProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  function handleCopyItem(cnpj: string, index: number) {
    navigator.clipboard.writeText(cnpj)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const label = cnpjs.length === 1 ? '1 CNPJ gerado' : `${cnpjs.length} CNPJs gerados`

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <Button variant="outline" size="sm" onClick={onCopyAll}>
          {copiedAll ? 'Copiado!' : 'Copiar tudo'}
        </Button>
      </div>
      <ul className="space-y-2">
        {cnpjs.map((cnpj, index) => (
          <li
            key={index}
            className="flex items-center justify-between rounded-lg border border-border bg-secondary px-4 py-2"
          >
            <span className="font-mono text-foreground">{cnpj}</span>
            <Button variant="ghost" size="sm" onClick={() => handleCopyItem(cnpj, index)}>
              {copiedIndex === index ? 'Copiado!' : 'Copiar'}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
