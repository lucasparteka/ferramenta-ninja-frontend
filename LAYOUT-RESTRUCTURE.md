# LAYOUT-RESTRUCTURE.md

> Este documento complementa o `DESIGN.md` e o `REFACTOR-PLAN.md`.
> Enquanto o REFACTOR-PLAN cobriu ajustes de superfície (tipografia, cor,
> sombra, raio), este documento trata da **reorganização estrutural** das
> ferramentas — disposição de painéis, hierarquia de informação, densidade
> real de UI.
>
> O teste de aprovação é simples: ao abrir a ferramenta, o usuário sente
> que está usando um **instrumento de trabalho**, não um formulário de site.

---

## Por que a refatoração anterior não foi suficiente

O REFACTOR-PLAN corrigiu tokens visuais corretamente. O que não foi feito:

- Ferramentas continuam com layout **vertical empilhado** — área de input
  no topo, resultado/métricas abaixo, espaço vazio à direita.
- A tela não comunica "estou no controle de múltiplos parâmetros ao mesmo
  tempo" — comunica "preenchi um campo e esperei".
- Ferramentas simples (contador de caracteres, conversor de texto) parecem
  incompletas porque não usam o espaço horizontal disponível.

A correção não é adicionar mais conteúdo — é **redistribuir o que já
existe** em uma composição 2D densa.

---

## Os 5 layouts canônicos

O DESIGN.md define A, B e C. Este documento adiciona D e E, e detalha
a implementação estrutural de todos.

| Layout | Nome | Quando usar |
|---|---|---|
| **A** | 3 painéis | Gerador com preview visual em tempo real |
| **B** | Form + resultado | Calculadora com submit explícito |
| **C** | Input ↔ output | Conversor/formatter síncrono |
| **D** | Análise com sidebar | Ferramenta que analisa texto/dado e retorna métricas |
| **E** | Inspector | Busca por ID → ficha de resultado |

---

## Layout A — 3 painéis (geradores com preview)

**Ferramentas:** favicon-generator, custom-qr-code, barcode-generator,
gradient-generator, color-palette, password-generator

### Estrutura obrigatória

```
┌─────────────────────────────────────────────────────────────────────┐
│  [sticky header] Título da ferramenta          [CTA: Gerar / Baixar]│
├──────────────┬─────────────────────────────┬────────────────────────┤
│              │                              │                        │
│  Esquerda    │  Centro (preview vivo)       │  Direita (estilo)      │
│  280px       │  flex-1                      │  300px                 │
│              │                              │                        │
│  ─ MODO      │  ┌──────────────────────┐   │  ─ APARÊNCIA           │
│  ○ Imagem    │  │                      │   │    cor de fundo        │
│  ○ SVG       │  │    preview 1:1       │   │    formato             │
│  ○ Texto     │  │                      │   │    escala              │
│  ○ Emoji     │  └──────────────────────┘   │                        │
│              │                              │  ─ EXPORTAR            │
│  ─ ARQUIVO   │  16px  32px  48px  64px     │    favicon.ico         │
│  logo.svg    │  (grid de tamanhos)          │    favicon-16.png      │
│  32×32       │                              │    apple-touch.png     │
│              │  ─ EM CONTEXTO              │                        │
│  [Trocar]    │  [simulação de browser tab] │  [Gerar pacote]        │
└──────────────┴─────────────────────────────┴────────────────────────┘
```

### Grid

```tsx
<div className="grid grid-cols-[280px_1fr_300px] gap-0 border border-border rounded-lg overflow-hidden">
```

### Painel esquerdo — seleção de modo

- Botões verticais `w-full`, `rounded-md`, estado ativo: `bg-accent text-accent-foreground`
- Section header `MODO` em ALL CAPS
- Abaixo: seção `ARQUIVO` com nome + dimensões em mono + botão `Trocar`
- Padding `p-4`, separações internas com `border-t border-border pt-3 mt-3`

### Painel central — preview

