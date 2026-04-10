type RemoveDuplicatesInputProps = {
  value: string
  onChange: (value: string) => void
}

export function RemoveDuplicatesInput({ value, onChange }: RemoveDuplicatesInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="duplicates-input" className="text-sm font-medium text-foreground">
        Digite ou cole sua lista
      </label>
      <textarea
        id="duplicates-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cole sua lista aqui, um item por linha..."
        rows={10}
        className="w-full resize-y rounded-lg border border-border bg-input p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  )
}
