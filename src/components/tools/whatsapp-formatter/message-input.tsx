type MessageInputProps = {
  ref: React.RefObject<HTMLTextAreaElement>
  value: string
  onChange: (value: string) => void
  onSelectionChange: () => void
}

export function MessageInput({ ref, value, onChange, onSelectionChange }: MessageInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="message-input" className="text-sm font-medium text-foreground">
        Digite ou cole seu texto
      </label>
      <textarea
        id="message-input"
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={onSelectionChange}
        onMouseUp={onSelectionChange}
        onKeyUp={onSelectionChange}
        placeholder="Escreva sua mensagem aqui..."
        rows={8}
        className="w-full resize-y rounded-lg border border-border bg-input p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  )
}
