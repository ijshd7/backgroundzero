import { useState, useCallback } from 'react'
import { api } from '../lib/ipc'

type AppState = 'idle' | 'processing' | 'done'

interface ImageProcessorState {
  state: AppState
  originalImage: string | null
  processedImage: string | null
  error: string | null
  creditsRemaining: string | null
}

export function useImageProcessor() {
  const [status, setStatus] = useState<ImageProcessorState>({
    state: 'idle',
    originalImage: null,
    processedImage: null,
    error: null,
    creditsRemaining: null
  })

  const processImage = useCallback(async (file: File) => {
    if (file.size > 12 * 1024 * 1024) {
      setStatus(prev => ({ ...prev, error: 'File is too large. Maximum size is 12MB.' }))
      return
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setStatus(prev => ({ ...prev, error: 'Invalid file type. Please use PNG, JPG, or WebP.' }))
      return
    }

    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = reader.result as string
      const base64 = dataUrl.split(',')[1]

      setStatus({
        state: 'processing',
        originalImage: dataUrl,
        processedImage: null,
        error: null,
        creditsRemaining: null
      })

      try {
        const result = await api.removeBackground(base64)

        if (result.success) {
          setStatus({
            state: 'done',
            originalImage: dataUrl,
            processedImage: `data:image/png;base64,${result.data}`,
            error: null,
            creditsRemaining: result.creditsRemaining ?? null
          })
        } else {
          setStatus({
            state: 'idle',
            originalImage: null,
            processedImage: null,
            error: result.error,
            creditsRemaining: null
          })
        }
      } catch {
        setStatus({
          state: 'idle',
          originalImage: null,
          processedImage: null,
          error: 'An unexpected error occurred.',
          creditsRemaining: null
        })
      }
    }

    reader.readAsDataURL(file)
  }, [])

  const reset = useCallback(() => {
    setStatus({
      state: 'idle',
      originalImage: null,
      processedImage: null,
      error: null,
      creditsRemaining: null
    })
  }, [])

  const clearError = useCallback(() => {
    setStatus(prev => ({ ...prev, error: null }))
  }, [])

  const saveImage = useCallback(async () => {
    if (!status.processedImage) return

    const base64 = status.processedImage.split(',')[1]
    const result = await api.saveImage(base64, 'backgroundzero-output.png')

    if (!result.success && result.error !== 'Save cancelled') {
      setStatus(prev => ({ ...prev, error: result.error }))
    }
  }, [status.processedImage])

  return {
    ...status,
    processImage,
    reset,
    clearError,
    saveImage
  }
}
