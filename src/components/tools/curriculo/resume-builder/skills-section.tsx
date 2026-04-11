"use client"

import { useCallback, useRef } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { ResumeFormValues } from "./types"

export function SkillsSection() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { control } = useFormContext<ResumeFormValues>()
  const { fields, append, remove } = useFieldArray({ control, name: "skills" })

  const addSkill = useCallback(
    (raw: string) => {
      const name = raw.trim().replace(/,$/, "").trim()
      if (!name) return
      if (fields.some((f) => f.name.toLowerCase() === name.toLowerCase())) return
      append({ id: crypto.randomUUID(), name })
      if (inputRef.current) inputRef.current.value = ""
    },
    [fields, append]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault()
        addSkill((e.target as HTMLInputElement).value)
      }
    },
    [addSkill]
  )

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.value.trim()) addSkill(e.target.value)
    },
    [addSkill]
  )

  return (
    <div className="space-y-3">
      {fields.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {fields.map((field, index) => (
            <span
              key={field.id}
              className="flex items-center gap-1.5 bg-primary/10 text-primary text-sm px-3 py-1.5 rounded-full"
            >
              {field.name}
              <button
                type="button"
                onClick={() => remove(index)}
                className="hover:text-destructive transition-colors"
                aria-label={`Remover ${field.name}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      <Input
        ref={inputRef}
        placeholder="Digite uma habilidade e pressione Enter ou vírgula..."
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      <p className="text-xs text-muted-foreground">
        Habilidades pessoais e profissionais. Separe por vírgula ou pressione Enter para adicionar.
      </p>
    </div>
  )
}