- Fundo `bg-muted/40`
- Canvas centralizado com `aspect-square` ou proporção do output
- Grid de tamanhos abaixo: miniaturas 16, 32, 48, 64px com label em mono
- Seção "Em contexto" abaixo: simulação de browser tab ou ícone em uso real

### Painel direito — controles de estilo

- `bg-card border-l border-border`
- Cada grupo de controles separado por `border-t border-border`
- Sliders: label + valor mono na mesma linha, slider abaixo
- Color field: swatch 32px + input hex mono
- Lista de exportação no rodapé com tamanhos em mono

### Header sticky

```tsx
<div className="sticky top-14 z-10 flex items-center justify-between
                border-b border-border bg-background/90 backdrop-blur
                px-4 py-3">
  <div>
    <h1 className="text-2xl font-semibold tracking-tight">Nome da ferramenta</h1>
    <p className="text-xs text-muted-foreground">Descrição curta</p>
  </div>
  <Button>Gerar / Baixar</Button>
</div>
```

---

## Layout B — Form + resultado (calculadoras)

**Ferramentas:** termination-calculator, salary-calculator, vacation-calculator,
christmas-bonus-calculator, bmi-calculator, compound-interest, fixed-income,
loan-calculator, business-days-calculator, age-calculator, night-allowance,
overtime-calculator, percentage-calculator

### Estrutura obrigatória

```
┌─────────────────────────────────────────────────────────────────────┐
│  [h1] Título                                                        │
│  [p] Descrição curta                                                │
├──────────────────────────────────┬──────────────────────────────────┤
│  Form (esquerda)                 │  Resultado (direita, sticky)     │
│                                  │                                  │
│  ─ DADOS                         │  ─ RESULTADO                     │
│    [Campo 1]                     │                                  │
│    [Campo 2]                     │   R$ 4.280,00                    │
│    [Campo 3]                     │   Valor líquido                  │
│                                  │                                  │
│  ─ PARÂMETROS                    │  ─ DETALHAMENTO                  │
│    [Campo 4]                     │    Salário base   2.000,00       │
│    [Campo 5]                     │    FGTS           1.600,00       │
│                                  │    Aviso prévio     680,00       │
│  [Calcular]                      │                                  │
│                                  │  [Copiar] [Imprimir]             │
└──────────────────────────────────┴──────────────────────────────────┘
```

### Grid

```tsx
<div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
```

### Coluna esquerda — form

- `space-y-6` entre grupos de campos
- Cada grupo: section header ALL CAPS + `space-y-3` entre campos
- Cada campo: `<label>` + `<Input>` em `space-y-1.5`
- CTA `[Calcular]` no rodapé do form — `variant="default"`, `w-full`

### Coluna direita — resultado (sticky)

```tsx
<div className="lg:sticky lg:top-[calc(3.5rem+1px)]">
  <div className="rounded-md border border-border bg-card p-4 space-y-4">
```

- Antes do submit: empty state com `border-dashed` e texto "Preencha os dados para calcular"
- Após submit: valor principal em `text-2xl font-semibold`, label em `text-xs text-muted-foreground`
- Tabela de detalhamento: `divide-y divide-border`
- Cada linha: label `text-xs text-muted-foreground` + valor `font-mono text-xs`
- Botões de ação (copiar, imprimir) em `outline`, `size="sm"`, agrupados no rodapé

### Anti-padrão a corrigir

❌ Resultado aparece **abaixo** do form — o usuário precisa rolar para ver
o resultado enquanto ainda quer ajustar campos.

✅ Resultado em coluna **direita sticky** — visível enquanto o usuário edita.

---

## Layout C — Input ↔ output (conversores)

**Ferramentas:** base64, binary-converter, morse-converter, text-converter,
url-encoder, timestamp-converter, csv-json, json-formatter, css-minifier,
markdown-to-html, text-cipher, hash-generator, image-base64

### Estrutura obrigatória

