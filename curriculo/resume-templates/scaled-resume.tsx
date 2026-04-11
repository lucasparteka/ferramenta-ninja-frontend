"use client";

import { useRef, useState, useEffect } from "react";
import { ResumeRenderer } from "./renderer";
import type { TemplateId } from "./config";
import type { ResumeTemplateData } from "./types";

export const A4_WIDTH = 794;
export const A4_HEIGHT = Math.round(A4_WIDTH * (297 / 210)); // ≈ 1123px

const PAGE_BOTTOM_PADDING = 48;
const PAGE_TOP_LEAD = 20;

/**
 * Calculates page start offsets for multi-page resume rendering.
 * Used externally by useResumePageCount hook.
 */
export function calculatePageOffsets(inner: HTMLElement): number[] {
  const totalHeight = inner.scrollHeight;
  if (totalHeight <= A4_HEIGHT) return [0];

  const elements = [...inner.querySelectorAll<HTMLElement>("section, .pdf-item")];
  const elementBottoms = elements.map((el) => el.offsetTop + el.offsetHeight).sort((a, b) => a - b);
  const elementTops = elements.map((el) => el.offsetTop).sort((a, b) => a - b);

  const offsets: number[] = [0];
  let pageStart = 0;

  while (true) {
    const maxEnd = pageStart + A4_HEIGHT - PAGE_BOTTOM_PADDING;
    if (totalHeight - pageStart <= A4_HEIGHT) break;

    let breakBottom = maxEnd;
    for (const bottom of elementBottoms) {
      if (bottom > pageStart + 80 && bottom <= maxEnd) breakBottom = bottom;
    }

    const nextTop = elementTops.find((top) => top >= breakBottom);
    if (nextTop === undefined) break;

    const nextPageStart = Math.max(pageStart + A4_HEIGHT * 0.5, nextTop - PAGE_TOP_LEAD);
    offsets.push(nextPageStart);
    pageStart = nextPageStart;
    if (offsets.length > 20) break;
  }

  return offsets;
}

interface ScaledResumeProps {
  templateId: TemplateId;
  data: ResumeTemplateData;
  color: string;
  fontVar?: string;
  fontZoom?: number;
  className?: string;
}

export function ScaledResume({ templateId, data, color, fontVar, fontZoom, className }: ScaledResumeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / A4_WIDTH);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={`relative ${className ?? ""}`}>
      {/* Sizing container: defines aspect-ratio, never affected by scrollbar */}
      <div className="relative w-full bg-white" style={{ aspectRatio: "210 / 297" }}>
        {/* Scroll container: fills parent via absolute, overflow isolated from aspect-ratio calc */}
        <div
          ref={containerRef}
          className="absolute inset-0 overflow-x-hidden overflow-y-scroll scrollbar-hide"
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
  );
}
