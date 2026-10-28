import type { PaddleOcrService } from 'ppu-paddle-ocr/web'

let servicePromise: Promise<PaddleOcrService> | null = null

function getService(): Promise<PaddleOcrService> {
  if (!servicePromise) {
    servicePromise = import('ppu-paddle-ocr/web').then(
      async ({ PaddleOcrService, V6_SMALL_MODEL }) => {
        const service = new PaddleOcrService({ model: V6_SMALL_MODEL })
        await service.initialize()
        return service
      },
    )
  }

  return servicePromise
}

export type ExtractText = (file: File) => Promise<string>

export async function recognizeImage(file: File): Promise<string> {
  const [service, image] = await Promise.all([getService(), file.arrayBuffer()])
  const result = await service.recognize(image)

  return result.text
}
