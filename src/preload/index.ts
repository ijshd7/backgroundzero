import { contextBridge, ipcRenderer } from 'electron'

const electronAPI = {
  removeBackground: (imageBase64: string) =>
    ipcRenderer.invoke('remove-background', imageBase64),

  saveImage: (imageBase64: string, defaultFilename: string) =>
    ipcRenderer.invoke('save-image', imageBase64, defaultFilename),

  getApiKey: () =>
    ipcRenderer.invoke('get-api-key'),

  setApiKey: (key: string) =>
    ipcRenderer.invoke('set-api-key', key)
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)

export type ElectronAPI = typeof electronAPI
