'use client'

import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
import { DiffInputs } from './diff-inputs'
import { DiffControls } from './diff-controls'
import { DiffOptions } from './diff-options'
import { DiffResult } from './diff-result'
import { useDiff } from './use-diff'

export function TextDiff() {
  const {
    leftText,
    rightText,
    diffResult,
    hasCompared,
    options,
    setLeftText,
    setRightText,
    setOptions,
    computeDiff,
    clearAll,
    swapTexts,
    copyResult,
  } = useDiff()

  function handleCopy() {
    copyResult()
    toast.success('Resultado copiado!')
  }

  return (
    <div className="flex flex-col gap-6">
      <DiffInputs
        leftText={leftText}
        rightText={rightText}
        onLeftChange={setLeftText}
        onRightChange={setRightText}
      />

      <div className="flex flex-col gap-4">
        <DiffControls
          onCompare={computeDiff}
          onClear={clearAll}
          onSwap={swapTexts}
          onCopy={handleCopy}
          hasResult={hasCompared}
        />

        <DiffOptions options={options} onChange={setOptions} />
      </div>

      {hasCompared && (
        <>
          <Separator />
          <DiffResult diffResult={diffResult} showOnlyDifferences={options.showOnlyDifferences} />
        </>
      )}
    </div>
  )
}
