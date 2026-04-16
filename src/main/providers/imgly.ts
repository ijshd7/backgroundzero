import type { BackgroundRemovalProvider, ProviderResult } from './types'

type ImglyModule = typeof import('@imgly/background-removal-node')
let imglyModulePromise: Promise<ImglyModule> | null = null

function loadImgly(): Promise<ImglyModule> {
  if (!imglyModulePromise) {
    imglyModulePromise = import('@imgly/background-removal-node')
  }
  return imglyModulePromise
}

function detectMimeType(buffer: Buffer): string | null {
  if (buffer.length >= 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return 'image/png'
  }
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg'
  }
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) {
    return 'image/webp'
  }
  return null
}

async function remove(imageBase64: string): Promise<ProviderResult> {
  try {
    const { removeBackground } = await loadImgly()
    const buffer = Buffer.from(imageBase64, 'base64')
    const mimeType = detectMimeType(buffer)
    if (!mimeType) {
      return { success: false, error: 'Unrecognized image format. Please use PNG, JPG, or WebP.' }
    }
    const input = new Blob([new Uint8Array(buffer)], { type: mimeType })
    const blob = await removeBackground(input)
    const arrayBuffer = await blob.arrayBuffer()
    return {
      success: true,
      data: Buffer.from(arrayBuffer).toString('base64'),
      creditsRemaining: null
    }
  } catch (err) {
    return {
      success: false,
      error: `Local model error: ${err instanceof Error ? err.message : 'Unknown error'}`
    }
  }
}

export const imglyProvider: BackgroundRemovalProvider = {
  id: 'imgly',
  label: 'imgly (local, free)',
  requiresApiKey: false,
  remove
}
