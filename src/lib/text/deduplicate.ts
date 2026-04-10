type DeduplicateOptions = {
  keepOrder: boolean
  ignoreCase: boolean
  removeEmpty: boolean
}

export function removeDuplicateLines(text: string, options: DeduplicateOptions): string {
  let lines = text.split('\n')

  if (options.removeEmpty) {
    lines = lines.filter((line) => line.trim() !== '')
  }

  const seen = new Set<string>()
  const unique = lines.filter((line) => {
    const key = options.ignoreCase ? line.toLowerCase() : line
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  if (!options.keepOrder) {
    unique.sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }

  return unique.join('\n')
}
