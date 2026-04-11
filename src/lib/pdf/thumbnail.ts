import type { PDFPageProxy } from 'pdfjs-dist'

async function getPdfJs() {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`
  return pdfjsLib
}

async function renderPageToDataUrl(page: PDFPageProxy, width: number): Promise<string> {
  const dpr = window.devicePixelRatio || 1

  const viewport = page.getViewport({ scale: 1 })
  const scale = width / viewport.width
  const scaledViewport = page.getViewport({ scale })

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!

  canvas.width = Math.floor(scaledViewport.width * dpr)
  canvas.height = Math.floor(scaledViewport.height * dpr)

  canvas.style.width = `${Math.floor(scaledViewport.width)}px`
  canvas.style.height = `${Math.floor(scaledViewport.height)}px`

  await page.render({
    canvas: null,
    canvasContext: context,
    viewport: scaledViewport,
    transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined,
  }).promise

  return canvas.toDataURL('image/png')
}

export async function renderPageThumbnail(
  file: File,
  pageNumber: number,
  width: number
): Promise<string> {
  const pdfjsLib = await getPdfJs()
  const data = await file.arrayBuffer()
  const pdfDocument = await pdfjsLib.getDocument({ data }).promise

  try {
    const page = await pdfDocument.getPage(pageNumber)
    return await renderPageToDataUrl(page, width)
  } finally {
    await pdfDocument.destroy()
  }
}

export async function renderAllPageThumbnails(
  file: File,
  width: number,
  onPageReady: (index: number, dataUrl: string) => void
): Promise<number> {
  const pdfjsLib = await getPdfJs()
  const data = await file.arrayBuffer()
  const pdfDocument = await pdfjsLib.getDocument({ data }).promise
  const total = pdfDocument.numPages

  try {
    const BATCH_SIZE = 8

    for (let batch = 0; batch < total; batch += BATCH_SIZE) {
      const end = Math.min(batch + BATCH_SIZE, total)
      await Promise.all(
        Array.from({ length: end - batch }, async (_, j) => {
          const pageIndex = batch + j
          try {
            const page = await pdfDocument.getPage(pageIndex + 1)
            const dataUrl = await renderPageToDataUrl(page, width)
            onPageReady(pageIndex, dataUrl)
          } catch {
            // skip pages that fail to render
          }
        })
      )
    }
  } finally {
    await pdfDocument.destroy()
  }

  return total
}
