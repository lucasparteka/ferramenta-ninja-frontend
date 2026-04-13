type CardBrandKey = 'visa' | 'mastercard' | 'amex' | 'elo' | 'hipercard'

type CardBrandDefinition = {
  label: string
  prefixes: string[]
  length: number
  cvvLength: number
}

export const CARD_BRANDS: Record<CardBrandKey, CardBrandDefinition> = {
  visa: {
    label: 'Visa',
    prefixes: ['4'],
    length: 16,
    cvvLength: 3,
  },
  mastercard: {
    label: 'Mastercard',
    prefixes: ['51', '52', '53', '54', '55', '2221', '2500', '2720'],
    length: 16,
    cvvLength: 3,
  },
  amex: {
    label: 'American Express',
    prefixes: ['34', '37'],
    length: 15,
    cvvLength: 4,
  },
  elo: {
    label: 'Elo',
    prefixes: ['4011', '4312', '4389', '6362', '6363', '6516', '6550'],
    length: 16,
    cvvLength: 3,
  },
  hipercard: {
    label: 'Hipercard',
    prefixes: ['6062', '3841'],
    length: 16,
    cvvLength: 3,
  },
}

export type GeneratedCard = {
  number: string
  expiry: string
  cvv: string
  brand: CardBrandKey
  brandLabel: string
}

function generateLuhnNumber(prefix: string, length: number): string {
  const digits: number[] = prefix.split('').map(Number)

  while (digits.length < length - 1) {
    digits.push(Math.floor(Math.random() * 10))
  }

  let sum = 0
  let shouldDouble = true

  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits[i]
    if (shouldDouble) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    shouldDouble = !shouldDouble
  }

  const checkDigit = (10 - (sum % 10)) % 10
  digits.push(checkDigit)

  return digits.join('')
}

function generateExpiryDate(): string {
  const now = new Date()
  const yearsAhead = 1 + Math.floor(Math.random() * 4)
  const month = 1 + Math.floor(Math.random() * 12)
  const year = now.getFullYear() + yearsAhead

  const mm = String(month).padStart(2, '0')
  const yy = String(year).slice(-2)

  return `${mm}/${yy}`
}

function generateCVV(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('')
}

export function generateCreditCard(brandKey: CardBrandKey): GeneratedCard {
  const brand = CARD_BRANDS[brandKey]
  const prefix = brand.prefixes[Math.floor(Math.random() * brand.prefixes.length)]
  const number = generateLuhnNumber(prefix, brand.length)

  return {
    number,
    expiry: generateExpiryDate(),
    cvv: generateCVV(brand.cvvLength),
    brand: brandKey,
    brandLabel: brand.label,
  }
}

export function formatCardNumber(number: string, brandKey: CardBrandKey): string {
  if (brandKey === 'amex') {
    return `${number.slice(0, 4)} ${number.slice(4, 10)} ${number.slice(10)}`
  }
  return number.replace(/(.{4})/g, '$1 ').trim()
}
