import { contextBridge, ipcRenderer } from 'electron'

export type ProviderId = 'removebg' | 'imgly'

export interface ProviderInfo {
  id: ProviderId
  label: string
  requiresApiKey: boolean
}

const electronAPI = {
  removeBackground: (imageBase64: string) =>
    ipcRenderer.invoke('remove-background', imageBase64),

  saveImage: (imageBase64: string, defaultFilename: string) =>
    ipcRenderer.invoke('save-image', imageBase64, defaultFilename),

  getApiKey: () =>
    ipcRenderer.invoke('get-api-key') as Promise<string | null>,

  setApiKey: (key: string) =>
    ipcRenderer.invoke('set-api-key', key),

  getProvider: () =>
    ipcRenderer.invoke('get-provider') as Promise<ProviderId>,

  setProvider: (id: ProviderId) =>
    ipcRenderer.invoke('set-provider', id),

  listProviders: () =>
    ipcRenderer.invoke('list-providers') as Promise<ProviderInfo[]>
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

export type ElectronAPI = typeof electronAPI
