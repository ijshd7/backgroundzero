interface ImagePreviewProps {
  originalSrc: string
  processedSrc: string
  onReset: () => void
  onSave: () => void
}

export default function ImagePreview({ originalSrc, processedSrc, onReset, onSave }: ImagePreviewProps) {
  return (
    <div className="flex flex-col items-center gap-6 px-8 py-6">
      <div className="flex gap-6 w-full justify-center">
        <div className="flex flex-col items-center gap-2 flex-1 max-w-[400px]">
          <span
            className="text-xs font-bold font-display text-sw-text-muted uppercase tracking-[0.2em]"
            style={{ textShadow: '0 0 8px rgba(0, 240, 255, 0.4)' }}
          >
            Original
          </span>
          <div
            className="bg-sw-bg-surface rounded-xl p-2 w-full aspect-square flex items-center justify-center overflow-hidden border border-sw-border"
            style={{ boxShadow: '0 0 8px rgba(0, 240, 255, 0.1)' }}
          >
            <img
              src={originalSrc}
              alt="Original"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 flex-1 max-w-[400px]">
          <span
            className="text-xs font-bold font-display text-sw-text-muted uppercase tracking-[0.2em]"
            style={{ textShadow: '0 0 8px rgba(0, 240, 255, 0.4)' }}
          >
            Processed
          </span>
          <div
            className="checkerboard rounded-xl p-2 w-full aspect-square flex items-center justify-center overflow-hidden border border-sw-border"
            style={{ boxShadow: '0 0 8px rgba(0, 240, 255, 0.1)' }}
          >
            <img
              src={processedSrc}
              alt="Background removed"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onReset}
          className="px-6 py-2.5 rounded-lg bg-sw-bg-elevated text-sw-text border border-sw-border hover:border-sw-cyan transition-all duration-300 cursor-pointer font-medium"
          style={{ transition: 'box-shadow 0.3s ease, border-color 0.3s ease' }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--glow-cyan)')}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
        >
          New Image
        </button>
        <button
          onClick={onSave}
          className="px-6 py-2.5 rounded-lg bg-sw-pink text-white hover:bg-sw-pink-dim transition-all duration-300 cursor-pointer font-medium"
          style={{ boxShadow: 'var(--glow-pink)', transition: 'box-shadow 0.3s ease, background-color 0.3s ease' }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--glow-pink-intense)')}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--glow-pink)')}
        >
          Save PNG
        </button>
      </div>
    </div>
  )
}
