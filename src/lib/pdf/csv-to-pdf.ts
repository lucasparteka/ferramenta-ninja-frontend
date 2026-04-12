type CsvData = {
  headers: string[]
  rows: string[][]
}

type ColumnGroup = {
  startIndex: number
  endIndex: number
}

const MARGIN = 32
const PADDING_H = 6
const PADDING_V = 4
const MIN_COL_WIDTH = 38

const COLOR_HEADER_BG = { r: 0.486, g: 0.227, b: 0.929 }
const COLOR_HEADER_TEXT = { r: 1, g: 1, b: 1 }
const COLOR_EVEN_ROW = { r: 0.949, g: 0.953, b: 0.961 }
const COLOR_TEXT = { r: 0.059, g: 0.09, b: 0.161 }
const COLOR_BORDER = { r: 0.882, g: 0.91, b: 0.937 }

function chooseFontSize(columnCount: number): number {
  if (columnCount > 20) return 7
  if (columnCount > 12) return 8
  return 9
}

function chooseDimensions(columnCount: number): { pageW: number; pageH: number } {
  const useLandscape = columnCount > 5
  return useLandscape
    ? { pageW: 841.89, pageH: 595.28 }
    : { pageW: 595.28, pageH: 841.89 }
}

function safeTextWidth(
  text: string,
  font: { widthOfTextAtSize: (t: string, s: number) => number },
  size: number,
): number {
  try {
    return font.widthOfTextAtSize(text, size)
  } catch {
    return text.length * size * 0.52
  }
}

function truncateText(
  text: string,
  maxWidth: number,
  font: { widthOfTextAtSize: (t: string, s: number) => number },
  size: number,
): string {
  if (!text) return ''
  if (safeTextWidth(text, font, size) <= maxWidth) return text
  let result = text
  while (result.length > 0 && safeTextWidth(`${result}\u2026`, font, size) > maxWidth) {
    result = result.slice(0, -1)
  }
  return `${result}\u2026`
}

function getIdealColumnWidths(
  headers: string[],
  rows: string[][],
  font: { widthOfTextAtSize: (t: string, s: number) => number },
  boldFont: { widthOfTextAtSize: (t: string, s: number) => number },
  fontSize: number,
): number[] {
  const sampleSize = Math.min(rows.length, 150)
  return headers.map((header, colIndex) => {
    const headerW =
      safeTextWidth(header || `Col ${colIndex + 1}`, boldFont, fontSize) + PADDING_H * 2
    let maxCellW = 0
    for (let r = 0; r < sampleSize; r++) {
      const cellText = rows[r]?.[colIndex] ?? ''
      const w = safeTextWidth(cellText, font, fontSize) + PADDING_H * 2
      if (w > maxCellW) maxCellW = w
    }
    return Math.max(headerW, maxCellW, MIN_COL_WIDTH)
  })
}

function buildColumnGroups(idealWidths: number[], tableWidth: number): ColumnGroup[] {
  const groups: ColumnGroup[] = []
  let start = 0
  while (start < idealWidths.length) {
    let accumulated = 0
    let end = start
    while (end < idealWidths.length) {
      const w = Math.max(idealWidths[end], MIN_COL_WIDTH)
      if (accumulated + w > tableWidth && end > start) break
      accumulated += w
      end++
    }
    groups.push({ startIndex: start, endIndex: end })
    start = end
  }
  return groups
}

function scaleToTableWidth(widths: number[], tableWidth: number): number[] {
  const total = widths.reduce((s, w) => s + w, 0)
  if (total <= 0) return widths.map(() => tableWidth / widths.length)
  const scale = tableWidth / total
  return widths.map((w) => w * scale)
}

