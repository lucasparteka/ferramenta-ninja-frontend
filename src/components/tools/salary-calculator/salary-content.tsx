'use client'

import { useState } from 'react'
import { SalaryCalculatorForm } from './salary-form'
import { SalaryResultCard } from './salary-result'
import { CalculateResult } from './types'

export function SalaryContent() {
  const [result, setResult] = useState<CalculateResult | null>(null)

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <SalaryCalculatorForm onCalculate={setResult} />
      <SalaryResultCard result={result} />
    </div>
  )
}
