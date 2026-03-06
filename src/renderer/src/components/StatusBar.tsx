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
        className="mx-8 px-4 py-2.5 rounded-lg bg-[#ff6b6b]/15 border border-[#ff6b6b]/30 text-[#ff6b6b] text-sm text-center cursor-pointer"
      >
        {error}
      </div>
    )
  }

  if (state === 'processing') {
    return (
      <div className="mx-8 px-4 py-2.5 rounded-lg bg-[#6c63ff]/15 border border-[#6c63ff]/30 text-[#6c63ff] text-sm text-center flex items-center justify-center gap-2">
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Removing background...
      </div>
    )
  }

  if (state === 'done' && creditsRemaining) {
    return (
      <div className="mx-8 px-4 py-2 text-xs text-[#808080] text-center">
        Credits remaining: {creditsRemaining}
      </div>
    )
  }

  return null
}