export async function generateCsvPdf(data: CsvData): Promise<Uint8Array> {
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib')

  const { headers, rows } = data
  const columnCount = headers.length

  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold)

  const fontSize = chooseFontSize(columnCount)
  const { pageW, pageH } = chooseDimensions(columnCount)
  const tableWidth = pageW - MARGIN * 2
  const rowH = Math.ceil(fontSize) + PADDING_V * 2 + 4

  const idealWidths = getIdealColumnWidths(headers, rows, font, boldFont, fontSize)
  const totalIdeal = idealWidths.reduce((s, w) => s + w, 0)

  const groups: ColumnGroup[] =
    totalIdeal <= tableWidth
      ? [{ startIndex: 0, endIndex: columnCount }]
      : buildColumnGroups(idealWidths, tableWidth)

  for (const group of groups) {
    const groupHeaders = headers.slice(group.startIndex, group.endIndex)
    const groupRows = rows.map((r) => r.slice(group.startIndex, group.endIndex))
    const groupIdealWidths = idealWidths.slice(group.startIndex, group.endIndex)
    const colWidths =
      totalIdeal <= tableWidth
        ? scaleToTableWidth(groupIdealWidths, tableWidth)
        : scaleToTableWidth(groupIdealWidths, tableWidth)

    const usableH = pageH - MARGIN * 2
    const maxRowsPerPage = Math.max(1, Math.floor((usableH - rowH) / rowH))

    let page = doc.addPage([pageW, pageH])
    let y = pageH - MARGIN

    function drawHeader(currentY: number): number {
      page.drawRectangle({
        x: MARGIN,
        y: currentY - rowH,
        width: tableWidth,
        height: rowH,
        color: rgb(COLOR_HEADER_BG.r, COLOR_HEADER_BG.g, COLOR_HEADER_BG.b),
      })
      let x = MARGIN
      for (let i = 0; i < groupHeaders.length; i++) {
        const label = groupHeaders[i] || `Col ${group.startIndex + i + 1}`
        const text = truncateText(label, colWidths[i] - PADDING_H * 2, boldFont, fontSize)
        page.drawText(text, {
          x: x + PADDING_H,
          y: currentY - rowH + PADDING_V,
          size: fontSize,
          font: boldFont,
          color: rgb(COLOR_HEADER_TEXT.r, COLOR_HEADER_TEXT.g, COLOR_HEADER_TEXT.b),
        })
        x += colWidths[i]
      }
      return currentY - rowH
    }

    function drawRow(row: string[], currentY: number, isEven: boolean): number {
      if (isEven) {
        page.drawRectangle({
          x: MARGIN,
          y: currentY - rowH,
          width: tableWidth,
          height: rowH,
          color: rgb(COLOR_EVEN_ROW.r, COLOR_EVEN_ROW.g, COLOR_EVEN_ROW.b),
        })
      }
      page.drawLine({
        start: { x: MARGIN, y: currentY - rowH },
        end: { x: MARGIN + tableWidth, y: currentY - rowH },
        thickness: 0.3,
        color: rgb(COLOR_BORDER.r, COLOR_BORDER.g, COLOR_BORDER.b),
      })
      let x = MARGIN
      for (let i = 0; i < row.length; i++) {
        const text = truncateText(row[i] ?? '', colWidths[i] - PADDING_H * 2, font, fontSize)
        page.drawText(text, {
          x: x + PADDING_H,
          y: currentY - rowH + PADDING_V,
          size: fontSize,
          font,
          color: rgb(COLOR_TEXT.r, COLOR_TEXT.g, COLOR_TEXT.b),
        })
        x += colWidths[i]
      }
      return currentY - rowH
    }

    y = drawHeader(y)

    let rowIndexInPage = 0
    for (let i = 0; i < groupRows.length; i++) {
      if (rowIndexInPage >= maxRowsPerPage) {
        page = doc.addPage([pageW, pageH])
        y = pageH - MARGIN
        y = drawHeader(y)
        rowIndexInPage = 0
      }
      y = drawRow(groupRows[i], y, i % 2 === 0)
      rowIndexInPage++
    }
  }

  return doc.save()
}
