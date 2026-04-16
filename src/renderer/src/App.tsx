import { useState, useEffect } from 'react'
import DropZone from './components/DropZone'
import ImagePreview from './components/ImagePreview'
import StatusBar from './components/StatusBar'
import SettingsModal from './components/SettingsModal'
import { useImageProcessor } from './hooks/useImageProcessor'
import { api } from './lib/ipc'

export default function App() {
  const {
    state,
    originalImage,
    processedImage,
    error,
    creditsRemaining,
    processImage,
    reset,
    clearError,
    saveImage
  } = useImageProcessor()

  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    Promise.all([api.getProvider(), api.listProviders(), api.getApiKey()]).then(
      ([providerId, providers, key]) => {
        const active = providers.find(p => p.id === providerId)
        if (active?.requiresApiKey && !key) setSettingsOpen(true)
      }
    )
  }, [])

  return (
    <div className="h-screen flex flex-col bg-sw-bg-deep">
      {/* Synthwave animated background */}
      <div className="synthwave-bg" />

      {/* Main content */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <div
          className="flex items-center justify-between px-8 py-4 border-b border-sw-border"
          style={{ boxShadow: '0 1px 15px rgba(255, 45, 149, 0.1)' }}
        >
          <h1 className="text-2xl font-black font-display tracking-wide">
            <span
              className="text-sw-text"
              style={{ textShadow: '0 0 10px rgba(0, 240, 255, 0.6), 0 0 30px rgba(0, 240, 255, 0.3)' }}
            >
              Background
            </span>
            <span
              className="text-sw-pink"
              style={{ textShadow: '0 0 10px rgba(255, 45, 149, 0.8), 0 0 30px rgba(255, 45, 149, 0.4)' }}
            >
              Zero
            </span>
          </h1>
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-lg hover:bg-sw-bg-elevated transition-all duration-300 cursor-pointer group"
            title="Settings"
          >
            <svg
              className="w-5 h-5 text-sw-text-muted group-hover:text-sw-cyan transition-colors duration-300"
              style={{ filter: 'drop-shadow(0 0 0px transparent)' }}
              onMouseEnter={e => (e.currentTarget.style.filter = 'drop-shadow(0 0 6px rgba(0, 240, 255, 0.6))')}
              onMouseLeave={e => (e.currentTarget.style.filter = 'drop-shadow(0 0 0px transparent)')}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center overflow-auto">
          {state === 'done' && originalImage && processedImage ? (
            <ImagePreview
              originalSrc={originalImage}
              processedSrc={processedImage}
              onReset={reset}
              onSave={saveImage}
            />
          ) : (
            <DropZone onFile={processImage} />
          )}
        </div>

        {/* Status */}
        <div className="pb-4">
          <StatusBar
            state={state}
            error={error}
            creditsRemaining={creditsRemaining}
            onClearError={clearError}
          />
        </div>
      </div>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* CRT scan line overlay */}
      <div className="scanlines" />
    </div>
  )
}
