import { useState, useEffect } from 'react'
import { api } from '../lib/ipc'
import type { ProviderId, ProviderInfo } from '../../../preload/index'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('')
  const [provider, setProvider] = useState<ProviderId>('removebg')
  const [providers, setProviders] = useState<ProviderInfo[]>([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setSaved(false)
      Promise.all([
        api.getApiKey(),
        api.getProvider(),
        api.listProviders()
      ]).then(([key, currentProvider, list]) => {
        setApiKey(key || '')
        setProvider(currentProvider)
        setProviders(list)
      })
    }
  }, [isOpen])

  const activeProvider = providers.find(p => p.id === provider)
  const requiresApiKey = activeProvider?.requiresApiKey ?? true
  const canSave = !requiresApiKey || apiKey.trim().length > 0

  const handleSave = async () => {
    await api.setProvider(provider)
    if (requiresApiKey) {
      await api.setApiKey(apiKey.trim())
    }
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
          Choose a background removal engine.
        </p>

        <label className="block text-sm font-medium text-sw-text-muted mb-2">
          Engine
        </label>
        <select
          value={provider}
          onChange={e => setProvider(e.target.value as ProviderId)}
          className="w-full px-4 py-2.5 mb-5 rounded-lg bg-sw-bg-deep border border-sw-border text-sw-text focus:outline-none focus:border-sw-cyan transition-all duration-300 cursor-pointer"
          style={{ transition: 'box-shadow 0.3s ease, border-color 0.3s ease' }}
          onFocus={e => (e.currentTarget.style.boxShadow = 'var(--glow-cyan)')}
          onBlur={e => (e.currentTarget.style.boxShadow = 'none')}
        >
          {providers.map(p => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>

        {requiresApiKey ? (
          <>
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
            <p className="text-xs text-sw-text-dim mt-2">
              Get a free key at <span className="text-sw-cyan">remove.bg/api</span> (50 images/month).
            </p>
          </>
        ) : (
          <div className="px-4 py-3 rounded-lg bg-sw-bg-deep border border-sw-border text-xs text-sw-text-muted leading-relaxed">
            Runs entirely on your machine — no API key required. First run downloads the model (~44MB); subsequent runs are offline.
          </div>
        )}

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
            disabled={!canSave}
            className="px-5 py-2 rounded-lg bg-sw-pink text-white hover:bg-sw-pink-dim transition-all duration-300 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ boxShadow: canSave ? 'var(--glow-pink)' : 'none' }}
            onMouseEnter={e => { if (canSave) e.currentTarget.style.boxShadow = 'var(--glow-pink-intense)' }}
            onMouseLeave={e => { if (canSave) e.currentTarget.style.boxShadow = 'var(--glow-pink)' }}
          >
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
