function calcDigit(digits: number[], weights: number[]): number {
  const sum = digits.reduce((acc, d, i) => acc + d * weights[i], 0)
  const remainder = (sum * 10) % 11
  return remainder >= 10 ? 0 : remainder
}

export function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '')

  if (digits.length !== 11) return false
  if (/^(\d)\1{10}$/.test(digits)) return false

  const nums = digits.split('').map(Number)
  const d1 = calcDigit(nums.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2])
  if (d1 !== nums[9]) return false

  const d2 = calcDigit(nums.slice(0, 10), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2])
  return d2 === nums[10]
}
