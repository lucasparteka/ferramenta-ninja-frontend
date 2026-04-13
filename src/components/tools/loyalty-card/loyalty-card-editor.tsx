'use client'

import { useRef, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-react'
import { TEMPLATES } from './templates'
import { TemplateSelector } from './template-selector'
import { FrontCanvas } from './front-canvas'
import { BackCanvas } from './back-canvas'
import { ExportPanel } from './export-panel'
import type { BackData, CanvasHandle, FrontData, StampCount, StampStyle } from './types'

const STAMP_COUNTS: StampCount[] = [5, 6, 8, 10]

function buildDefaultFrontData(templateId: string): FrontData {
  const template = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0]
  return {
    businessName: '',
    optionalLine1: '',
    optionalLine2: '',
    primaryColor: template.defaultFront.primaryColor,
    backgroundColor: template.defaultFront.backgroundColor,
    logoFile: null,
    logoPreview: null,
  }
}

function buildDefaultBackData(templateId: string): BackData {
  const template = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0]
  return {
    stampCount: 8,
    stampStyle: 'circle',
    primaryColor: template.defaultBack.primaryColor,
    backgroundColor: template.defaultBack.backgroundColor,
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

async function buildA4Sheet(cardDataUrl: string): Promise<HTMLCanvasElement> {
  const A4_W = 2480
  const A4_H = 3508
  const CARD_W = 1080
  const CARD_H = 600
  const COLS = 2
  const ROWS = 4
  const GAP_X = Math.floor((A4_W - COLS * CARD_W) / (COLS + 1))
  const GAP_Y = Math.floor((A4_H - ROWS * CARD_H) / (ROWS + 1))

  const sheet = document.createElement('canvas')
  sheet.width = A4_W
  sheet.height = A4_H
  const ctx = sheet.getContext('2d')
  if (!ctx) return sheet

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, A4_W, A4_H)

  const img = await loadImage(cardDataUrl)

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = GAP_X + col * (CARD_W + GAP_X)
      const y = GAP_Y + row * (CARD_H + GAP_Y)
      ctx.drawImage(img, x, y, CARD_W, CARD_H)

      ctx.strokeStyle = '#cccccc'
      ctx.lineWidth = 1
      ctx.setLineDash([6, 4])
      ctx.strokeRect(x - 1, y - 1, CARD_W + 2, CARD_H + 2)
      ctx.setLineDash([])
    }
  }

  return sheet
}

function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = filename
  link.click()
}

