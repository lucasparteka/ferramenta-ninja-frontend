type ApplyFormattingResult = {
  newText: string
  newSelectionStart: number
  newSelectionEnd: number
}

export function removeFormatting(text: string): string {
  return text
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/~([^~]+)~/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
}

export function applyFormatting(
  text: string,
  selectionStart: number,
  selectionEnd: number,
  wrapper: string
): ApplyFormattingResult {
  const hasSelection = selectionStart !== selectionEnd

  if (hasSelection) {
    const before = text.slice(0, selectionStart)
    const selected = text.slice(selectionStart, selectionEnd)
    const after = text.slice(selectionEnd)
    const newText = `${before}${wrapper}${selected}${wrapper}${after}`
    return {
      newText,
      newSelectionStart: selectionStart + wrapper.length,
      newSelectionEnd: selectionEnd + wrapper.length,
    }
  }

  if (!text) {
    return { newText: text, newSelectionStart: 0, newSelectionEnd: 0 }
  }

  const newText = `${wrapper}${text}${wrapper}`
  return {
    newText,
    newSelectionStart: wrapper.length,
    newSelectionEnd: text.length + wrapper.length,
  }
}