```
┌──────────────────────────────┬──────────────────────────────────────┐
│  ENTRADA             [Limpar]│  SAÍDA                    [Copiar]   │
│  [seletor de formato]        │  [seletor de formato / info]         │
├──────────────────────────────┼──────────────────────────────────────┤
│                              │                                      │
│  <textarea>                  │  <pre> ou <textarea readonly>        │
│  (editável)                  │  (só leitura, bg-muted/30)           │
│                              │                                      │
│                              │                                      │
└──────────────────────────────┴──────────────────────────────────────┘
│  [metadados: tamanho original · tamanho resultado · ratio]         │
└─────────────────────────────────────────────────────────────────────┘
```

### Grid

```tsx
<div className="grid grid-cols-1 gap-0 border border-border rounded-lg
                overflow-hidden md:grid-cols-2">
```

### Header de cada coluna

```tsx
<div className="flex items-center justify-between border-b border-border
                bg-muted/40 px-3 py-2">
  <span className="text-[11px] font-semibold uppercase tracking-wider
                   text-muted-foreground">
    Entrada
  </span>
  <div className="flex items-center gap-2">
    {/* seletor de formato se aplicável */}
    <Button variant="ghost" size="icon-sm">
      <X className="h-3.5 w-3.5" />
    </Button>
  </div>
</div>
```

### Textareas

```tsx
<textarea
  className="h-64 w-full resize-none bg-transparent p-3 font-mono
             text-sm text-foreground placeholder:text-muted-foreground
             focus:outline-none"
/>
```

- Sem border (já tem o grid)
- Saída: `bg-muted/20 cursor-default select-all`
- Atualização síncrona — **sem botão "Converter"**

### Rodapé de metadados

```tsx
<div className="border-t border-border bg-muted/40 px-4 py-2">
  <div className="flex items-center gap-4">
    <span className="font-mono text-[11px] text-muted-foreground">
      {inputBytes} bytes
    </span>
    <span className="text-[11px] text-muted-foreground">→</span>
    <span className="font-mono text-[11px] text-muted-foreground">
      {outputBytes} bytes
    </span>
    <span className="font-mono text-[11px] text-muted-foreground ml-auto">
      {ratio}× {compressed ? "redução" : "expansão"}
    </span>
  </div>
</div>
```

### Botão de swap (quando aplicável)

Para conversores bidirecionais (morse, base64, binary):

```tsx
<div className="relative hidden md:flex items-center justify-center">
  <button
    className="absolute z-10 rounded-md border border-border bg-card
               p-1.5 text-muted-foreground hover:text-foreground
               hover:bg-muted transition-colors"
    onClick={swap}
    aria-label="Inverter direção"
  >
    <ArrowLeftRight className="h-3.5 w-3.5" />
  </button>
</div>
```

---

## Layout D — Análise com sidebar (NOVO)

**Ferramentas:** character-counter, text-diff, text-cleaner,
remove-duplicates, whatsapp-formatter, typing-test, text-generator,
random-picker

### Quando usar

Ferramenta onde o usuário **cola ou digita conteúdo** e a ferramenta
**retorna métricas ou análises** sobre esse conteúdo — sem transformar
o texto em outro formato.

### Estrutura obrigatória

```
┌─────────────────────────────────────────────────────────────────────┐
│ breadcrumb  │  título-da-ferramenta           [badge modo] [ações]  │
├─────────────────────────────────────────────┬───────────────────────┤
│                                             │                       │
│  Área de conteúdo principal (flex-1)        │  Sidebar (240px)      │
│                                             │                       │
│  <textarea> ou output processado            │  ─ MÉTRICAS           │
│                                             │    Chave    valor     │
│                                             │    Chave    valor     │
│                                             │                       │
│                                             │  ─ LIMITES            │
│                                             │    [progress bar]     │
│                                             │                       │
│                                             │  ─ OPÇÕES             │
│                                             │    [toggles]          │
│                                             │                       │
│  [toolbar: status · metadados · ações]      │  ─ REFERÊNCIAS        │
└─────────────────────────────────────────────┴───────────────────────┘
```

### Grid

