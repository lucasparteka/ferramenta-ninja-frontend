import { formatCNPJ } from './format'

function calcDigit(digits: number[], weights: number[]): number {
  const sum = digits.reduce((acc, d, i) => acc + d * weights[i], 0)
  const remainder = sum % 11
  return remainder < 2 ? 0 : 11 - remainder
}

export function generateCNPJ(formatted: boolean): string {
  const base = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10))
  const d1 = calcDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  const d2 = calcDigit([...base, d1], [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  const cnpj = [...base, d1, d2].join('')
  return formatted ? formatCNPJ(cnpj) : cnpj
}

export function generateMultipleCNPJ(count: number, formatted: boolean): string[] {
  return Array.from({ length: count }, () => generateCNPJ(formatted))
}
