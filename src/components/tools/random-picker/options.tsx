type PickerOptions = {
  winnersCount: number
  allowRepeat: boolean
  removeEmpty: boolean
}

type RandomPickerOptionsProps = {
  options: PickerOptions
  maxWinners: number
  onChange: (options: PickerOptions) => void
}

export function RandomPickerOptions({ options, maxWinners, onChange }: RandomPickerOptionsProps) {
  function set<K extends keyof PickerOptions>(key: K, value: PickerOptions[K]) {
    onChange({ ...options, [key]: value })
  }

  function handleWinnersCount(raw: string) {
    const value = Number(raw)
    if (!Number.isNaN(value) && value >= 1) {
      set('winnersCount', Math.min(maxWinners, value))
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="winners-count" className="text-sm font-medium text-foreground">
          Quantidade de vencedores
        </label>
        <input
          id="winners-count"
          type="number"
          min={1}
          max={maxWinners}
          value={options.winnersCount}
          onChange={(e) => handleWinnersCount(e.target.value)}
          className="w-24 rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={options.allowRepeat}
            onChange={() => set('allowRepeat', !options.allowRepeat)}
            className="accent-primary"
          />
          <span className="text-sm text-foreground">Permitir repetição</span>
        </label>

        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={options.removeEmpty}
            onChange={() => set('removeEmpty', !options.removeEmpty)}
            className="accent-primary"
          />
          <span className="text-sm text-foreground">Ignorar linhas vazias</span>
        </label>
      </div>
    </div>
  )
}
