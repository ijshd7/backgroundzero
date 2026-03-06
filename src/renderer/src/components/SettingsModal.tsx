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
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a2e] rounded-2xl p-8 w-[440px] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-[#e0e0e0] mb-2">Settings</h2>
        <p className="text-sm text-[#808080] mb-6">
          Enter your remove.bg API key. Get one free at{' '}
          <span className="text-[#6c63ff]">remove.bg/api</span>
        </p>

        <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
          API Key
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="paste your API key here"
          className="w-full px-4 py-2.5 rounded-lg bg-[#0f0f0f] border border-[#3a3a5c] text-[#e0e0e0] placeholder-[#555] focus:outline-none focus:border-[#6c63ff] transition-colors"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#2a2a3e] text-[#e0e0e0] hover:bg-[#3a3a5c] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="px-5 py-2 rounded-lg bg-[#6c63ff] text-white hover:bg-[#5a52e0] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
