export async function extractTextFromImage(
  file: File,
  language: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const { createWorker } = await import('tesseract.js')

  const worker = await createWorker(language, 1, {
    logger: (message) => {
      if (message.status === 'recognizing text' && onProgress) {
        onProgress(Math.round(message.progress * 100))
      }
    },
  })

  try {
    const {
      data: { text },
    } = await worker.recognize(file)
    const trimmed = text.trim()
    if (!trimmed) throw new Error('Nenhum texto encontrado na imagem.')
    return trimmed
  } finally {
    await worker.terminate()
  }
}

export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text)
}
