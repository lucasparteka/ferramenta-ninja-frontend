export function percentOf(percent: number, value: number): number {
  return (percent / 100) * value
}

export function whatPercent(part: number, total: number): number {
  if (total === 0) return NaN
  return (part / total) * 100
}

export function percentageChange(from: number, to: number): number {
  if (from === 0) return NaN
  return ((to - from) / Math.abs(from)) * 100
}

export function increaseByPercent(value: number, percent: number): number {
  return value * (1 + percent / 100)
}

export function decreaseByPercent(value: number, percent: number): number {
  return value * (1 - percent / 100)
}
