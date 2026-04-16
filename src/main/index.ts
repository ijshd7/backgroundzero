import { app, BrowserWindow, ipcMain, dialog, session } from 'electron'
import { join } from 'path'
import { writeFile } from 'fs/promises'
import Store from 'electron-store'
import { getProvider, providerList, DEFAULT_PROVIDER } from './providers'
import type { ProviderId } from './providers'

type StoreSchema = {
  apiKey?: string
  provider?: ProviderId
}

const store = new Store<StoreSchema>({
  encryptionKey: 'backgroundzero-v1'
})

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 950,
    height: 700,
    minWidth: 900,
    minHeight: 650,
    backgroundColor: '#0a0a0f',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function registerIpcHandlers(): void {
  ipcMain.handle('remove-background', async (_event, imageBase64: string) => {
    const providerId = store.get('provider') ?? DEFAULT_PROVIDER
    const provider = getProvider(providerId)
    const apiKey = provider.requiresApiKey ? store.get('apiKey') ?? null : null
    return provider.remove(imageBase64, apiKey)
  })

  ipcMain.handle('save-image', async (_event, imageBase64: string, defaultFilename: string) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: defaultFilename,
      filters: [{ name: 'PNG Image', extensions: ['png'] }]
    })

    if (canceled || !filePath) {
      return { success: false, error: 'Save cancelled' }
    }

    try {
      const buffer = Buffer.from(imageBase64, 'base64')
      await writeFile(filePath, buffer)
      return { success: true, filePath }
    } catch (err) {
      return { success: false, error: `Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}` }
    }
  })

  ipcMain.handle('get-api-key', () => {
    return store.get('apiKey') || null
  })

  ipcMain.handle('set-api-key', (_event, key: string) => {
    store.set('apiKey', key)
  })

  ipcMain.handle('get-provider', () => {
    return store.get('provider') ?? DEFAULT_PROVIDER
  })

  ipcMain.handle('set-provider', (_event, id: ProviderId) => {
    store.set('provider', id)
  })

  ipcMain.handle('list-providers', () => {
    return providerList
  })
}

app.whenReady().then(() => {
  if (!process.env['ELECTRON_RENDERER_URL']) {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': [
            "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'"
          ]
        }
      })
    })
  }

  registerIpcHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
