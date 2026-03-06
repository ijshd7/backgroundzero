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
          <span className="text-sm font-medium text-[#808080] uppercase tracking-wider">Original</span>
          <div className="bg-[#1a1a2e] rounded-xl p-2 w-full aspect-square flex items-center justify-center overflow-hidden">
            <img
              src={originalSrc}
              alt="Original"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 flex-1 max-w-[400px]">
          <span className="text-sm font-medium text-[#808080] uppercase tracking-wider">Processed</span>
          <div className="checkerboard rounded-xl p-2 w-full aspect-square flex items-center justify-center overflow-hidden">
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
          className="px-6 py-2.5 rounded-lg bg-[#2a2a3e] text-[#e0e0e0] hover:bg-[#3a3a5c] transition-colors cursor-pointer font-medium"
        >
          New Image
        </button>
        <button
          onClick={onSave}
          className="px-6 py-2.5 rounded-lg bg-[#6c63ff] text-white hover:bg-[#5a52e0] transition-colors cursor-pointer font-medium"
        >
          Save PNG
        </button>
      </div>
    </div>
  )
}
