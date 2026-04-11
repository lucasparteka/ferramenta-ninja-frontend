"use client";

import { useRef, useState, useEffect } from "react";
import { ResumeRenderer } from "./renderer";
import { RESUME_MOCK_DATA } from "./mock-data";
import type { TemplateId } from "./config";

// A4 rendered width at 96 dpi
const A4_WIDTH = 794;

interface TemplateThumbnailProps {
  templateId: TemplateId;
  color: string;
}

export function TemplateThumbnail({ templateId, color }: TemplateThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.28); // safe initial value

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
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-white"
      style={{ aspectRatio: "210 / 297" }}
    >
      <div
        style={{
          width: A4_WIDTH,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <ResumeRenderer templateId={templateId} data={RESUME_MOCK_DATA} color={color} />
      </div>
    </div>
  );
}
