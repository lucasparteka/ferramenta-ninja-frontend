'use client'

import dynamic from 'next/dynamic'

const LoyaltyCardEditor = dynamic(
  () =>
    import('@/components/tools/loyalty-card/loyalty-card-editor').then((m) => ({
      default: m.LoyaltyCardEditor,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-border bg-card">
        <p className="text-muted-foreground">Carregando editor de cartão fidelidade...</p>
      </div>
    ),
  }
)

export function LoyaltyCardClient() {
  return <LoyaltyCardEditor />
}
