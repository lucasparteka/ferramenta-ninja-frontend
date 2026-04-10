'use client'

import { useState } from 'react'
import {
  capitalize,
  removeAccents,
  removeExtraSpaces,
  reverseText,
  toLowercase,
  toUppercase,
} from '@/lib/text/transformations'
import { TextActions } from './text-actions'
import { TextInput } from './text-input'
import { TextOutput } from './text-output'

type TransformKey =
  | 'uppercase'
  | 'lowercase'
  | 'capitalize'
  | 'removeExtraSpaces'
  | 'removeAccents'
  | 'reverseText'

const transformMap: Record<TransformKey, (text: string) => string> = {
  uppercase: toUppercase,
  lowercase: toLowercase,
  capitalize: capitalize,
  removeExtraSpaces: removeExtraSpaces,
  removeAccents: removeAccents,
  reverseText: reverseText,
}

export function TextConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  function handleTransform(key: string) {
    const fn = transformMap[key as TransformKey]
    if (!fn || !input.trim()) return
    setOutput(fn(input))
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
      <TextInput value={input} onChange={setInput} />
      <TextActions onTransform={handleTransform} disabled={!input.trim()} />
      <TextOutput value={output} onChange={setOutput} onCopy={handleCopy} copied={copied} />
    </div>
  )
}
