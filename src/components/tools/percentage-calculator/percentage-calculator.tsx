'use client'

import { type ReactNode, useState } from 'react'
import {
  decreaseByPercent,
  increaseByPercent,
  percentageChange,
  percentOf,
  whatPercent,
} from '@/lib/math/percentage'

const INPUT_CLASS =
  'w-28 rounded-lg border border-border bg-input px-2 py-1.5 text-center text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring'

function toNum(value: string): number | null {
  const n = Number(value)
  return value !== '' && !Number.isNaN(n) ? n : null
}

function fmt(value: number): string {
  if (!Number.isFinite(value)) return '–'
  return (Math.round(value * 100) / 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 })
}

type CardProps = {
  number: number
  sentence: ReactNode
  result: ReactNode
}

function CalculatorCard({ number, sentence, result }: CardProps) {
  return (
    <div className="rounded-xl border border-border p-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Calculadora {number}
      </p>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3 text-foreground">
        {sentence}
      </div>
      {result}
    </div>
  )
}

type ResultProps = {
  value: string
  suffix?: string
  valueClass?: string
}

function ResultDisplay({ value, suffix = '', valueClass = 'text-primary' }: ResultProps) {
  const isEmpty = value === '–'
  return (
    <div className="mt-5 rounded-lg border border-primary/20 bg-primary/10 px-4 py-3">
      <p className="mb-1 text-xs text-muted-foreground">Resultado</p>
      <p className={`text-2xl font-bold ${isEmpty ? 'text-muted-foreground' : valueClass}`}>
        {value}
        {!isEmpty && suffix}
      </p>
    </div>
  )
}

export function PercentageCalculator() {
  const [c1p, setC1p] = useState('')
  const [c1v, setC1v] = useState('')

  const [c2p, setC2p] = useState('')
  const [c2t, setC2t] = useState('')

  const [c3f, setC3f] = useState('')
  const [c3t, setC3t] = useState('')

  const [c4v, setC4v] = useState('')
  const [c4p, setC4p] = useState('')

  const [c5v, setC5v] = useState('')
  const [c5p, setC5p] = useState('')

  const n1p = toNum(c1p)
  const n1v = toNum(c1v)
  const r1 = n1p !== null && n1v !== null ? fmt(percentOf(n1p, n1v)) : '–'

  const n2p = toNum(c2p)
  const n2t = toNum(c2t)
  const r2 = n2p !== null && n2t !== null ? fmt(whatPercent(n2p, n2t)) : '–'

  const n3f = toNum(c3f)
  const n3t = toNum(c3t)
  const change = n3f !== null && n3t !== null ? percentageChange(n3f, n3t) : null
  const r3 = change !== null ? (change > 0 ? '+' : '') + fmt(change) : '–'
  const r3Class =
    change === null ? 'text-primary'
    : change > 0 ? 'text-success'
    : change < 0 ? 'text-destructive'
    : 'text-primary'

  const n4v = toNum(c4v)
  const n4p = toNum(c4p)
  const r4 = n4v !== null && n4p !== null ? fmt(increaseByPercent(n4v, n4p)) : '–'

  const n5v = toNum(c5v)
  const n5p = toNum(c5p)
  const r5 = n5v !== null && n5p !== null ? fmt(decreaseByPercent(n5v, n5p)) : '–'

  return (
    <div className="space-y-4">
      <CalculatorCard
        number={1}
        sentence={
          <>
            <span>Quanto é</span>
            <input
              className={INPUT_CLASS}
              type="number"
              value={c1p}
              onChange={(e) => setC1p(e.target.value)}
              placeholder="0"
              aria-label="Porcentagem"
            />
            <span>% de</span>
            <input
              className={INPUT_CLASS}
              type="number"
              value={c1v}
              onChange={(e) => setC1v(e.target.value)}
              placeholder="0"
              aria-label="Valor"
            />
            <span>?</span>
          </>
        }
        result={<ResultDisplay value={r1} />}
      />

      <CalculatorCard
        number={2}
        sentence={
          <>
            <span>O valor</span>
            <input
              className={INPUT_CLASS}
              type="number"
              value={c2p}
              onChange={(e) => setC2p(e.target.value)}
              placeholder="0"
              aria-label="Valor parcial"
            />
            <span>é qual porcentagem de</span>
            <input
              className={INPUT_CLASS}
              type="number"
              value={c2t}
              onChange={(e) => setC2t(e.target.value)}
              placeholder="0"
              aria-label="Valor total"
            />
            <span>?</span>
          </>
        }
        result={<ResultDisplay value={r2} suffix="%" />}
      />

      <CalculatorCard
        number={3}
        sentence={
          <>
            <span>Eu tenho um valor de</span>
            <input
              className={INPUT_CLASS}
              type="number"
              value={c3f}
              onChange={(e) => setC3f(e.target.value)}
              placeholder="0"
              aria-label="Valor original"
            />
            <span>que mudou para</span>
            <input
              className={INPUT_CLASS}
              type="number"
              value={c3t}
              onChange={(e) => setC3t(e.target.value)}
              placeholder="0"
              aria-label="Novo valor"
            />
            <span>. Qual foi a variação percentual?</span>
          </>
        }
        result={<ResultDisplay value={r3} suffix="%" valueClass={r3Class} />}
      />

      <CalculatorCard
        number={4}
        sentence={
          <>
            <span>Eu tenho um valor de</span>
            <input
              className={INPUT_CLASS}
              type="number"
              value={c4v}
              onChange={(e) => setC4v(e.target.value)}
              placeholder="0"
              aria-label="Valor base"
            />
            <span>e quero</span>
            <span className="font-semibold text-success">AUMENTAR</span>
            <input
              className={INPUT_CLASS}
              type="number"
              value={c4p}
              onChange={(e) => setC4p(e.target.value)}
              placeholder="0"
              aria-label="Porcentagem de aumento"
            />
            <span>%. Qual é o resultado?</span>
          </>
        }
        result={<ResultDisplay value={r4} />}
      />

      <CalculatorCard
        number={5}
        sentence={
          <>
            <span>Eu tenho um valor de</span>
            <input
              className={INPUT_CLASS}
              type="number"
              value={c5v}
              onChange={(e) => setC5v(e.target.value)}
              placeholder="0"
              aria-label="Valor base"
            />
            <span>e quero</span>
            <span className="font-semibold text-destructive">DIMINUIR</span>
            <input
              className={INPUT_CLASS}
              type="number"
              value={c5p}
              onChange={(e) => setC5p(e.target.value)}
              placeholder="0"
              aria-label="Porcentagem de desconto"
            />
            <span>%. Qual é o resultado?</span>
          </>
        }
        result={<ResultDisplay value={r5} />}
      />
    </div>
  )
}
