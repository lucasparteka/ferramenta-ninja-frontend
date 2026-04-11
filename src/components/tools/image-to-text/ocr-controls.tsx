'use client'

import { Button } from '@/components/ui/button'

type OcrLanguage = 'por' | 'eng' | 'spa'

type OcrControlsProps = {
  language: OcrLanguage
  disabled: boolean
  onLanguageChange: (language: OcrLanguage) => void
  onExtract: () => void
}

const LANGUAGE_OPTIONS: { value: OcrLanguage; label: string }[] = [
  { value: 'por', label: 'Português' },
  { value: 'eng', label: 'Inglês' },
  { value: 'spa', label: 'Espanhol' },
]

export function OcrControls({
  language,
  disabled,
  onLanguageChange,
  onExtract,
}: OcrControlsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label
          htmlFor="ocr-language"
          className="block text-sm font-medium text-foreground"
        >
          Idioma do texto
        </label>
        <select
          id="ocr-language"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as OcrLanguage)}
          disabled={disabled}
          className="w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <Button className="w-full" disabled={disabled} onClick={onExtract}>
        Extrair texto
      </Button>
    </div>
  )
}