export function LoyaltyCardEditor() {
  const [selectedTemplateId, setSelectedTemplateId] = useState('generico')
  const [frontData, setFrontData] = useState<FrontData>(() => buildDefaultFrontData('generico'))
  const [backData, setBackData] = useState<BackData>(() => buildDefaultBackData('generico'))
  const [activeTab, setActiveTab] = useState<'frente' | 'verso'>('frente')
  const [logoError, setLogoError] = useState('')

  const frontCanvasRef = useRef<CanvasHandle>(null)
  const backCanvasRef = useRef<CanvasHandle>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const selectedTemplate = TEMPLATES.find((t) => t.id === selectedTemplateId) ?? TEMPLATES[0]

  function handleTemplateSelect(id: string) {
    const template = TEMPLATES.find((t) => t.id === id)
    if (!template) return
    setSelectedTemplateId(id)
    setFrontData((prev) => ({
      ...prev,
      primaryColor: template.defaultFront.primaryColor,
      backgroundColor: template.defaultFront.backgroundColor,
    }))
    setBackData((prev) => ({
      ...prev,
      primaryColor: template.defaultBack.primaryColor,
      backgroundColor: template.defaultBack.backgroundColor,
    }))
  }

  function handleLogoFile(file: File) {
    setLogoError('')
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      setLogoError('Formato inválido. Use PNG ou JPG.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoError('Arquivo muito grande. Máximo 2MB.')
      return
    }
    const preview = URL.createObjectURL(file)
    setFrontData((prev) => ({ ...prev, logoFile: file, logoPreview: preview }))
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleLogoFile(file)
  }

  function removeLogo() {
    if (frontData.logoPreview) URL.revokeObjectURL(frontData.logoPreview)
    setFrontData((prev) => ({ ...prev, logoFile: null, logoPreview: null }))
    if (logoInputRef.current) logoInputRef.current.value = ''
  }

  async function handleExportFront() {
    const dataUrl = frontCanvasRef.current?.getDataURL()
    if (!dataUrl) return
    const sheet = await buildA4Sheet(dataUrl)
    downloadCanvas(sheet, 'cartao-fidelidade-frente.png')
  }

  async function handleExportBack() {
    const dataUrl = backCanvasRef.current?.getDataURL()
    if (!dataUrl) return
    const sheet = await buildA4Sheet(dataUrl)
    downloadCanvas(sheet, 'cartao-fidelidade-verso.png')
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-medium text-foreground">Escolha um template</p>
        <TemplateSelector
          templates={TEMPLATES}
          selectedId={selectedTemplateId}
          onSelect={handleTemplateSelect}
        />
      </div>

      <div className="flex gap-1 border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab('frente')}
          className={`px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            activeTab === 'frente'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Frente
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('verso')}
          className={`px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            activeTab === 'verso'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Verso
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {activeTab === 'frente' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="business-name">Nome do negócio</Label>
                <Input
                  id="business-name"
                  value={frontData.businessName}
                  onChange={(e) =>
                    setFrontData((prev) => ({ ...prev, businessName: e.target.value }))
                  }
                  placeholder="Ex: Barbearia do João"
                  maxLength={40}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="optional-line1">Linha opcional 1 (slogan)</Label>
                <Input
                  id="optional-line1"
                  value={frontData.optionalLine1}
                  onChange={(e) =>
                    setFrontData((prev) => ({ ...prev, optionalLine1: e.target.value }))
                  }
                  placeholder="Ex: Corte e barba com qualidade"
                  maxLength={50}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="optional-line2">Linha opcional 2 (endereço ou redes)</Label>
                <Input
                  id="optional-line2"
                  value={frontData.optionalLine2}
                  onChange={(e) =>
                    setFrontData((prev) => ({ ...prev, optionalLine2: e.target.value }))
                  }
                  placeholder="Ex: @barbearia_joao · Rua das Flores, 123"
                  maxLength={60}
                />
              </div>

              <div className="flex gap-4">
                <div className="space-y-2">
                  <Label htmlFor="front-primary-color">Cor principal</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="front-primary-color"
                      type="color"
                      value={frontData.primaryColor}
                      onChange={(e) =>
                        setFrontData((prev) => ({ ...prev, primaryColor: e.target.value }))
                      }
                      className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent p-0.5"
                    />
                    <span className="font-mono text-xs text-muted-foreground">
                      {frontData.primaryColor}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="front-bg-color">Cor de fundo</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="front-bg-color"
                      type="color"
                      value={frontData.backgroundColor}
                      onChange={(e) =>
                        setFrontData((prev) => ({ ...prev, backgroundColor: e.target.value }))
                      }
                      className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent p-0.5"
                    />
                    <span className="font-mono text-xs text-muted-foreground">
                      {frontData.backgroundColor}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Logo (PNG ou JPG, máx. 2MB)</Label>
                {frontData.logoPreview ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={frontData.logoPreview}
                      alt="Logo carregado"
                      className="h-12 w-12 rounded border border-border object-contain"
                    />
                    <Button type="button" variant="outline" size="sm" onClick={removeLogo}>
                      <X className="size-3" />
                      Remover
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      <Upload className="size-4" />
                      Carregar logo
                    </Button>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={handleLogoChange}
                      className="hidden"
                      aria-label="Carregar arquivo de logo"
                    />
                    {logoError && <p className="mt-1 text-xs text-destructive">{logoError}</p>}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Número de carimbos</Label>
                <div className="flex gap-2">
                  {STAMP_COUNTS.map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setBackData((prev) => ({ ...prev, stampCount: count }))}
                      aria-pressed={backData.stampCount === count}
                      className={`h-9 w-12 rounded border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        backData.stampCount === count
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card text-foreground hover:bg-muted'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Formato do carimbo</Label>
                <div className="flex gap-2">
                  {(['circle', 'square'] as StampStyle[]).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setBackData((prev) => ({ ...prev, stampStyle: style }))}
                      aria-pressed={backData.stampStyle === style}
                      className={`rounded border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        backData.stampStyle === style
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card text-foreground hover:bg-muted'
                      }`}
                    >
                      {style === 'circle' ? 'Círculo' : 'Quadrado'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="space-y-2">
                  <Label htmlFor="back-primary-color">Cor principal</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="back-primary-color"
                      type="color"
                      value={backData.primaryColor}
                      onChange={(e) =>
                        setBackData((prev) => ({ ...prev, primaryColor: e.target.value }))
                      }
                      className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent p-0.5"
                    />
                    <span className="font-mono text-xs text-muted-foreground">
                      {backData.primaryColor}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="back-bg-color">Cor de fundo</Label>
                  <div className="flex items-center gap-2">
                    <input
                      id="back-bg-color"
                      type="color"
                      value={backData.backgroundColor}
                      onChange={(e) =>
                        setBackData((prev) => ({ ...prev, backgroundColor: e.target.value }))
                      }
                      className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent p-0.5"
                    />
                    <span className="font-mono text-xs text-muted-foreground">
                      {backData.backgroundColor}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            {activeTab === 'frente' ? 'Prévia — Frente' : 'Prévia — Verso'}
          </p>
          <div className={activeTab === 'frente' ? 'block' : 'hidden'}>
            <FrontCanvas ref={frontCanvasRef} frontData={frontData} template={selectedTemplate} />
          </div>
          <div className={activeTab === 'verso' ? 'block' : 'hidden'}>
            <BackCanvas ref={backCanvasRef} backData={backData} template={selectedTemplate} />
          </div>
          <p className="text-xs text-muted-foreground">
            Tamanho real: 9cm × 5cm · A folha A4 exportada contém 8 cartões
          </p>
        </div>
      </div>

      <ExportPanel onExportFront={handleExportFront} onExportBack={handleExportBack} />
    </div>
  )
}