> **Use o componente `<LayoutD>` em vez de escrever o grid manualmente.**
> Ele está em `@/components/shared/layout-d` e encapsula o container,
> o header e a sidebar. Veja a API abaixo.

```tsx
import { LayoutD } from "@/components/shared/layout-d";

<LayoutD
  header={<>
    <div className="flex items-center gap-3">{/* título + badge */}</div>
    <div className="flex items-center gap-1.5">{/* ações */}</div>
  </>}
  sidebar={<>{/* seções da sidebar */}</>}
  sidebarWidth={240}        {/* opcional — default 240 */}
  mainAreaClassName=""      {/* opcional — ex: "relative" */}
>
  {/* área principal + toolbar inferior */}
</LayoutD>
```

O grid bruto equivalente, para referência:

```tsx
<div className="rounded-sm border border-border overflow-hidden
                flex flex-col md:grid"
     style={{ gridTemplateColumns: "1fr 240px" }}>
```

### Área principal

```tsx
<div className="flex flex-col border-r border-border">
  {/* textarea ou display de conteúdo */}
  <textarea
    className="flex-1 min-h-[280px] resize-none bg-transparent
               p-4 text-sm text-foreground placeholder:text-muted-foreground
               focus:outline-none"
  />

  {/* toolbar inferior */}
  <div className="flex items-center justify-between border-t border-border
                  bg-muted/40 px-4 py-2">
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
        <span className="text-[11px] text-muted-foreground">Em tempo real</span>
      </span>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm">
        <Clipboard className="mr-1.5 h-3 w-3" />
        Copiar
      </Button>
      <Button variant="ghost" size="sm">
        <Trash2 className="mr-1.5 h-3 w-3" />
        Limpar
      </Button>
    </div>
  </div>
</div>
```

### Sidebar

```tsx
<div className="flex flex-col bg-muted/30 divide-y divide-border overflow-y-auto">

  {/* seção de métricas */}
  <div className="p-4 space-y-2">
    <h3 className="text-[10px] font-semibold uppercase tracking-wider
                   text-muted-foreground mb-3">
      Contagens
    </h3>
    {metrics.map(m => (
      <div key={m.key} className="flex items-center justify-between py-0.5">
        <span className="text-xs text-muted-foreground">{m.label}</span>
        <span className="font-mono text-xs font-medium tabular-nums">
          {m.value}
        </span>
      </div>
    ))}
  </div>

  {/* seção de limite (opcional) */}
  <div className="p-4 space-y-2">
    <h3 className="text-[10px] font-semibold uppercase tracking-wider
                   text-muted-foreground mb-3">
      Limites
    </h3>
    <div className="flex justify-between mb-1.5">
      <span className="text-xs text-muted-foreground">{limitName}</span>
      <span className="font-mono text-[11px] text-muted-foreground">
        {current} / {max}
      </span>
    </div>
    <div className="h-1 rounded-full bg-border overflow-hidden">
      <div
        className="h-full rounded-full bg-foreground/70 transition-all"
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
    <span className="font-mono text-[10px] text-muted-foreground">
      {remaining} restantes
    </span>
  </div>

  {/* seção de opções */}
  <div className="p-4 space-y-3">
    <h3 className="text-[10px] font-semibold uppercase tracking-wider
                   text-muted-foreground mb-3">
      Opções
    </h3>
    {options.map(opt => (
      <div key={opt.key} className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{opt.label}</span>
        <button
          role="switch"
          aria-checked={opt.value}
          onClick={() => opt.toggle()}
          className={cn(
            "relative h-4 w-7 rounded-full transition-colors",
            opt.value ? "bg-foreground/80" : "bg-border"
          )}
        >
          <span className={cn(
            "absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all",
            opt.value ? "left-[14px]" : "left-0.5"
          )} />
        </button>
      </div>
    ))}
  </div>

  {/* seção de referências (opcional) */}
  <div className="p-4 space-y-2 mt-auto">
    <h3 className="text-[10px] font-semibold uppercase tracking-wider
                   text-muted-foreground mb-3">
      Referências
    </h3>
    {references.map(ref => (
      <div key={ref.label} className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{ref.label}</span>
        <span className="font-mono text-[11px] bg-card border border-border
                         rounded px-1.5 py-0.5 text-muted-foreground">
          {ref.limit}
        </span>
      </div>
    ))}
  </div>

</div>
```

