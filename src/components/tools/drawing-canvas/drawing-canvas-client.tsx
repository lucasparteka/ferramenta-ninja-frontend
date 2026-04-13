'use client'

import dynamic from 'next/dynamic'

const DrawingCanvas = dynamic(
  () =>
    import('@/components/tools/drawing-canvas/drawing-canvas').then((m) => ({
      default: m.DrawingCanvas,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] items-center justify-center rounded-lg border border-border bg-card">
        <p className="text-muted-foreground">Carregando ferramenta de desenho...</p>
      </div>
    ),
  }
)

export function DrawingCanvasClient() {
  return <DrawingCanvas />
}
