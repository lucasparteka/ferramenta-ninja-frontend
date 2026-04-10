'use client'

import { useState } from 'react'
import {
  generateLoremParagraphs,
  generateLoremSentences,
  generateLoremWords,
} from '@/lib/text/lorem'
import {
  generateRandomParagraphs,
  generateRandomSentences,
  generateRandomWords,
} from '@/lib/text/random'
import { Button } from '@/components/ui/button'
import { GeneratorControls } from './generator-controls'
import { GeneratorOutput } from './generator-output'

type GeneratorType = 'lorem' | 'random'
type UnitType = 'words' | 'sentences' | 'paragraphs'

type GeneratorOptions = {
  type: GeneratorType
  quantity: number
  unit: UnitType
  startWithLorem: boolean
}

const DEFAULT_OPTIONS: GeneratorOptions = {
  type: 'lorem',
  quantity: 3,
  unit: 'paragraphs',
  startWithLorem: true,
}

function generate(options: GeneratorOptions): string {
  const count = Math.min(100, Math.max(1, options.quantity))

  if (options.type === 'lorem') {
    if (options.unit === 'words') return generateLoremWords(count, options.startWithLorem)
    if (options.unit === 'sentences') return generateLoremSentences(count, options.startWithLorem)
    return generateLoremParagraphs(count, options.startWithLorem)
  }

  if (options.unit === 'words') return generateRandomWords(count)
  if (options.unit === 'sentences') return generateRandomSentences(count)
  return generateRandomParagraphs(count)
}

export function TextGenerator() {
  const [options, setOptions] = useState<GeneratorOptions>(DEFAULT_OPTIONS)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  function handleGenerate() {
    setOutput(generate(options))
    setCopied(false)
  }

  function handleCopy() {
    if (!output) return
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <GeneratorControls options={options} onChange={setOptions} />
      <div className="flex gap-3">
        <Button onClick={handleGenerate}>Gerar texto</Button>
        {output && (
          <Button variant="outline" onClick={handleGenerate}>
            Gerar novamente
          </Button>
        )}
      </div>
      <GeneratorOutput value={output} onCopy={handleCopy} copied={copied} />
    </div>
  )
}
