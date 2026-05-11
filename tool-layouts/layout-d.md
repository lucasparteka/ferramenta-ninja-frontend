# Layout D — Análise com Sidebar

> Fonte: `LAYOUT-RESTRUCTURE.md` §"Layout D — Análise com sidebar (NOVO)"
> Design: `DESIGN.md` §12.4

## Quando usar

Ferramentas onde o usuário **cola ou digita conteúdo** e a ferramenta **retorna métricas ou análises** sobre esse conteúdo — sem transformar o texto em outro formato. A sidebar exibe estatísticas em tempo real.

## Grid estrutural (usar `<LayoutD>`)

```tsx
import { LayoutD } from "@/components/shared/layout-d";

<LayoutD
  header={<>
    <div className="flex items-center gap-3">
      <h1 className="text-sm font-semibold tracking-tight">Visualizador de CSV</h1>
      <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">TEMPO REAL</span>
    </div>
    <div className="flex items-center gap-1.5">
      <Button variant="outline" size="sm"><Copy className="mr-1.5 h-3 w-3" />Copiar</Button>
      <Button variant="ghost" size="icon-sm" aria-label="Limpar"><Trash2 className="h-3.5 w-3.5" /></Button>
    </div>
  </>}
  sidebar={<>
    {/* Métricas */}
    {/* Limites */}
    {/* Opções */}
  </>}
  sidebarWidth={240}
>
  <textarea className="flex-1 min-h-[280px] resize-none bg-transparent p-4 text-sm" />
  
  {/* Toolbar inferior */}
  <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2">
    <span className="inline-flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
      <span className="text-[11px] text-muted-foreground">Em tempo real</span>
    </span>
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm"><Clipboard className="mr-1.5 h-3 w-3" />Copiar</Button>
      <Button variant="ghost" size="sm"><Trash2 className="mr-1.5 h-3 w-3" />Limpar</Button>
    </div>
  </div>
</LayoutD>
```

Grid bruto equivalente:

```tsx
<div className="rounded-sm border border-border overflow-hidden flex flex-col md:grid"
     style={{ gridTemplateColumns: "1fr 240px" }}>
```

## Ferramentas mapeadas (2)

| Ferramenta | Rota | Justificativa de layout |
|---|---|---|
| **Visualizador de CSV** | `/ferramentas/visualizador-de-csv` | Usuário cola CSV na área principal → tabela renderizada. Sidebar exibe métricas (linhas, colunas, tipos detectados) e opções de formatação (delimitador, header). |
| **Prévia do Resultado Google** | `/ferramentas/previa-resultado-google` | Área principal com campos de meta tags (título, URL, descrição). Sidebar exibe preview de como aparece no Google (mobile/desktop) e contadores de caracteres (título truncado em ~60, descrição em ~160). |

## Estrutura da sidebar

```tsx
<div className="flex flex-col bg-muted/30 divide-y divide-border overflow-y-auto">

  {/* Seção de métricas */}
  <div className="p-4 space-y-2">
    <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Contagens</h3>
    <div className="flex items-center justify-between py-0.5">
      <span className="text-xs text-muted-foreground">Linhas</span>
      <span className="font-mono text-xs font-medium tabular-nums">142</span>
    </div>
  </div>

  {/* Seção de limite */}
  <div className="p-4 space-y-2">
    <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Limites</h3>
    <div className="flex justify-between mb-1.5">
      <span className="text-xs text-muted-foreground">Título</span>
      <span className="font-mono text-[11px] text-muted-foreground">58 / 60</span>
    </div>
    <div className="h-1 rounded-full bg-border overflow-hidden">
      <div className="h-full rounded-full bg-foreground/70 transition-all" style={{ width: "96%" }} />
    </div>
  </div>

  {/* Seção de opções */}
  <div className="p-4 space-y-3">
    <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Opções</h3>
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">Primeira linha como header</span>
      <button role="switch" aria-checked={true} className="...">{/* toggle */}</button>
    </div>
  </div>

</div>
```

## Anti-padrões a evitar

- ❌ Resultado abaixo do input — sidebar deve estar sempre visível
- ❌ Métricas em fonte sans — todo número/contagem em `font-mono`
- ❌ Botões soltos no meio do conteúdo — ações no header do card
- ❌ Scroll duplo na sidebar — usar `overflow-y-auto` com `divide-y`

## Checklist de implementação

- [ ] Usar componente `<LayoutD>` do `@/components/shared/layout-d`
- [ ] Header do card com título + badge de modo + ações (copiar/limpar)
- [ ] Área principal: textarea ou display de conteúdo com toolbar inferior
- [ ] Sidebar 240px com seções: Métricas → Limites → Opções → Referências
- [ ] Section headers: `text-[10px] font-semibold uppercase tracking-wider text-muted-foreground`
- [ ] Valores de métrica: `font-mono text-xs font-medium tabular-nums`
- [ ] Progress bars para limites: `h-1 rounded-full bg-border` com fill `bg-foreground/70`
- [ ] Toggles customizados (não usar switch do shadcn se não seguir a densidade)
