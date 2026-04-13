'use client'

import { useEffect, useRef } from 'react'
import { Canvas } from 'fabric'

type CanvasAreaProps = {
  onReady: (canvas: Canvas) => void
  isGridEnabled: boolean
}

export function CanvasArea({ onReady, isGridEnabled }: CanvasAreaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const elementRef = useRef<HTMLCanvasElement>(null)
  const instanceRef = useRef<Canvas | null>(null)

  useEffect(() => {
    if (!elementRef.current || !containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth || 800

    const canvas = new Canvas(elementRef.current, {
      backgroundColor: '#ffffff',
      isDrawingMode: true,
      width,
      height: 500,
    })

    instanceRef.current = canvas
    onReady(canvas)

    const observer = new ResizeObserver(() => {
      if (!containerRef.current || !instanceRef.current) return
      const newWidth = containerRef.current.clientWidth
      instanceRef.current.setDimensions({ width: newWidth })
    })

    observer.observe(container)

    return () => {
      observer.disconnect()
      instanceRef.current = null
      canvas.dispose()
    }
  }, [onReady])

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-hidden rounded-lg border border-border"
    >
      <canvas
        ref={elementRef}
        aria-label="Área de desenho — use as ferramentas à esquerda para desenhar"
      />
      {isGridEnabled && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(0,0,0,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.12) 1px, transparent 1px)',
            backgroundSize: '25px 25px',
          }}
        />
      )}
    </div>
  )
}
