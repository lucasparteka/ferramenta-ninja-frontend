"use client"

import { useRef, useState, useEffect } from "react"
import { ResumeRenderer } from "./renderer"
import type { TemplateId } from "./config"
import type { ResumeTemplateData } from "./types"

export const A4_WIDTH = 794
export const A4_HEIGHT = Math.round(A4_WIDTH * (297 / 210))

type ScaledResumeProps = {
  templateId: TemplateId
  data: ResumeTemplateData
  color: string
  fontVar?: string
  fontZoom?: number
  className?: string
}

export function ScaledResume({ templateId, data, color, fontVar, fontZoom, className }: ScaledResumeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / A4_WIDTH)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className={`relative ${className ?? ""}`}>
      <div className="relative w-full bg-white" style={{ aspectRatio: "210 / 297" }}>
        <div
          ref={containerRef}
          className="absolute inset-0 overflow-x-hidden overflow-y-scroll"
          style={{ scrollbarWidth: "none" }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: A4_WIDTH,
              transformOrigin: "top left",
              transform: `scale(${scale})`,
            }}
          >
            <ResumeRenderer templateId={templateId} data={data} color={color} fontVar={fontVar} fontZoom={fontZoom} />
          </div>
        </div>
      </div>
    </div>
  )
}
