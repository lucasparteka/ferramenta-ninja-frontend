'use client'

import { useRef } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

type DiffInputsProps = {
  leftText: string
  rightText: string
  onLeftChange: (value: string) => void
  onRightChange: (value: string) => void
}

function FileUploadButton({ onLoad }: { onLoad: (content: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result
      if (typeof content === 'string') onLoad(content)
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.json"
        className="hidden"
        onChange={handleFileChange}
        aria-label="Carregar arquivo"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        className="gap-1.5"
      >
        <Upload className="size-3.5" />
        Carregar arquivo
      </Button>
    </>
  )
}

export function DiffInputs({ leftText, rightText, onLeftChange, onRightChange }: DiffInputsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="left-text">Texto original</Label>
          <FileUploadButton onLoad={onLeftChange} />
        </div>
        <Textarea
          id="left-text"
          value={leftText}
          onChange={(e) => onLeftChange(e.target.value)}
          placeholder="Cole o texto original aqui..."
          className="min-h-48 resize-y font-mono text-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="right-text">Texto modificado</Label>
          <FileUploadButton onLoad={onRightChange} />
        </div>
        <Textarea
          id="right-text"
          value={rightText}
          onChange={(e) => onRightChange(e.target.value)}
          placeholder="Cole o texto modificado aqui..."
          className="min-h-48 resize-y font-mono text-sm"
        />
      </div>
    </div>
  )
}
