import { useState, useRef, useCallback } from 'react'

interface DropZoneProps {
  onFile: (file: File) => void
}

export default function DropZone({ onFile }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }, [onFile])

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
    if (inputRef.current) inputRef.current.value = ''
  }, [onFile])

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        flex flex-col items-center justify-center gap-4 p-12 mx-8 my-6
        rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200
        ${isDragging
          ? 'border-[#6c63ff] bg-[#6c63ff]/10 scale-[1.02]'
          : 'border-[#3a3a5c] bg-[#1a1a2e] hover:border-[#6c63ff]/60 hover:bg-[#1a1a2e]/80'
        }
      `}
    >
      <svg
        className="w-16 h-16 text-[#6c63ff]/70"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
        />
      </svg>
      <div className="text-center">
        <p className="text-lg font-medium text-[#e0e0e0]">
          Drop your image here
        </p>
        <p className="text-sm text-[#808080] mt-1">
          or click to browse — PNG, JPG, WebP (max 12MB)
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
