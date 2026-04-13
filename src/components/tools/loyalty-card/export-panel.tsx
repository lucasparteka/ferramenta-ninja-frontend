'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

type ExportPanelProps = {
  onExportFront: () => void
  onExportBack: () => void
}

export function ExportPanel({ onExportFront, onExportBack }: ExportPanelProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-1 font-semibold text-foreground">Exportar para impressão</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Gera uma folha A4 com 8 cartões prontos para imprimir. Cada arquivo contém frente ou verso
        separadamente.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={onExportFront} variant="default" size="sm">
          <Download className="size-4" />
          Exportar Frente (A4)
        </Button>
        <Button onClick={onExportBack} variant="outline" size="sm">
          <Download className="size-4" />
          Exportar Verso (A4)
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        As cores podem variar na impressão devido à diferença entre RGB e CMYK.
      </p>
    </div>
  )
}
