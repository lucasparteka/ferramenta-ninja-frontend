const MORSE_TABLE: Record<string, string> = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  "'": '.----.',
  '!': '-.-.--',
  '/': '-..-.',
  '(': '-.--.',
  ')': '-.--.-',
  '&': '.-...',
  ':': '---...',
  ';': '-.-.-.',
  '=': '-...-',
  '+': '.-.-.',
  '-': '-....-',
  '_': '..--.-',
  '"': '.-..-.',
  '@': '.--.-.',
}

const REVERSE_MORSE: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_TABLE).map(([char, code]) => [code, char]),
)

export function textToMorse(text: string): string {
  const upper = text.toUpperCase()
  const words = upper.split(' ')

  return words
    .filter((word) => word.length > 0)
    .map((word) =>
      word
        .split('')
        .map((char) => {
          const code = MORSE_TABLE[char]
          if (code === undefined) {
            throw new Error(`O caractere "${char}" não possui representação em código Morse.`)
          }
          return code
        })
        .join(' '),
    )
    .join(' / ')
}

export function morseToText(morse: string): string {
  const words = morse.trim().split(/\s*\/\s*/)

  return words
    .map((word) => {
      const codes = word.trim().split(/\s+/).filter((c) => c.length > 0)
      return codes
        .map((code) => {
          const char = REVERSE_MORSE[code]
          if (char === undefined) {
            throw new Error(`"${code}" não é um código Morse reconhecido.`)
          }
          return char
        })
        .join('')
    })
    .join(' ')
}
