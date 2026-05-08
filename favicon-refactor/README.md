# Refactor: favicon-generator → shell de 3 painéis

Drop-in replacement para `frontend/src/components/tools/favicon-generator/`.

## Mudanças principais

1. **Sem mais step "select-mode"** — os 4 modos são tabs no painel esquerdo (sempre visíveis).
2. **Layout 3-painéis** (esquerda · centro · direita) substitui os blocos verticais empilhados.
3. **`<FaviconShell>`** — chrome compartilhado: header sticky com título + CTA "Gerar Favicon" + erro inline + 3 colunas.
4. **`<LivePreview>`** — canvas grande + mini 16/32/48 + mock de aba do navegador, todos alimentados pelo `renderAtSize` do editor ativo.
5. **Result inline** — após gerar, `PreviewGrid` + `ExportPanel` aparecem abaixo do shell (em vez de trocar de tela). O usuário continua ajustando e clica novamente em "Gerar" para atualizar.
6. **Componentes utilitários extraídos** para `shared-controls.tsx`: `ColorField`, `FormatField`, `SizeSlider`, `Section`, `ModeTabs`, `drawBackground`, `clipFormat`, presets.
7. **`mode-selector.tsx` agora é desnecessário** — pode ser deletado (substituído por `<ModeTabs>` no shell).

## Como aplicar

Substitua os arquivos em `frontend/src/components/tools/favicon-generator/`:

```
favicon-generator.tsx       (rewrite)
favicon-shell.tsx           (NEW)
shared-controls.tsx         (NEW)
image-editor.tsx            (rewrite)
svg-editor.tsx              (rewrite)
text-editor.tsx             (rewrite)
emoji-editor.tsx            (rewrite)
preview-grid.tsx            (rewrite — sem botões de nav)
export-panel.tsx            (rewrite — só ajuste tipográfico)
```

E delete `mode-selector.tsx` (não é mais importado).

A página em `src/app/ferramentas/gerador-de-favicon/page.tsx` **não muda** — ela continua importando `<FaviconGenerator />` com a mesma assinatura.

## Contratos preservados

- `lib/image/favicon.ts` não é alterado.
- `OptionSwitch`, `Button`, `Input`, `NativeSelect`, `CopyButton` — mesmos imports.
- Testes em `favicon.test.ts` continuam passando (lógica de `generateFaviconPng` / `generateIco` / manifest intacta).

## API interna nova

Cada editor agora recebe:

```ts
interface EditorProps {
  mode: FaviconMode;
  onChangeMode: (m: FaviconMode) => void;   // troca de tab
  onGenerate: (canvas, renderAtSize?) => void;
  footer?: ReactNode;                        // result panel injetado pelo orquestrador
}
```

E renderiza um `<FaviconShell>` com slots `left` / `center` / `right` / `footer`.

## Sugestões de follow-up

- Em telas estreitas (`< lg`), o layout vira 1 coluna empilhada — considerar drawer para o painel direito.
- O mock de "aba do navegador" no `LivePreview` poderia ganhar variantes (favorito, app icon iOS) atrás de uma tab.
- Adicionar uma seção "histórico" persistindo os últimos 3 favicons gerados em `localStorage`.