### Header da ferramenta (no topo do card, não sticky)

```tsx
<div className="flex items-center justify-between border-b border-border
                px-4 py-2.5 col-span-full">
  <div className="flex items-center gap-3">
    {/* breadcrumb opcional em telas grandes */}
    <h1 className="text-sm font-semibold tracking-tight">
      Contador de caracteres
    </h1>
    <span className="rounded border border-border px-1.5 py-0.5
                     font-mono text-[10px] text-muted-foreground">
      TEMPO REAL
    </span>
  </div>
  <div className="flex items-center gap-2">
    <Button variant="outline" size="sm">
      <Copy className="mr-1.5 h-3 w-3" />
      Copiar
    </Button>
    <Button variant="ghost" size="icon-sm" aria-label="Limpar">
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  </div>
</div>
```

---

## Layout E — Inspector (busca por ID)

**Ferramentas:** consulta-cep, consulta-cnpj, tabela-fipe, decodificador-pix,
validador-boleto

### Estrutura obrigatória

```
┌─────────────────────────────────────────────────────────────────────┐
│  [h1] Consulta de CNPJ                                              │
│  [p] Descrição                                                      │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────┐  [Consultar]          │
│  │  00.000.000/0000-00                      │                       │
│  └─────────────────────────────────────────┘                       │
├─────────────────────────────────────────────────────────────────────┤
│  [estado: vazio / loading / resultado / erro]                       │
│                                                                     │
│  IDENTIFICAÇÃO              │  CONTATO                             │
│  Razão social   Valor       │  Telefone   Valor                    │
│  CNPJ           00.000…     │  Email      Valor                    │
│  Situação       ● Ativa     │  Site       Valor                    │
│                             │                                      │
│  ENDEREÇO                   │  ATIVIDADE                           │
│  Logradouro     Valor       │  CNAE       00.00-0                  │
│  Município/UF   Valor       │  Descrição  Valor                    │
└─────────────────────────────────────────────────────────────────────┘
```

### Search bar

```tsx
<div className="flex gap-2">
  <Input
    value={query}
    onChange={e => setQuery(e.target.value)}
    placeholder="00.000.000/0000-00"
    className="font-mono"
    onKeyDown={e => e.key === "Enter" && handleSearch()}
  />
  <Button onClick={handleSearch} disabled={loading}>
    {loading
      ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
      : <Search className="mr-2 h-3.5 w-3.5" />
    }
    {loading ? "Consultando..." : "Consultar"}
  </Button>
</div>
```

### Grid de resultado

```tsx
<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
  {sections.map(section => (
    <div key={section.title}
         className="rounded-md border border-border bg-card">
      <div className="border-b border-border px-4 py-2">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider
                       text-muted-foreground">
          {section.title}
        </h3>
      </div>
      <div className="divide-y divide-border">
        {section.rows.map(row => (
          <div key={row.label}
               className="flex items-start justify-between px-4 py-2.5">
            <span className="text-xs text-muted-foreground min-w-[100px]">
              {row.label}
            </span>
            <span className={cn(
              "text-xs text-right",
              row.mono && "font-mono"
            )}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>
```

### Estados

```tsx
{/* Vazio */}
<div className="flex min-h-[200px] flex-col items-center justify-center
                gap-2 rounded-md border border-dashed border-border
                bg-muted/30 text-center p-8">
  <Search className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
  <p className="text-sm text-foreground">Digite um CNPJ para consultar</p>
  <p className="text-xs text-muted-foreground">
    Dados da Receita Federal · atualização diária
  </p>
</div>

{/* Loading */}
<div className="flex min-h-[200px] items-center justify-center
                rounded-md border border-border bg-muted/20">
  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
</div>

{/* Erro */}
<div className="rounded-md border border-destructive/30
                bg-destructive/5 p-4">
  <div className="flex items-start gap-2">
    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
    <p className="text-xs text-destructive">
      CNPJ não encontrado ou inválido.
    </p>
  </div>
</div>
```

