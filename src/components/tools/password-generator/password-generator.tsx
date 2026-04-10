'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PasswordOptions } from './password-options'
import { PasswordOutput } from './password-output'

type PasswordConfig = {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

const DEFAULT_CONFIG: PasswordConfig = {
  length: 12,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: false,
}

function buildPassword(config: PasswordConfig): string {
  const charsets: string[] = []
  if (config.uppercase) charsets.push(UPPERCASE)
  if (config.lowercase) charsets.push(LOWERCASE)
  if (config.numbers) charsets.push(NUMBERS)
  if (config.symbols) charsets.push(SYMBOLS)

  if (charsets.length === 0) return ''

  const combined = charsets.join('')

  const guaranteed = charsets.map((charset) => {
    const arr = new Uint32Array(1)
    crypto.getRandomValues(arr)
    return charset[arr[0] % charset.length]
  })

  const remaining = Math.max(0, config.length - guaranteed.length)
  const rest = Array.from({ length: remaining }, () => {
    const arr = new Uint32Array(1)
    crypto.getRandomValues(arr)
    return combined[arr[0] % combined.length]
  })

  const allChars = [...guaranteed, ...rest]

  for (let i = allChars.length - 1; i > 0; i--) {
    const arr = new Uint32Array(1)
    crypto.getRandomValues(arr)
    const j = arr[0] % (i + 1)
    ;[allChars[i], allChars[j]] = [allChars[j], allChars[i]]
  }

  return allChars.join('')
}

export function PasswordGenerator() {
  const [config, setConfig] = useState<PasswordConfig>(DEFAULT_CONFIG)
  const [password, setPassword] = useState(() => buildPassword(DEFAULT_CONFIG))
  const [copied, setCopied] = useState(false)

  const isValid = config.uppercase || config.lowercase || config.numbers || config.symbols

  useEffect(() => {
    const valid = config.uppercase || config.lowercase || config.numbers || config.symbols
    if (!valid) {
      setPassword('')
      return
    }
    setPassword(buildPassword(config))
    setCopied(false)
  }, [config])

  function generate() {
    if (!isValid) return
    setPassword(buildPassword(config))
    setCopied(false)
  }

  function handleCopy() {
    if (!password) return
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <PasswordOptions config={config} onChange={setConfig} />

      {!isValid && (
        <p className="text-sm text-destructive">Selecione pelo menos uma opção</p>
      )}

      <PasswordOutput password={password} onCopy={handleCopy} copied={copied} />

      <Button onClick={generate} disabled={!isValid}>
        Gerar senha
      </Button>
    </div>
  )
}
