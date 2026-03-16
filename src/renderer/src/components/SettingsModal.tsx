import { useState, useEffect } from 'react'
import { api } from '../lib/ipc'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isOpen) {
      api.getApiKey().then((key: string | null) => {
        setApiKey(key || '')
        setSaved(false)
      })
    }
  }, [isOpen])

  const handleSave = async () => {
    await api.setApiKey(apiKey.trim())
    setSaved(true)
    setTimeout(() => onClose(), 800)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-sw-bg-surface rounded-2xl p-8 w-[440px] border border-sw-pink/30"
        style={{ boxShadow: 'var(--glow-pink)' }}
        onClick={e => e.stopPropagation()}
      >
        <h2
          className="text-xl font-bold font-display text-sw-text mb-2"
          style={{ textShadow: '0 0 8px rgba(255, 45, 149, 0.4)' }}
        >
          Settings
        </h2>
        <p className="text-sm text-sw-text-muted mb-6">
          Enter your remove.bg API key. Get one free at{' '}
          <span className="text-sw-cyan">remove.bg/api</span>
        </p>

        <label className="block text-sm font-medium text-sw-text-muted mb-2">
          API Key
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="paste your API key here"
          className="w-full px-4 py-2.5 rounded-lg bg-sw-bg-deep border border-sw-border text-sw-text placeholder-sw-text-dim focus:outline-none focus:border-sw-cyan transition-all duration-300"
          style={{ transition: 'box-shadow 0.3s ease, border-color 0.3s ease' }}
          onFocus={e => (e.currentTarget.style.boxShadow = 'var(--glow-cyan)')}
          onBlur={e => (e.currentTarget.style.boxShadow = 'none')}
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-sw-bg-elevated text-sw-text border border-sw-border hover:border-sw-cyan transition-all duration-300 cursor-pointer"
            onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--glow-cyan)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="px-5 py-2 rounded-lg bg-sw-pink text-white hover:bg-sw-pink-dim transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ boxShadow: apiKey.trim() ? 'var(--glow-pink)' : 'none' }}
            onMouseEnter={e => { if (apiKey.trim()) e.currentTarget.style.boxShadow = 'var(--glow-pink-intense)' }}
            onMouseLeave={e => { if (apiKey.trim()) e.currentTarget.style.boxShadow = 'var(--glow-pink)' }}
          >
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