---

## Mapeamento por ferramenta

Aplique o layout indicado. Ferramentas marcadas com ⚡ têm maior impacto
visual e devem ser priorizadas.

### Geradores (Layout A)

| Ferramenta | Layout atual | Layout alvo | Principal mudança |
|---|---|---|---|
| ⚡ favicon-generator | A (parcial) | A | Sticky header + grid cols fixos |
| ⚡ custom-qr-code | A (parcial) | A | Painel direito com seções separadas |
| qr-generator | vertical | A | Criar 3 painéis |
| pix-qr | vertical | A | Criar 3 painéis |
| wifi-qr | vertical | A | Criar 3 painéis |
| ⚡ barcode-generator | vertical | A | Criar 3 painéis |
| gradient-generator | A (parcial) | A | Extrair controles para painel direito |
| color-palette | vertical | A | Preview central + controles direita |
| box-shadow | vertical | C | Input CSS ↔ preview visual |
| password-generator | vertical | B | Form esquerda + resultado sticky direita |

### Calculadoras (Layout B)

| Ferramenta | Layout atual | Layout alvo | Principal mudança |
|---|---|---|---|
| ⚡ termination-calculator | vertical | B | Resultado em sticky sidebar direita |
| salary-calculator | vertical | B | idem |
| vacation-calculator | vertical | B | idem |
| christmas-bonus-calculator | vertical | B | idem |
| compound-interest | vertical | B | Resultado com gráfico na sidebar |
| fixed-income | vertical | B | idem |
| loan-calculator | vertical | B | Tabela de amortização no resultado |
| percentage-calculator | vertical | B | Resultado imediato à direita |
| bmi-calculator | vertical | B | Resultado com classificação na sidebar |
| age-calculator | vertical | B | Resultado com detalhamento na sidebar |
| business-days-calculator | vertical | B | idem |
| night-allowance | vertical | B | idem |
| overtime-calculator | vertical | B | idem |

### Conversores (Layout C)

| Ferramenta | Layout atual | Layout alvo | Principal mudança |
|---|---|---|---|
| ⚡ base64 | C (parcial) | C | Header por coluna + metadados no rodapé |
| binary-converter | vertical | C | 2 colunas com swap button |
| morse-converter | vertical | C | idem |
| url-encoder | vertical | C | Header encode/decode + swap |
| ⚡ json-formatter | C (parcial) | C | Header com opções + monaco-like |
| csv-json | vertical | C | Header CSV ↔ JSON |
| markdown-to-html | vertical | C | Markdown ↔ HTML preview |
| hash-generator | vertical | C | Input + múltiplos outputs (MD5, SHA…) |
| text-cipher | vertical | C | Input + encrypted output |
| css-minifier | vertical | C | Original ↔ Minificado |
| image-base64 | vertical | C | Preview imagem ↔ string base64 |
| timestamp-converter | vertical | C | Unix ↔ data legível |
| temperature-converter | vertical | C | Input + outputs simultâneos |
| unit-converter | vertical | C | idem |

### Análise de texto (Layout D — NOVO)

| Ferramenta | Layout atual | Layout alvo | Principal mudança |
|---|---|---|---|
| ⚡ character-counter | empilhado | D | Sidebar com métricas + limites |
| text-diff | lado a lado | D | 2 textareas + sidebar com estatísticas |
| text-cleaner | vertical | D | Textarea + sidebar com opções de limpeza |
| remove-duplicates | vertical | D | Textarea + sidebar com contagem |
| whatsapp-formatter | vertical | D | Textarea + preview WhatsApp na sidebar |
| typing-test | vertical | D | Display de texto + sidebar com stats |
| text-generator | vertical | D | Opções na sidebar + output principal |
| random-picker | vertical | D | Lista na área principal + sidebar opções |

