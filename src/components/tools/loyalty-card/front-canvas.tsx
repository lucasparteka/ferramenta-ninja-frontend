'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Canvas, FabricImage, Rect, Textbox } from 'fabric'
import type { FrontData, Template, CanvasHandle } from './types'

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
  const containerRef = useRef<HTMLDivElement>(null)
  const scaleWrapperRef = useRef<HTMLDivElement>(null)
  const elementRef = useRef<HTMLCanvasElement>(null)
  const canvasRef = useRef<Canvas | null>(null)

  useImperativeHandle(ref, () => ({
    getDataURL() {
      if (!canvasRef.current) return ''
      return canvasRef.current.toDataURL({ format: 'png', multiplier: 3 })
    },
  }))

  useEffect(() => {
    if (!elementRef.current || !containerRef.current || !scaleWrapperRef.current) return

    const canvas = new Canvas(elementRef.current, {
      backgroundColor: frontData.backgroundColor,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      selection: false,
    })

    canvasRef.current = canvas

    const container = containerRef.current
    const scaleWrapper = scaleWrapperRef.current

    const observer = new ResizeObserver(() => {
      const scale = container.clientWidth / CANVAS_WIDTH
      scaleWrapper.style.transform = `scale(${scale})`
    })

    observer.observe(container)

    return () => {
      observer.disconnect()
      canvasRef.current = null
      canvas.dispose()
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.clear()
    canvas.backgroundColor = frontData.backgroundColor

    const accentBar = new Rect({
      left: 0,
      top: 0,
      width: CANVAS_WIDTH,
      height: 8,
      fill: frontData.primaryColor,
      selectable: false,
      evented: false,
    })
    canvas.add(accentBar)

    const sideBar = new Rect({
      left: 0,
      top: 8,
      width: 4,
      height: CANVAS_HEIGHT - 8,
      fill: frontData.primaryColor,
      selectable: false,
      evented: false,
    })
    canvas.add(sideBar)

    const textColor = getContrastColor(frontData.backgroundColor)

    const businessNameText = new Textbox(frontData.businessName || 'Nome do Negócio', {
      left: 20,
      top: 28,
      width: frontData.logoPreview ? 200 : 320,
      fontSize: 22,
      fontFamily: 'Inter, sans-serif',
      fontWeight: 'bold',
      fill: frontData.primaryColor,
      selectable: false,
      evented: false,
    })
    canvas.add(businessNameText)

    if (frontData.optionalLine1) {
      const line1Text = new Textbox(frontData.optionalLine1, {
        left: 20,
        top: 70,
        width: frontData.logoPreview ? 200 : 320,
        fontSize: 13,
        fontFamily: 'Inter, sans-serif',
        fill: textColor,
        selectable: false,
        evented: false,
      })
      canvas.add(line1Text)
    }

    if (frontData.optionalLine2) {
      const line2Text = new Textbox(frontData.optionalLine2, {
        left: 20,
        top: 92,
        width: frontData.logoPreview ? 200 : 320,
        fontSize: 11,
        fontFamily: 'Inter, sans-serif',
        fill: textColor,
        opacity: 0.7,
        selectable: false,
        evented: false,
      })
      canvas.add(line2Text)
    }

    const categoryLabel = new Textbox(template.category.toUpperCase(), {
      left: 20,
      top: CANVAS_HEIGHT - 28,
      width: 200,
      fontSize: 9,
      fontFamily: 'Inter, sans-serif',
      charSpacing: 200,
      fill: textColor,
      opacity: 0.4,
      selectable: false,
      evented: false,
    })
    canvas.add(categoryLabel)

    if (frontData.logoPreview) {
      FabricImage.fromURL(frontData.logoPreview).then((img) => {
        const maxW = 80
        const maxH = 80
        const scaleX = maxW / (img.width ?? maxW)
        const scaleY = maxH / (img.height ?? maxH)
        const scale = Math.min(scaleX, scaleY)
        img.set({
          left: CANVAS_WIDTH - maxW - 20,
          top: 28,
          scaleX: scale,
          scaleY: scale,
          selectable: false,
          evented: false,
        })
        canvas.add(img)
        canvas.renderAll()
      })
    }

    canvas.renderAll()
  }, [frontData, template])

  return (
    <div
      ref={containerRef}
      className="rounded-lg border border-border shadow-sm"
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}`,
        overflow: 'hidden',
      }}
    >
      <div
        ref={scaleWrapperRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transformOrigin: 'top left',
        }}
      >
        <canvas
          ref={elementRef}
          aria-label="Prévia da frente do cartão fidelidade"
        />
      </div>
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
