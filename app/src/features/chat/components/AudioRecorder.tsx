import { useEffect, useRef, useState } from 'react'
import { Mic, Square, X } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { toast } from '@/stores/toast.store'

interface AudioRecorderProps {
  onRecorded: (file: File) => void
  disabled?: boolean
}

function pickMimeType(): string {
  if (typeof window.MediaRecorder === 'undefined') return ''
  const candidates = ['audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/wav']
  return candidates.find((t) => window.MediaRecorder.isTypeSupported(t)) ?? ''
}

function extensionFor(mimeType: string): string {
  if (mimeType.includes('mp4') || mimeType.includes('m4a')) return 'm4a'
  if (mimeType.includes('ogg')) return 'ogg'
  if (mimeType.includes('wav')) return 'wav'
  return 'webm'
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function AudioRecorder({ onRecorded, disabled = false }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      if (timerRef.current !== null) window.clearInterval(timerRef.current)
    }
  }, [])

  function stopTracks() {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }

  async function handleStart() {
    if (disabled) return
    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      toast.error('No se pudo acceder al micrófono.', 'Revisa los permisos del navegador.')
      return
    }
    streamRef.current = stream
    chunksRef.current = []
    const mimeType = pickMimeType()
    let recorder: MediaRecorder
    try {
      recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)
    } catch {
      recorder = new MediaRecorder(stream)
    }
    recorderRef.current = recorder
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }
    recorder.onstop = handleStopComplete
    recorder.start()
    setIsRecording(true)
    setElapsed(0)
    timerRef.current = window.setInterval(() => setElapsed((s) => s + 1), 1000)
  }

  function handleStop() {
    const recorder = recorderRef.current
    if (recorder && recorder.state !== 'inactive') recorder.stop()
  }

  function handleStopComplete() {
    const mimeType = recorderRef.current?.mimeType ?? 'audio/webm'
    recorderRef.current = null
    stopTracks()
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsRecording(false)
    setElapsed(0)

    const type = mimeType.split(';')[0]
    const blob = new Blob(chunksRef.current, { type })
    if (blob.size === 0) {
      toast.error('No se capturó audio.')
      return
    }
    const file = new File([blob], `audio-${Date.now()}.${extensionFor(type)}`, { type })
    onRecorded(file)
  }

  function handleCancel() {
    const recorder = recorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = null
      recorder.stop()
    }
    recorderRef.current = null
    stopTracks()
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsRecording(false)
    setElapsed(0)
  }

  if (isRecording) {
    return (
      <div className="flex items-center gap-1">
        <span className="flex items-center gap-1.5 rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-danger" aria-hidden />
          Grabando {formatTime(elapsed)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          aria-label="Descartar grabación"
          title="Descartar"
        >
          <X size={14} aria-hidden />
        </Button>
        <Button variant="secondary" size="sm" onClick={handleStop} aria-label="Detener y enviar">
          <Square size={12} aria-hidden />
          Enviar
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleStart}
      disabled={disabled}
      aria-label="Grabar audio"
      title="Grabar audio"
    >
      <Mic size={14} aria-hidden />
    </Button>
  )
}