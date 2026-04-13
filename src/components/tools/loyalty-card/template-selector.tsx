'use client'

import type { Template } from './types'

type TemplateSelectorProps = {
  templates: Template[]
  selectedId: string
  onSelect: (id: string) => void
}

export function TemplateSelector({ templates, selectedId, onSelect }: TemplateSelectorProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {templates.map((template) => {
        const isSelected = template.id === selectedId
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            aria-pressed={isSelected}
            className={`flex min-w-30 flex-col gap-2 rounded-lg border-2 p-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              isSelected
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/40 hover:bg-muted'
            }`}
          >
            <div
              className="h-10 w-full rounded"
              style={{ backgroundColor: template.defaultFront.backgroundColor }}
            >
              <div
                className="h-2 w-full rounded-t"
                style={{ backgroundColor: template.defaultFront.primaryColor }}
              />
            </div>
            <span className="text-center text-xs font-medium text-foreground">
              {template.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}
