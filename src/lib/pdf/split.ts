function parsePageRanges(input: string, totalPages: number): number[] {
  const pages = new Set<number>()

  for (const part of input.split(',')) {
    const trimmed = part.trim()
    if (!trimmed) continue

    if (trimmed.includes('-')) {
      const [rawStart, rawEnd] = trimmed.split('-')
      const start = parseInt(rawStart.trim(), 10)
      const end = parseInt(rawEnd.trim(), 10)
      if (!Number.isNaN(start) && !Number.isNaN(end)) {
        for (let i = start; i <= end; i++) {
          if (i >= 1 && i <= totalPages) pages.add(i - 1)
        }
      }
    } else {
      const n = parseInt(trimmed, 10)
      if (!Number.isNaN(n) && n >= 1 && n <= totalPages) pages.add(n - 1)
    }
  }

  return Array.from(pages).sort((a, b) => a - b)
}

export async function extractPages(file: File, ranges: string): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib')

  const buffer = await file.arrayBuffer()
  const source = await PDFDocument.load(buffer)
  const totalPages = source.getPageCount()

  const indices = parsePageRanges(ranges, totalPages)
  if (indices.length === 0) {
    throw new Error('Nenhuma página válida encontrada. Verifique o intervalo informado.')
  }

  const result = await PDFDocument.create()
  const pages = await result.copyPages(source, indices)
  pages.forEach((page) => result.addPage(page))

  return result.save()
}

export async function splitAllPages(file: File): Promise<Uint8Array[]> {
  const { PDFDocument } = await import('pdf-lib')

  const buffer = await file.arrayBuffer()
  const source = await PDFDocument.load(buffer)
  const total = source.getPageCount()

  const results: Uint8Array[] = []

  for (let i = 0; i < total; i++) {
    const doc = await PDFDocument.create()
    const [page] = await doc.copyPages(source, [i])
    doc.addPage(page)
    results.push(await doc.save())
  }

  return results
}

export async function extractPagesByIndex(
  file: File,
  pageIndices: number[]
): Promise<Uint8Array> {
  if (pageIndices.length === 0) {
    throw new Error('Nenhuma página selecionada.')
  }

  const { PDFDocument } = await import('pdf-lib')

  const buffer = await file.arrayBuffer()
  const source = await PDFDocument.load(buffer)
  const totalPages = source.getPageCount()

  const validIndices = [...new Set(pageIndices)]
    .filter((i) => i >= 0 && i < totalPages)
    .sort((a, b) => a - b)

  if (validIndices.length === 0) {
    throw new Error('Nenhuma página válida selecionada.')
  }

  const result = await PDFDocument.create()
  const pages = await result.copyPages(source, validIndices)
  pages.forEach((page) => result.addPage(page))

  return result.save()
}

export function downloadPDF(bytes: Uint8Array, filename: string): void {
  const blob = new Blob([bytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
