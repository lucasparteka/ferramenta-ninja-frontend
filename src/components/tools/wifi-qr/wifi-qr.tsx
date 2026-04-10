'use client'

import { useState } from 'react'
import { generateWifiString } from '@/lib/wifi/generate'
import type { WifiSecurity } from '@/lib/wifi/generate'
import { generateQRCode } from '@/lib/qrcode/generate'
import { Button } from '@/components/ui/button'

const inputClass =
  'w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring'

const selectClass =
  'w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring'

export function WifiQR() {
  const [ssid, setSsid] = useState('')
  const [password, setPassword] = useState('')
  const [security, setSecurity] = useState<WifiSecurity>('WPA')
  const [hidden, setHidden] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [dataUrl, setDataUrl] = useState('')
  const [downloaded, setDownloaded] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate() {
    setError('')
    if (!ssid.trim()) {
      setError('Informe o nome da rede (SSID).')
      return
    }
    if (security !== 'nopass' && !password) {
      setError('Informe a senha da rede.')
      return
    }
    try {
      const wifiString = generateWifiString({ ssid, password, security, hidden })
      const url = await generateQRCode({ text: wifiString, size: 300, errorCorrectionLevel: 'M' })
      setDataUrl(url)
    } catch {
      setError('Erro ao gerar o QR Code.')
    }
  }

  function handleDownload() {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `wifi-${ssid}.png`
    a.click()
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <div className="space-y-4 sm:w-[30%] sm:shrink-0">
        <div className="space-y-1">
          <label htmlFor="wifi-ssid" className="flex w-full text-sm font-medium text-foreground">
            Nome da rede (SSID)
          </label>
          <input
            id="wifi-ssid"
            type="text"
            placeholder="Nome da rede Wi-Fi"
            value={ssid}
            onChange={(e) => { setSsid(e.target.value); setDataUrl('') }}
            className={inputClass}
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="wifi-security" className="flex w-full text-sm font-medium text-foreground">
            Segurança
          </label>
          <select
            id="wifi-security"
            value={security}
            onChange={(e) => { setSecurity(e.target.value as WifiSecurity); setDataUrl('') }}
            className={selectClass}
          >
            <option value="WPA">WPA / WPA2 / WPA3</option>
            <option value="WEP">WEP</option>
            <option value="nopass">Sem senha</option>
          </select>
        </div>

        {security !== 'nopass' && (
          <div className="space-y-1">
            <label htmlFor="wifi-password" className="flex w-full text-sm font-medium text-foreground">
              Senha
            </label>
            <div className="flex gap-2">
              <input
                id="wifi-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha da rede"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setDataUrl('') }}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="shrink-0 rounded-lg border border-border bg-input px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
              >
                {showPassword ? 'Ocultar' : 'Exibir'}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Rede oculta</span>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={hidden}
              onChange={(e) => { setHidden(e.target.checked); setDataUrl('') }}
              className="accent-primary"
            />
            <span className="text-sm text-foreground">Ativar</span>
          </label>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button onClick={handleGenerate}>Gerar QR Code</Button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-start gap-4">
        {dataUrl ? (
          <>
            <img
              src={dataUrl}
              alt="QR Code Wi-Fi"
              width={300}
              height={300}
              className="rounded-lg border border-border bg-white"
            />
            <Button variant="outline" onClick={handleDownload}>
              {downloaded ? 'Baixado!' : 'Baixar PNG'}
            </Button>
          </>
        ) : (
          <div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed border-border bg-secondary text-sm text-muted-foreground">
            O QR Code aparecerá aqui
          </div>
        )}
      </div>
    </div>
  )
}
