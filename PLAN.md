# Plano: Substituir `<input>` nativo por `<Input>` do shadcn/ui

## Contexto
O componente `<Input>` já existe em `src/components/ui/input.tsx` e é baseado no `@base-ui/react/input`. Ele já aplica estilos visuais padrão (borda, background, fonte, focus ring, etc.) via `cn()`.

## Regra geral
- **Trocar** `<input>` nativo por `<Input>` quando o input for visível e de texto/número.
- **Manter** `<input>` nativo (sem classes de estilo visual) quando for `type="file"`, `type="color"`, `type="range"` ou `type="radio"` — esses tipos não se beneficiam do estilo do `Input` e precisam de controle próprio.
- Para inputs nativos mantidos, **remover** classes de estilo visual (`bg-*`, `border-*`, `rounded-*`, `text-sm`, `outline-none`, `focus:*`, etc.) e deixar apenas classes de contexto (`w-*`, `h-*`, `hidden`, `sr-only`, `cursor-pointer`, `p-*`, `accent-*`).

---

## Arquivos e ações

| # | Arquivo | `<input>` | Ação |
|---|---------|-----------|------|
| 1 | `src/app/componentes/page.tsx` | 1× `type="text"` | Trocar por `<Input>`; remover classes manuais |
| 2 | `src/components/home/tool-search.tsx` | 1× `type="text"` | Trocar por `<Input>`; remover classes manuais |
| 3 | `src/components/tools/password-generator/password-options.tsx` | 1× `type="range"` | Manter `<input>`; remover classes visuais, manter `w-full accent-primary` |
| 4 | `src/components/tools/typing-test/typing-test.tsx` | 1× `type="text"` | Trocar por `<Input>`; manter `className="absolute h-0 w-0 opacity-0"` (contexto) |
| 5 | `src/components/tools/drawing-canvas/canvas-toolbar.tsx` | 1× `type="color"`, 1× `type="range"` | Manter ambos; remover classes visuais, manter contexto |
| 6 | `src/components/tools/menu/menu-controls.tsx` | 2× `type="color"` | Manter ambos; remover classes visuais, manter contexto |
| 7 | `src/components/tools/menu/menu-editor.tsx` | 1× `type="file"`, 1× `type="range"`, 2× `type="color"` | Manter todos; remover classes visuais, manter contexto |
| 8 | `src/components/tools/checklist/checklist-editor.tsx` | 2× `type="color"` | Manter ambos; remover classes visuais, manter contexto |
| 9 | `src/components/tools/custom-qr-code/custom-qr-code.tsx` | 2× `type="color"`, 1× `type="file"`, 1× `type="range"` | Manter todos; remover classes visuais, manter contexto |
| 10 | `src/components/tools/inventario/inventario-editor.tsx` | 1× `type="color"` | Manter; remover classes visuais, manter contexto |
| 11 | `src/components/tools/loyalty-card/loyalty-card-editor.tsx` | 5× `type="color"`, 1× `type="file"` | Manter todos; remover classes visuais, manter contexto |
| 12 | `src/components/tools/pdf/split/split-pdf.tsx` | 1× `type="file"`, 2× `type="radio"` | Manter todos; remover classes visuais, manter contexto |
| 13 | `src/components/tools/pdf/compress/compress-pdf.tsx` | 1× `type="file"` | Manter; já está com `className="hidden"` apenas |
| 14 | `src/components/tools/pdf/merge/merge-pdf.tsx` | 1× `type="file"` | Manter; já está com `className="hidden"` apenas |
| 15 | `src/components/tools/image-cropper/image-cropper.tsx` | 1× `type="file"` | Manter; já está com `className="hidden"` apenas |
| 16 | `src/components/tools/qr-reader/qr-reader.tsx` | 1× `type="file"` | Manter; já está com `className="hidden"` apenas |
| 17 | `src/components/tools/image-to-text/image-upload.tsx` | 1× `type="file"` | Manter; já está com `className="hidden"` apenas |
| 18 | `src/components/shared/image-dropzone.tsx` | 1× `type="file"` | Manter; já está com `className="hidden"` apenas |
| 19 | `src/components/shared/image-uploader.tsx` | 1× `type="file"` | Manter; já está com `className="hidden"` apenas |
| 20 | `src/components/tools/text-diff/diff-inputs.tsx` | 1× `type="file"` | Manter; já está com `className="hidden"` apenas |
| 21 | `src/components/tools/text-cleaner/text-cleaner-input.tsx` | 1× `type="file"` | Manter; já está com `className="hidden"` apenas |

---

## Classes a remover (estilo visual)
`rounded*`, `border*`, `bg-*` (exceto quando semanticamente necessário como `bg-transparent` para color picker), `text-sm`, `text-base`, `outline-none`, `focus:*`, `placeholder:*`, `transition-colors`, `file:*` (quando aplicável).

## Classes a manter (contexto)
`w-*`, `h-*`, `hidden`, `sr-only`, `cursor-pointer`, `p-0`, `p-0.5`, `p-1`, `accent-primary`, `absolute`, `opacity-0`, `aria-label`, ids, refs.

---

## Passos de execução
1. Atualizar `src/components/ui/input.tsx` se necessário (já está pronto).
2. Aplicar as 21 alterações listadas acima.
3. Verificar se há imports de `Input` onde necessário.
4. Rodar `pnpm build` para validar.
