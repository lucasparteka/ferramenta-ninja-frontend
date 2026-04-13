'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

type DiffOptions = {
  ignoreCase: boolean
  ignoreWhitespace: boolean
  showOnlyDifferences: boolean
  wordLevelDiff: boolean
}

type DiffOptionsProps = {
  options: DiffOptions
  onChange: (options: DiffOptions) => void
}

type OptionItem = {
  key: keyof DiffOptions
  label: string
}

const optionItems: OptionItem[] = [
  { key: 'ignoreCase', label: 'Ignorar maiúsculas/minúsculas' },
  { key: 'ignoreWhitespace', label: 'Ignorar espaços em branco' },
  { key: 'showOnlyDifferences', label: 'Exibir apenas diferenças' },
  { key: 'wordLevelDiff', label: 'Diff por palavras' },
]

export function DiffOptions({ options, onChange }: DiffOptionsProps) {
  function handleChange(key: keyof DiffOptions, checked: boolean) {
    onChange({ ...options, [key]: checked })
  }

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3">
      {optionItems.map(({ key, label }) => (
        <div key={key} className="flex items-center gap-2">
          <Checkbox
            id={key}
            checked={options[key]}
            onCheckedChange={(checked) => handleChange(key, checked === true)}
          />
          <Label htmlFor={key} className="cursor-pointer text-sm font-normal">
            {label}
          </Label>
        </div>
      ))}
    </div>
  )
}