### Inspetores (Layout E)

| Ferramenta | Layout atual | Layout alvo | Principal mudança |
|---|---|---|---|
| ⚡ consulta-cnpj | vertical | E | Search bar compacta + resultado em grid |
| consulta-cep | vertical | E | idem |
| tabela-fipe | vertical | E | Seletores em cascata + ficha de resultado |
| decodificador-pix | vertical | E | Input código + ficha decodificada |
| validador-boleto | vertical | E | Input boleto + ficha de validação |

---

## Padrões compartilhados (todos os layouts)

### Header interno do card-ferramenta

Todo tool card começa com uma barra de header interno que ancora a
identidade da ferramenta e as ações principais:

```tsx
<div className="flex items-center justify-between border-b border-border
                px-4 py-2.5">
  <div className="flex items-center gap-3">
    <span className="text-sm font-semibold">{toolName}</span>
    {badge && (
      <span className="rounded border border-border px-1.5 py-px
                       font-mono text-[10px] text-muted-foreground">
        {badge}
      </span>
    )}
  </div>
  <div className="flex items-center gap-1.5">
    {actions}
  </div>
</div>
```

### Section headers internos

Toda divisão interna de painel usa o mesmo padrão do DESIGN.md:

```tsx
<h3 className="text-[10px] font-semibold uppercase tracking-wider
               text-muted-foreground">
  Nome da Seção
</h3>
```

### Métricas numéricas

Todo número que importa — contagens, tamanhos, IDs, dimensões:

```tsx
<span className="font-mono text-xs tabular-nums">{value}</span>
```

### Separadores internos de painel

```tsx
{/* entre seções verticais */}
<div className="border-t border-border" />

{/* entre colunas horizontais */}
<div className="border-r border-border" />

{/* usando divide no container */}
<div className="divide-y divide-border">
```

### Rodapés de painel com metadados

```tsx
<div className="flex items-center justify-between border-t border-border
                bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground">
  <div className="flex items-center gap-3 font-mono">
    <span>{bytes} bytes</span>
    <span>·</span>
    <span>{chars} caracteres</span>
  </div>
  <span>Atualizado agora</span>
</div>
```

### Container unificado (obrigatório em layouts A, C, D)

O grid da ferramenta nunca tem gap-*. O espaçamento visual entre painéis vem exclusivamente de bordas.

```tsx
<div className="rounded-lg border border-border overflow-hidden grid ...">
```

overflow-hidden no container garante que os painéis filhos não "vazem" os cantos arredondados — sem ele, os border-r internos criam cantos retos conflitando com o rounded-lg externo.

---

## Ordem de prioridade de implementação

Priorize pelo impacto visual × volume de usuários:

1. **character-counter** — representa 20+ ferramentas de texto; serve como template do Layout D
2. **termination-calculator** — calculadora mais acessada; serve como template do Layout B
3. **base64** / **json-formatter** — conversores mais usados; template do Layout C
4. **consulta-cnpj** / **consulta-cep** — inspetores; template do Layout E
5. **favicon-generator** / **custom-qr-code** — geradores; Layout A já parcialmente correto
6. Replicar padrão nas ferramentas restantes da mesma categoria

---

## Critérios de aprovação por ferramenta

Para cada ferramenta reestruturada, confirme:

- [ ] Está no layout canônico correto (A/B/C/D/E)
- [ ] Não há scroll desnecessário para ver resultado + controles simultaneamente
- [ ] Espaço horizontal está sendo usado (sem coluna única em desktop)
- [ ] Números de métrica em `font-mono tabular-nums`
- [ ] Section headers em ALL CAPS `text-[10px] tracking-wider`
- [ ] Separações internas com `border` (não sombra, não `gap` vazio)
- [ ] Ações secundárias no header do card (não botões soltos no meio do conteúdo)
- [ ] Resultado visível sem scroll enquanto o usuário ainda edita input
- [ ] Um desenvolvedor externo diria "parece Linear/Vercel/Figma"