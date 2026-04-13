import { validate, version as getVersion } from 'uuid'

type UuidValidationResult =
  | { valid: true; version: number }
  | { valid: false }

export function validateUuid(input: string): UuidValidationResult {
  const trimmed = input.trim()
  if (!validate(trimmed)) return { valid: false }
  return { valid: true, version: getVersion(trimmed) }
}
