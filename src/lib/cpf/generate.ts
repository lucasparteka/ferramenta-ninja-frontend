import { formatCPF } from './format'

function calcDigit(digits: number[], weights: number[]): number {
  const sum = digits.reduce((acc, d, i) => acc + d * weights[i], 0)
  const remainder = (sum * 10) % 11
  return remainder >= 10 ? 0 : remainder
}

export function generateCPF(formatted: boolean): string {
  const base = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10))
  const d1 = calcDigit(base, [10, 9, 8, 7, 6, 5, 4, 3, 2])
  const d2 = calcDigit([...base, d1], [11, 10, 9, 8, 7, 6, 5, 4, 3, 2])
  const cpf = [...base, d1, d2].join('')
  return formatted ? formatCPF(cpf) : cpf
}

export function generateMultipleCPF(count: number, formatted: boolean): string[] {
  return Array.from({ length: count }, () => generateCPF(formatted))
}
