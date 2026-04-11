import { PDFDocument, PDFRawStream, PDFName } from 'pdf-lib'
import sharp from 'sharp'

export const maxDuration = 60

export async function POST(request: Request): Promise<Response> {
  try {
    const form = await request.formData()
    const file = form.get('file')

    if (!(file instanceof File)) {
      return Response.json({ error: 'Arquivo inválido.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true })

    pdfDoc.setTitle('')
    pdfDoc.setAuthor('')
    pdfDoc.setSubject('')
    pdfDoc.setKeywords([])
    pdfDoc.setProducer('')
    pdfDoc.setCreator('')

    for (const [ref, obj] of pdfDoc.context.enumerateIndirectObjects()) {
      if (!(obj instanceof PDFRawStream)) continue

      const dict = obj.dict
      const subtype = dict.get(PDFName.of('Subtype'))
      if (!subtype || subtype.toString() !== '/Image') continue

      const filter = dict.get(PDFName.of('Filter'))
      if (!filter || filter.toString() !== '/DCTDecode') continue

      try {
        const recompressed = await sharp(Buffer.from(obj.contents))
          .jpeg({ quality: 65 })
          .toBuffer()

        const width = dict.get(PDFName.of('Width'))
        const height = dict.get(PDFName.of('Height'))
        const colorSpace = dict.get(PDFName.of('ColorSpace'))
        const bitsPerComponent = dict.get(PDFName.of('BitsPerComponent'))

        const streamDict = pdfDoc.context.obj({
          Type: 'XObject',
          Subtype: 'Image',
          Filter: 'DCTDecode',
          ...(width && { Width: width }),
          ...(height && { Height: height }),
          ...(colorSpace && { ColorSpace: colorSpace }),
          ...(bitsPerComponent && { BitsPerComponent: bitsPerComponent }),
        })

        const newStream = PDFRawStream.of(streamDict, recompressed)
        pdfDoc.context.assign(ref, newStream)
      } catch {
        // skip images that fail recompression
      }
    }

    const bytes = await pdfDoc.save({ useObjectStreams: true })

    return new Response(Buffer.from(bytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="comprimido.pdf"',
      },
    })
  } catch {
    return Response.json({ error: 'Erro ao comprimir o PDF.' }, { status: 500 })
  }
}
