# Análise de Layouts e Componentes Reutilizáveis

## Visão Geral

Os 4 layouts compartilhados são utilizados por 32 ferramentas. Esta análise identificou padrões estruturais repetidos que não haviam sido extraídos em componentes compartilhados.

---

## Mapa: layouts → ferramentas

| Layout | Tools (count) | Uso típico |
|--------|--------------|------------|
| **LayoutB** | 1 | Form + painel de resultado sticky 360px |
| **LayoutC** | 16 | Split-pane esquerda/direita com toolbar e footer opcionais |
| **LayoutD** | 9 | Header + conteúdo principal + sidebar configurável |
| **LayoutE** | 6 | Searchbar + estados (empty/loading/error/result) |

### LayoutC (16 tools)
`json-formatter`, `base64`, `morse-converter`, `binary-converter`, `text-cipher`, `text-converter`, `unit-converter`, `temperature-converter`, `numero-por-extenso`, `image-base64`, `hash-generator`, `markdown-to-html`, `timestamp-converter`, `csv-json`, `css-minifier`, `url-encoder`

### LayoutD (9 tools)
`character-counter`, `text-generator`, `text-diff`, `text-cleaner`, `csv-viewer`, `random-picker`, `google-preview`, `whatsapp-formatter`, `remove-duplicates`

### LayoutE (6 tools)
`consulta-cep`, `consulta-cnpj`, `validador-boleto`, `tabela-fipe`, `credit-card-validator`, `decodificador-pix`

---

## Componentes shared existentes

| Componente | Usado em | Função |
|-----------|----------|--------|
| `PaneHeader` | LayoutC tools (left/right) | Header de painel: title + badge + actions |
| `StatusBar` + `StatusDot` | LayoutC e LayoutD tools | Barra de status/rodapé |
| `OptionSwitch` | Vários | Seletor de modo segmentado |
| `SwitchRow` | Vários | Toggle com label |
| `RadioRow` | Vários | Radio com label |
| `NumberStepper` | Vários | Input numérico com +/- |
| `CopyButton` | Vários | Botão de copiar texto |

---

## Padrões repetidos identificados (não extraídos)

### Padrão A — Header do LayoutD

Código **idêntico** repetido nas 9 ferramentas que usam LayoutD:

```tsx
// Repetido em character-counter.tsx, text-generator.tsx, text-diff.tsx, etc.
header={
  <>
    <div className="flex items-center gap-3">
      <h1 className="text-sm font-semibold tracking-tight">{título}</h1>
      <span className="rounded border border-border px-1.5 py-px font-mono text-[10px] text-muted-foreground">
        {badge}
      </span>
    </div>
    <div className="flex items-center gap-1.5">
      {/* botões de ação variam por ferramenta */}
    </div>
  </>
}
```

**Impacto:** 9 arquivos × ~15 linhas duplicadas = ~135 linhas eliminadas pelo novo `ToolHeader`.

---

### Padrão B — Seções da sidebar do LayoutD

Cada seção de sidebar usa este wrapper (~15+ ocorrências em 9 ferramentas):

```tsx
// Repetido em text-generator.tsx (3×), text-diff.tsx (2×), csv-viewer.tsx (3×), etc.
<div className="p-4 space-y-2">
  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
    {título da seção}
  </h3>
  {children}
</div>
```

**Impacto:** ~20+ ocorrências eliminadas pelo novo `SidebarSection`.

---

### Padrão C — Status bar manual no TextGenerator

`text-generator.tsx:219-237` reimplementa manualmente o comportamento de `<StatusBar>` sem usar o componente existente:

```tsx
// NÃO usa StatusBar — código manual que duplica o componente
<div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2">
  <span className="inline-flex items-center gap-1.5">
    <span className={`h-1.5 w-1.5 rounded-full ${output ? "bg-green-600" : "bg-foreground/30"}`} />
    <span className="text-[11px] text-muted-foreground">{output ? "Gerado" : "Aguardando"}</span>
  </span>
  ...
</div>
```

**Problema:** Usa `bg-green-600` hardcoded em vez do token `bg-success`, divergindo do design system.

---

## Resolução implementada

### 1. Novo: `src/components/shared/tool-header.tsx`

```tsx
type ToolHeaderProps = {
  title: string;
  badge?: ReactNode;
  actions?: ReactNode;
};

export function ToolHeader({ title, badge, actions }: ToolHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold tracking-tight">{title}</h1>
        {badge && (
          <span className="rounded border border-border px-1.5 py-px font-mono text-[10px] text-muted-foreground">
            {badge}
          </span>
        )}
      </div>
      {actions && <div className="flex items-center gap-1.5">{actions}</div>}
    </>
  );
}
```

Usado via: `<LayoutD header={<ToolHeader title="..." badge="..." actions={...} />} ...>`

---

### 2. Novo: `src/components/shared/sidebar-section.tsx`

```tsx
type SidebarSectionProps = {
  title: string;
  children: ReactNode;
};

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="p-4 space-y-2">
      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}
```

---

### 3. Correção: `text-generator` — usar `StatusBar`

Substituído o bloco manual pelo componente compartilhado, corrigindo também o token de cor (`bg-success` via `variant: "success"` em vez de `bg-green-600`).

---

## O que NÃO foi extraído (e por quê)

| Candidato | Motivo para não extrair |
|-----------|------------------------|
| Conteúdo left/right do LayoutC | Muito variado: textarea, file dropzone, editor Tiptap, preview HTML, syntax highlight — uma abstração genérica só adicionaria indireção sem reduzir complexidade |
| Estados do LayoutE | Defaults já estão encapsulados no próprio LayoutE; customizações são casos específicos de cada tool |
| `SectionLabel` de `layout-b/` | Usada apenas pelo LayoutB (1 tool) — não justifica mover para shared agora |
| LayoutB completo | Apenas 1 ferramenta; sem padrão repetido com outras |
