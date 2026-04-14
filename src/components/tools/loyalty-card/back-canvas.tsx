'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { BackData, CanvasHandle, Template } from './types'

const CANVAS_WIDTH = 360
const CANVAS_HEIGHT = 200

type BackCanvasProps = {
  backData: BackData
  template: Template
}

type StampGrid = { cols: number; rows: number }

function computeGrid(count: number): StampGrid {
  if (count === 5) return { cols: 5, rows: 1 }
  if (count === 6) return { cols: 3, rows: 2 }
  if (count === 8) return { cols: 4, rows: 2 }
  return { cols: 5, rows: 2 }
}

export const BackCanvas = forwardRef<CanvasHandle, BackCanvasProps>(function BackCanvas(
  { backData },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useImperativeHandle(ref, () => ({
    getDataURL() {
      return canvasRef.current?.toDataURL('image/png') ?? ''
    },
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    ctx.fillStyle = backData.backgroundColor
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    ctx.fillStyle = backData.primaryColor
    ctx.fillRect(0, 0, CANVAS_WIDTH, 8)
    ctx.fillRect(0, CANVAS_HEIGHT - 8, CANVAS_WIDTH, 8)

    ctx.fillStyle = backData.primaryColor
    ctx.font = 'bold 11px Inter, sans-serif'
    ctx.letterSpacing = '3px'
    ctx.textAlign = 'center'
    ctx.fillText('CARTÃO FIDELIDADE', CANVAS_WIDTH / 2, 32)
    ctx.letterSpacing = '0px'
    ctx.textAlign = 'left'

    const { cols, rows } = computeGrid(backData.stampCount)
    const stampSize = 28
    const stampGapX = 14
    const stampGapY = 14
    const totalWidth = cols * stampSize + (cols - 1) * stampGapX
    const totalHeight = rows * stampSize + (rows - 1) * stampGapY
    const startX = (CANVAS_WIDTH - totalWidth) / 2
    const startY = 40 + (CANVAS_HEIGHT - 40 - 30 - totalHeight) / 2

    ctx.strokeStyle = backData.primaryColor
    ctx.lineWidth = 2

    let rendered = 0
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (rendered >= backData.stampCount) break
        const x = startX + col * (stampSize + stampGapX)
        const y = startY + row * (stampSize + stampGapY)

        ctx.beginPath()
        if (backData.stampStyle === 'circle') {
          ctx.arc(x + stampSize / 2, y + stampSize / 2, stampSize / 2, 0, Math.PI * 2)
        } else {
          const r = 4
          ctx.moveTo(x + r, y)
          ctx.lineTo(x + stampSize - r, y)
          ctx.arcTo(x + stampSize, y, x + stampSize, y + r, r)
          ctx.lineTo(x + stampSize, y + stampSize - r)
          ctx.arcTo(x + stampSize, y + stampSize, x + stampSize - r, y + stampSize, r)
          ctx.lineTo(x + r, y + stampSize)
          ctx.arcTo(x, y + stampSize, x, y + stampSize - r, r)
          ctx.lineTo(x, y + r)
          ctx.arcTo(x, y, x + r, y, r)
        }
        ctx.stroke()
        rendered++
      }
    }

    const textColor = getContrastColor(backData.backgroundColor)
    ctx.fillStyle = textColor
    ctx.globalAlpha = 0.4
    ctx.font = '9px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${backData.stampCount} carimbos`, CANVAS_WIDTH / 2, CANVAS_HEIGHT - 14)
    ctx.globalAlpha = 1
    ctx.textAlign = 'left'
  }, [backData])

  return (
    <div className="rounded-lg border border-border shadow-sm" style={{ display: 'inline-block' }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        aria-label="Prévia do verso do cartão fidelidade com área de carimbos"
        style={{ display: 'block' }}
      />
    </div>
  )
})

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#1c1917' : '#ffffff'
}
