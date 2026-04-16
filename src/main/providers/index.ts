import type { BackgroundRemovalProvider, ProviderId } from './types'
import { removeBgProvider } from './removeBg'
import { imglyProvider } from './imgly'

export const DEFAULT_PROVIDER: ProviderId = 'removebg'

export const providers: Record<ProviderId, BackgroundRemovalProvider> = {
  removebg: removeBgProvider,
  imgly: imglyProvider
}

export function getProvider(id: ProviderId | undefined | null): BackgroundRemovalProvider {
  if (id && id in providers) return providers[id]
  return providers[DEFAULT_PROVIDER]
}

export const providerList: Array<Pick<BackgroundRemovalProvider, 'id' | 'label' | 'requiresApiKey'>> =
  Object.values(providers).map(({ id, label, requiresApiKey }) => ({ id, label, requiresApiKey }))

export * from './types'
