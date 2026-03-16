import { useEffect } from 'react'

interface StatusBarProps {
  state: 'idle' | 'processing' | 'done'
  error: string | null
  creditsRemaining: string | null
  onClearError: () => void
}

export default function StatusBar({ state, error, creditsRemaining, onClearError }: StatusBarProps) {
  useEffect(() => {
    if (error) {
      const timer = setTimeout(onClearError, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, onClearError])

  if (error) {
    return (
      <div
        onClick={onClearError}
        className="mx-8 px-4 py-2.5 rounded-lg bg-sw-red/10 border border-sw-red/40 text-sw-red text-sm text-center cursor-pointer"
        style={{ boxShadow: '0 0 10px rgba(255, 56, 96, 0.15)' }}
      >
        {error}
      </div>
    )
  }

  if (state === 'processing') {
    return (
      <div
        className="mx-8 px-4 py-2.5 rounded-lg bg-sw-pink/10 border border-sw-pink/40 text-sw-pink text-sm text-center flex items-center justify-center gap-2 neon-pulse"
        style={{ boxShadow: '0 0 10px rgba(255, 45, 149, 0.15)' }}
      >
        <svg
          className="w-4 h-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          style={{ filter: 'drop-shadow(0 0 8px rgba(255, 45, 149, 0.6))' }}
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Removing background...
      </div>
    )
  }

  if (state === 'done' && creditsRemaining) {
    return (
      <div className="mx-8 px-4 py-2 text-xs text-center">
        <span className="text-sw-text-muted">Credits remaining: </span>
        <span
          className="text-sw-yellow font-medium"
          style={{ textShadow: '0 0 6px rgba(255, 225, 86, 0.4)' }}
        >
          {creditsRemaining}
        </span>
      </div>
    )
  }

  return null
}
