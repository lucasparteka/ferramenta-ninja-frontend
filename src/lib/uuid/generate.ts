import { v1, v3, v4, v5 } from 'uuid'

export type UuidVersion = 'v1' | 'v3' | 'v4' | 'v5'

export type UuidNamespace = 'dns' | 'url' | 'custom'

export const NAMESPACE_VALUES: Record<UuidNamespace, string> = {
  dns: v3.DNS,
  url: v3.URL,
  custom: '',
}

export function generateUuid(
  version: UuidVersion,
  options?: { name?: string; namespace?: string }
): string {
  switch (version) {
    case 'v1':
      return v1()
    case 'v3': {
      const ns = options?.namespace ?? v3.DNS
      const name = options?.name ?? ''
      return v3(name, ns)
    }
    case 'v4':
      return v4()
    case 'v5': {
      const ns = options?.namespace ?? v5.DNS
      const name = options?.name ?? ''
      return v5(name, ns)
    }
  }
}

export function generateMultipleUuids(
  count: number,
  version: UuidVersion,
  options?: { name?: string; namespace?: string }
): string[] {
  return Array.from({ length: count }, () => generateUuid(version, options))
}
