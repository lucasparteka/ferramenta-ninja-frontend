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
import type {
  Background,
  BackData,
  CanvasHandle,
  FrontData,
  GradientDirection,
  StampCount,
  StampStyle,
  TextureType,
} from './types'

const STAMP_COUNTS: StampCount[] = [5, 6, 8, 10]

function buildDefaultFrontData(templateId: string): FrontData {
  const template = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0]
  return {
    businessName: '',
    slogan: '',
    contactInfo: '',
    primaryColor: template.defaultFront.primaryColor,
    background: template.defaultFront.background,
    logoFile: null,
    logoPreview: null,
  }
}

function buildDefaultBackData(templateId: string): BackData {
  const template = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0]
  return {
    stampCount: 8,
    stampStyle: 'circle',
    rewardText: '',
    rulesText: '',
    primaryColor: template.defaultBack.primaryColor,
    background: template.defaultBack.background,
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

type BackgroundPickerProps = {
  value: Background
  onChange: (bg: Background) => void
}

function BackgroundPicker({ value, onChange }: BackgroundPickerProps) {
  const GRADIENT_DIRECTIONS: { value: GradientDirection; label: string }[] = [
    { value: 'to-right', label: '→' },
    { value: 'to-bottom', label: '↓' },
    { value: 'diagonal', label: '↘' },
  ]

  const TEXTURES: { value: TextureType; label: string }[] = [
    { value: 'dots', label: 'Pontos' },
    { value: 'lines', label: 'Linhas' },
    { value: 'grid', label: 'Grade' },
    { value: 'stripes', label: 'Listras' },
  ]

  return (
    <div className="space-y-3">
      <Label>Fundo</Label>
      <div className="flex gap-1 rounded-lg border border-border bg-muted p-1">
        {(['solid', 'gradient', 'texture'] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => {
              if (type === 'solid') {
                const color = value.type === 'solid' ? value.color
                  : value.type === 'gradient' ? value.color1
                  : value.color
                onChange({ type: 'solid', color })
              } else if (type === 'gradient') {
                const color = value.type === 'solid' ? value.color
                  : value.type === 'gradient' ? value.color1
                  : value.color
                onChange({ type: 'gradient', color1: color, color2: '#ffffff', direction: 'to-bottom' })
              } else {
                const color = value.type === 'solid' ? value.color
                  : value.type === 'gradient' ? value.color1
                  : value.color
                onChange({ type: 'texture', color, texture: 'dots' })
              }
            }}
            className={`flex-1 rounded px-2 py-1 text-xs font-medium transition-colors ${
              value.type === type
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {type === 'solid' ? 'Sólido' : type === 'gradient' ? 'Gradiente' : 'Textura'}
          </button>
        ))}
      </div>

      {value.type === 'solid' && (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value.color}
            onChange={(e) => onChange({ type: 'solid', color: e.target.value })}
            className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent p-0.5"
            aria-label="Cor de fundo"
          />
          <span className="font-mono text-xs text-muted-foreground">{value.color}</span>
        </div>
      )}

      {value.type === 'gradient' && (
        <div className="space-y-2">
          <div className="flex gap-3">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Cor 1</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={value.color1}
                  onChange={(e) => onChange({ ...value, color1: e.target.value })}
                  className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent p-0.5"
                  aria-label="Cor inicial do gradiente"
                />
                <span className="font-mono text-xs text-muted-foreground">{value.color1}</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Cor 2</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={value.color2}
                  onChange={(e) => onChange({ ...value, color2: e.target.value })}
                  className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent p-0.5"
                  aria-label="Cor final do gradiente"
                />
                <span className="font-mono text-xs text-muted-foreground">{value.color2}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            {GRADIENT_DIRECTIONS.map((dir) => (
              <button
                key={dir.value}
                type="button"
                onClick={() => onChange({ ...value, direction: dir.value })}
                aria-pressed={value.direction === dir.value}
                className={`h-8 w-10 rounded border text-sm font-medium transition-colors ${
                  value.direction === dir.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground hover:bg-muted'
                }`}
              >
                {dir.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {value.type === 'texture' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value.color}
              onChange={(e) => onChange({ ...value, color: e.target.value })}
              className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent p-0.5"
              aria-label="Cor de fundo da textura"
            />
            <span className="font-mono text-xs text-muted-foreground">{value.color}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {TEXTURES.map((tex) => (
              <button
                key={tex.value}
                type="button"
                onClick={() => onChange({ ...value, texture: tex.value })}
                aria-pressed={value.texture === tex.value}
                className={`rounded border px-3 py-1.5 text-xs font-medium transition-colors ${
                  value.texture === tex.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground hover:bg-muted'
                }`}
              >
                {tex.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function LoyaltyCardEditor() {
  const [selectedTemplateId, setSelectedTemplateId] = useState('classico')
  const [frontData, setFrontData] = useState<FrontData>(() => buildDefaultFrontData('classico'))
  const [backData, setBackData] = useState<BackData>(() => buildDefaultBackData('classico'))
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
      background: template.defaultFront.background,
    }))
    setBackData((prev) => ({
      ...prev,
      primaryColor: template.defaultBack.primaryColor,
      background: template.defaultBack.background,
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
                <Label htmlFor="slogan">Slogan</Label>
                <Input
                  id="slogan"
                  value={frontData.slogan}
                  onChange={(e) =>
                    setFrontData((prev) => ({ ...prev, slogan: e.target.value }))
                  }
                  placeholder="Ex: Corte e barba com qualidade"
                  maxLength={50}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-info">Contato / redes sociais</Label>
                <Input
                  id="contact-info"
                  value={frontData.contactInfo}
                  onChange={(e) =>
                    setFrontData((prev) => ({ ...prev, contactInfo: e.target.value }))
                  }
                  placeholder="Ex: @barbearia_joao · Rua das Flores, 123"
                  maxLength={60}
                />
              </div>

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

              <BackgroundPicker
                value={frontData.background}
                onChange={(bg) => setFrontData((prev) => ({ ...prev, background: bg }))}
              />

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

              <div className="space-y-2">
                <Label htmlFor="reward-text">Texto do prêmio</Label>
                <Input
                  id="reward-text"
                  value={backData.rewardText}
                  onChange={(e) =>
                    setBackData((prev) => ({ ...prev, rewardText: e.target.value }))
                  }
                  placeholder="Ex: Ganhe 1 grátis!"
                  maxLength={50}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rules-text">Regras</Label>
                <Input
                  id="rules-text"
                  value={backData.rulesText}
                  onChange={(e) =>
                    setBackData((prev) => ({ ...prev, rulesText: e.target.value }))
                  }
                  placeholder="Ex: Válido por 6 meses após emissão"
                  maxLength={80}
                />
              </div>

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

              <BackgroundPicker
                value={backData.background}
                onChange={(bg) => setBackData((prev) => ({ ...prev, background: bg }))}
              />
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
