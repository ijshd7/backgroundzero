import { net } from 'electron'

export type RemoveBgResult =
  | { success: true; data: string; creditsRemaining: string | null }
  | { success: false; error: string }

export async function removeBackground(imageBase64: string, apiKey: string): Promise<RemoveBgResult> {
  const imageBuffer = Buffer.from(imageBase64, 'base64')

  const boundary = '----BackgroundZeroBoundary' + Date.now()
  const bodyParts: Buffer[] = []

  const addField = (name: string, value: string) => {
    bodyParts.push(Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`
    ))
  }

  const addFile = (name: string, filename: string, contentType: string, data: Buffer) => {
    bodyParts.push(Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="${name}"; filename="${filename}"\r\nContent-Type: ${contentType}\r\n\r\n`
    ))
    bodyParts.push(data)
    bodyParts.push(Buffer.from('\r\n'))
  }

  addFile('image_file', 'image.png', 'image/png', imageBuffer)
  addField('size', 'auto')
  bodyParts.push(Buffer.from(`--${boundary}--\r\n`))

  const body = Buffer.concat(bodyParts)

  try {
    const response = await net.fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Accept': 'application/octet-stream'
      },
      body
    })

    if (!response.ok) {
      if (response.status === 402) {
        return { success: false, error: 'API credits exhausted. Free tier allows 50 images per month.' }
      }
      if (response.status === 400) {
        return { success: false, error: 'Invalid image. Please use a valid PNG, JPG, or WebP file.' }
      }
      if (response.status === 429) {
        return { success: false, error: 'Rate limit exceeded. Please wait a moment and try again.' }
      }
      if (response.status === 403) {
        return { success: false, error: 'Invalid API key. Please check your remove.bg API key in Settings.' }
      }
      return { success: false, error: `API error: ${response.status} ${response.statusText}` }
    }

    const arrayBuffer = await response.arrayBuffer()
    const resultBase64 = Buffer.from(arrayBuffer).toString('base64')
    const creditsRemaining = response.headers.get('x-credits-remaining')

    return { success: true, data: resultBase64, creditsRemaining }
  } catch (err) {
    return { success: false, error: `Network error: ${err instanceof Error ? err.message : 'Unknown error'}` }
  }
}
