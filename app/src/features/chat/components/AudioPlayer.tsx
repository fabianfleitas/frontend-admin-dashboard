import { useEffect, useRef, useState } from 'react'
import { Headphones } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { getAudio } from '../api/chat.service'
import { isNotFound } from '@/lib/http'
import { toast } from '@/stores/toast.store'

interface AudioPlayerProps {
  audioInteractionId: number
}

export function AudioPlayer({ audioInteractionId }: AudioPlayerProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const urlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    }
  }, [])

  async function handlePlay() {
    if (loading) return
    setLoading(true)
    try {
      const blob = await getAudio(audioInteractionId)
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
      const url = URL.createObjectURL(blob)
      urlRef.current = url
      setAudioUrl(url)
    } catch (err) {
      if (isNotFound(err)) {
        toast.error(
          'Audio de respuesta no disponible.',
          'El TTS está deshabilitado o falló al generarse.',
        )
      } else {
        toast.error(
          'No fue posible reproducir el audio.',
          err instanceof Error ? err.message : undefined,
        )
      }
    } finally {
      setLoading(false)
    }
  }

  if (audioUrl) {
    return <audio controls autoPlay src={audioUrl} className="w-full" />
  }

  return (
    <Button variant="secondary" size="sm" onClick={handlePlay} disabled={loading}>
      <Headphones size={14} aria-hidden />
      {loading ? 'Cargando audio…' : 'Escuchar respuesta'}
    </Button>
  )
}