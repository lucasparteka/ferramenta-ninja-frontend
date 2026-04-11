export type CompressionLevel = 'baixo' | 'medio' | 'alto'

export async function compressPDF(
  file: File,
  level: CompressionLevel
): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib')

  const buffer = await file.arrayBuffer()
  const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true })

  if (level === 'alto') {
    pdf.setTitle('')
    pdf.setAuthor('')
    pdf.setSubject('')
    pdf.setKeywords([])
    pdf.setProducer('')
    pdf.setCreator('')
  }

  const useObjectStreams = level !== 'baixo'

  return pdf.save({ useObjectStreams })
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
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
