type DeduplicateOptions = {
  keepOrder: boolean
  ignoreCase: boolean
  removeEmpty: boolean
}

type RemoveDuplicatesOptionsProps = {
  options: DeduplicateOptions
  onChange: (options: DeduplicateOptions) => void
}

type CheckboxOption = {
  key: keyof DeduplicateOptions
  label: string
}

const checkboxOptions: CheckboxOption[] = [
  { key: 'keepOrder', label: 'Manter ordem original' },
  { key: 'ignoreCase', label: 'Ignorar maiúsculas e minúsculas' },
  { key: 'removeEmpty', label: 'Remover linhas vazias' },
]

export function RemoveDuplicatesOptions({ options, onChange }: RemoveDuplicatesOptionsProps) {
  function handleToggle(key: keyof DeduplicateOptions) {
    onChange({ ...options, [key]: !options[key] })
  }

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3">
      {checkboxOptions.map((option) => (
        <label key={option.key} className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={options[option.key]}
            onChange={() => handleToggle(option.key)}
            className="accent-primary"
          />
          <span className="text-sm text-foreground">{option.label}</span>
        </label>
      ))}
    </div>
  )
}
