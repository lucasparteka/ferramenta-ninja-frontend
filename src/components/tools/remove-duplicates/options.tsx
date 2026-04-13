type DeduplicateOptions = {
  ignoreCase: boolean
  trimWhitespace: boolean
  sortOrder: 'none' | 'asc' | 'desc'
}

type RemoveDuplicatesOptionsProps = {
  options: DeduplicateOptions
  onChange: (options: DeduplicateOptions) => void
}

export function RemoveDuplicatesOptions({ options, onChange }: RemoveDuplicatesOptionsProps) {
  function handleToggle(key: 'ignoreCase' | 'trimWhitespace') {
    onChange({ ...options, [key]: !options[key] })
  }

  function handleSortOrder(order: 'asc' | 'desc') {
    onChange({ ...options, sortOrder: options.sortOrder === order ? 'none' : order })
  }

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3">
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={options.ignoreCase}
          onChange={() => handleToggle('ignoreCase')}
          className="accent-primary"
        />
        <span className="text-sm text-foreground">Ignorar maiúsculas e minúsculas</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={options.trimWhitespace}
          onChange={() => handleToggle('trimWhitespace')}
          className="accent-primary"
        />
        <span className="text-sm text-foreground">Remover espaços</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={options.sortOrder === 'asc'}
          onChange={() => handleSortOrder('asc')}
          className="accent-primary"
        />
        <span className="text-sm text-foreground">Ordenar resultados de A-Z</span>
      </label>
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={options.sortOrder === 'desc'}
          onChange={() => handleSortOrder('desc')}
          className="accent-primary"
        />
        <span className="text-sm text-foreground">Ordenar resultados de Z-A</span>
      </label>
    </div>
  )
}
