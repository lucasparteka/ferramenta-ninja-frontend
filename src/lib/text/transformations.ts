export function toUppercase(text: string): string {
  return text.toUpperCase()
}

export function toLowercase(text: string): string {
  return text.toLowerCase()
}

export function capitalize(text: string): string {
  return text
    .split(' ')
    .map((word) => (word.length > 0 ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word))
    .join(' ')
}

export function removeExtraSpaces(text: string): string {
  return text.trim().replace(/\s+/g, ' ')
}

export function removeAccents(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function reverseText(text: string): string {
  return text.split('').reverse().join('')
}
