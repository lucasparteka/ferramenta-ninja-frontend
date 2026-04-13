export type CardBrandName =
  | 'Visa'
  | 'Mastercard'
  | 'American Express'
  | 'Elo'
  | 'Hipercard'
  | 'Desconhecida'

export type ValidationResult = {
  valid: boolean
  brand: CardBrandName
  formatted: string
}

export function luhnCheck(number: string): boolean {
  const digits = number.replace(/\D/g, '')
  if (digits.length < 13) return false

  let sum = 0
  let shouldDouble = false

  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10)
    if (shouldDouble) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    shouldDouble = !shouldDouble
  }

  return sum % 10 === 0
}

export function detectBrand(number: string): CardBrandName {
  const digits = number.replace(/\D/g, '')

  if (/^4011|^4312|^4389|^6362|^6363|^6516|^6550/.test(digits)) return 'Elo'
  if (/^3841|^6062/.test(digits)) return 'Hipercard'
  if (/^4/.test(digits)) return 'Visa'

  const mcPrefix = parseInt(digits.slice(0, 4), 10)
  if (
    /^5[1-5]/.test(digits) ||
    (mcPrefix >= 2221 && mcPrefix <= 2720)
  ) {
    return 'Mastercard'
  }

  if (/^3[47]/.test(digits)) return 'American Express'

  return 'Desconhecida'
}

function formatDetected(number: string, brand: CardBrandName): string {
  const digits = number.replace(/\D/g, '')

  if (brand === 'American Express') {
    return `${digits.slice(0, 4)} ${digits.slice(4, 10)} ${digits.slice(10)}`.trim()
  }

  return digits.replace(/(.{4})/g, '$1 ').trim()
}

export function validateCreditCard(input: string): ValidationResult {
  const digits = input.replace(/\D/g, '')
  const brand = detectBrand(digits)
  const valid = luhnCheck(digits)

  return {
    valid,
    brand,
    formatted: formatDetected(digits, brand),
  }
}
