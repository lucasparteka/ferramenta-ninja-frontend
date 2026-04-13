'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Canvas, Circle, Rect, Textbox } from 'fabric'
import type { BackData, CanvasHandle, Template } from './types'

const CANVAS_WIDTH = 360
const CANVAS_HEIGHT = 200

type BackCanvasProps = {
  backData: BackData
  template: Template
}

type StampGrid = {
  cols: number
  rows: number
}

function computeGrid(count: number): StampGrid {
  if (count === 5) return { cols: 5, rows: 1 }
  if (count === 6) return { cols: 3, rows: 2 }
  if (count === 8) return { cols: 4, rows: 2 }
  return { cols: 5, rows: 2 }
}

export const BackCanvas = forwardRef<CanvasHandle, BackCanvasProps>(function BackCanvas(
  { backData, template },
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
      backgroundColor: backData.backgroundColor,
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
    canvas.backgroundColor = backData.backgroundColor

    const accentBar = new Rect({
      left: 0,
      top: 0,
      width: CANVAS_WIDTH,
      height: 8,
      fill: backData.primaryColor,
      selectable: false,
      evented: false,
    })
    canvas.add(accentBar)

    const bottomBar = new Rect({
      left: 0,
      top: CANVAS_HEIGHT - 8,
      width: CANVAS_WIDTH,
      height: 8,
      fill: backData.primaryColor,
      selectable: false,
      evented: false,
    })
    canvas.add(bottomBar)

    const textColor = getContrastColor(backData.backgroundColor)

    const titleText = new Textbox('CARTÃO FIDELIDADE', {
      left: 0,
      top: 18,
      width: CANVAS_WIDTH,
      fontSize: 11,
      fontFamily: 'Inter, sans-serif',
      fontWeight: 'bold',
      fill: backData.primaryColor,
      textAlign: 'center',
      charSpacing: 300,
      selectable: false,
      evented: false,
    })
    canvas.add(titleText)

    const { cols, rows } = computeGrid(backData.stampCount)
    const stampSize = 28
    const stampGapX = 14
    const stampGapY = 14

    const totalWidth = cols * stampSize + (cols - 1) * stampGapX
    const totalHeight = rows * stampSize + (rows - 1) * stampGapY

    const startX = (CANVAS_WIDTH - totalWidth) / 2
    const startY = 40 + (CANVAS_HEIGHT - 40 - 30 - totalHeight) / 2

    let rendered = 0
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (rendered >= backData.stampCount) break

        const x = startX + col * (stampSize + stampGapX)
        const y = startY + row * (stampSize + stampGapY)

        if (backData.stampStyle === 'circle') {
          const stamp = new Circle({
            left: x,
            top: y,
            radius: stampSize / 2,
            fill: 'transparent',
            stroke: backData.primaryColor,
            strokeWidth: 2,
            selectable: false,
            evented: false,
          })
          canvas.add(stamp)
        } else {
          const stamp = new Rect({
            left: x,
            top: y,
            width: stampSize,
            height: stampSize,
            fill: 'transparent',
            stroke: backData.primaryColor,
            strokeWidth: 2,
            rx: 4,
            ry: 4,
            selectable: false,
            evented: false,
          })
          canvas.add(stamp)
        }

        rendered++
      }
    }

    const countLabel = new Textbox(`${backData.stampCount} carimbos`, {
      left: 0,
      top: CANVAS_HEIGHT - 28,
      width: CANVAS_WIDTH,
      fontSize: 9,
      fontFamily: 'Inter, sans-serif',
      fill: textColor,
      textAlign: 'center',
      opacity: 0.4,
      selectable: false,
      evented: false,
    })
    canvas.add(countLabel)

    canvas.renderAll()
  }, [backData, template])

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
          aria-label="Prévia do verso do cartão fidelidade com área de carimbos"
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
