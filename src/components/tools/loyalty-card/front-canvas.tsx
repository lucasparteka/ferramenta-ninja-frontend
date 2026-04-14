'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import type { CanvasHandle, FrontData, Template } from './types'

const CANVAS_WIDTH = 360
const CANVAS_HEIGHT = 200

type FrontCanvasProps = {
  frontData: FrontData
  template: Template
}

export const FrontCanvas = forwardRef<CanvasHandle, FrontCanvasProps>(function FrontCanvas(
  { frontData, template },
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

    ctx.fillStyle = frontData.backgroundColor
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    ctx.fillStyle = frontData.primaryColor
    ctx.fillRect(0, 0, CANVAS_WIDTH, 8)
    ctx.fillRect(0, 8, 4, CANVAS_HEIGHT - 8)

    const textColor = getContrastColor(frontData.backgroundColor)

    ctx.fillStyle = frontData.primaryColor
    ctx.font = 'bold 22px Inter, sans-serif'
    ctx.fillText(frontData.businessName || 'Nome do Negócio', 20, 52)

    if (frontData.optionalLine1) {
      ctx.fillStyle = textColor
      ctx.font = '13px Inter, sans-serif'
      ctx.fillText(frontData.optionalLine1, 20, 84)
    }

    if (frontData.optionalLine2) {
      ctx.fillStyle = textColor
      ctx.globalAlpha = 0.7
      ctx.font = '11px Inter, sans-serif'
      ctx.fillText(frontData.optionalLine2, 20, 104)
      ctx.globalAlpha = 1
    }

    ctx.fillStyle = textColor
    ctx.globalAlpha = 0.4
    ctx.font = '9px Inter, sans-serif'
    ctx.letterSpacing = '2px'
    ctx.fillText(template.category.toUpperCase(), 20, CANVAS_HEIGHT - 14)
    ctx.letterSpacing = '0px'
    ctx.globalAlpha = 1

    if (frontData.logoPreview) {
      const img = new Image()
      img.onload = () => {
        const maxW = 80
        const maxH = 80
        const scale = Math.min(maxW / img.width, maxH / img.height)
        ctx.drawImage(img, CANVAS_WIDTH - maxW - 20, 28, img.width * scale, img.height * scale)
      }
      img.src = frontData.logoPreview
    }
  }, [frontData, template])

  return (
    <div className="rounded-lg border border-border shadow-sm" style={{ display: 'inline-block' }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        aria-label="Prévia da frente do cartão fidelidade"
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
