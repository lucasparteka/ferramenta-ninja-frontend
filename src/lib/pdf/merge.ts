export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const { PDFDocument } = await import('pdf-lib')

  const merged = await PDFDocument.create()

  for (const file of files) {
    const buffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(buffer)
    const indices = pdf.getPageIndices()
    const pages = await merged.copyPages(pdf, indices)
    pages.forEach((page) => merged.addPage(page))
  }

  return merged.save()
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
