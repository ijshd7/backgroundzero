export type ProviderId = 'removebg' | 'imgly'

export type ProviderResult =
  | { success: true; data: string; creditsRemaining: string | null }
  | { success: false; error: string }

export interface BackgroundRemovalProvider {
  id: ProviderId
  label: string
  requiresApiKey: boolean
  remove(imageBase64: string, apiKey?: string | null): Promise<ProviderResult>
}
