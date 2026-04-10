'use client'

import { useEffect, useRef, useState } from 'react'
import type { CopyCategory } from '@/lib/data/emojis'

type CopyGridProps = {
  categories: CopyCategory[]
  itemClass: string
}

const BATCH = 3

export function CopyGrid({ categories, itemClass }: CopyGridProps) {
  const [visibleCount, setVisibleCount] = useState(BATCH)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const hasMore = visibleCount < categories.length

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((n) => Math.min(n + BATCH, categories.length))
        }
      },
      { rootMargin: '500px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, categories.length])

  function handleCopy(item: string, key: string) {
    navigator.clipboard.writeText(item)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 800)
  }

  return (
    <div className="space-y-6">
      {categories.slice(0, visibleCount).map((cat) => (
        <div key={cat.name}>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {cat.name}
          </p>
          <div className="flex flex-wrap border-l border-t border-border">
            {cat.items.map((item, i) => {
              const key = `${cat.name}-${i}`
              const isCopied = copiedKey === key

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleCopy(item, key)}
                  title={`Copiar: ${item}`}
                  className={`relative flex items-center justify-center border-b border-r border-border transition-all duration-150 ${itemClass} ${
                    isCopied
                      ? 'z-20 scale-125 bg-primary text-primary-foreground shadow-lg'
                      : 'hover:z-10 hover:scale-110 hover:bg-muted'
                  }`}
                >
                  {item}
                  {isCopied && (
                    <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-primary px-1.5 py-0.5 text-xs font-semibold text-primary-foreground shadow">
                      Copiado!
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      {hasMore && <div ref={sentinelRef} className="h-2" />}
    </div>
  )
}
