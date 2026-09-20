import { http } from '@/lib/http'

export async function exportCsv(path: string, filename: string) {
  const blob = await http.get<Blob>(path, { responseType: 'blob' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}