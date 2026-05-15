# Layout C — Input ↔ Output (Conversores Síncronos)

> Fonte: `LAYOUT-RESTRUCTURE.md` §"Layout C — Input ↔ output (conversores)"
> Design: `DESIGN.md` §11.2.C, §12.3
> Implementação de referência: `src/components/tools/base64/base64.tsx`

## Quando usar

Ferramentas de **conversão/formatação síncrona** — o usuário digita/coloca conteúdo de um lado e o resultado aparece do outro **sem botão de submit**. A transformação é imediata ao digitar. Ou, no caso de conversores com arquivo, o upload dispara o processamento automaticamente.

---

## Infraestrutura existente

| Componente | Arquivo | Status |
|---|---|---|
| `<LayoutC>` | `src/components/shared/layout-c.tsx` | Implementado e funcional — grid `md:grid-cols-2` com `left`, `right`, `toolbar`, `footer`, `swapButton` |
| `<PaneHeader>` | `src/components/shared/pane-header.tsx` | Implementado — header de coluna com label ALL CAPS + ações |
| `<StatusBar>` | `src/components/shared/status-bar.tsx` | Implementado — toolbar inferior com métricas mono e status dot |
| `<CopyButton>` | `src/components/shared/copy-button.tsx` | Implementado — botão de copiar com feedback |
| `<OptionSwitch>` | `src/components/shared/option-switch.tsx` | Implementado — toggle segmentado para opções no toolbar |
| shadcn UI | `src/components/ui/` | Base disponível (Button, Input, Textarea) |

### Template canônico implementado

O `base64.tsx` é a **implementação de referência** oficial do Layout C. Ele demonstra:

- Uso correto de `<LayoutC>` com `toolbar`, `left`, `right`, `swapButton`, `footer`
- Toolbar superior com `<OptionSwitch>` para "Direção" e "Variante"
- Header por coluna via `<PaneHeader>` (Entrada/Saída)
- Textarea na esquerda com `bg-transparent`, `border-0`, `font-mono`
- Área de resultado na direita com `bg-muted/20`, `select-all`, `pre`/`code`
- Swap button central (`ArrowLeftRight`) para bidirecional
- Footer com `<StatusBar>` — métricas em mono, status dot, checksum

---

## Grid estrutural (usar `<LayoutC>`)

```tsx
import { LayoutC } from "@/components/shared/layout-c";

<LayoutC
  toolbar={
    <>
      <div className="flex items-center gap-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Direção
        </span>
        <OptionSwitch
          options={[{ label: "Codificar", value: "encode" }, { label: "Decodificar", value: "decode" }]}
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          size="sm"
        />
      </div>
      <span className="font-mono text-[11px] text-muted-foreground">UTF-8</span>
    </>
  }
  left={
    <>
      <PaneHeader
        title="Entrada · Texto"
        actions={<>
          <Button variant="ghost" size="icon-sm" aria-label="Limpar"><Trash2 className="h-3.5 w-3.5" /></Button>
        </>}
      />
      <textarea className="flex-1 min-h-[280px] resize-none bg-transparent p-3 font-mono text-sm" />
    </>
  }
  right={
    <>
      <PaneHeader
        title={<>
          Saída · Base64
          {result.output && (
            <span className="rounded border border-success/40 bg-success/10 px-1.5 py-px font-mono text-[10px] text-success">
              Pronto
            </span>
          )}
        </>}
        actions={<CopyButton text={result.output} disabled={!result.output} variant="ghost" size="icon-sm" iconOnly />}
      />
      <div className="flex-1 min-h-[280px] bg-muted/20 p-3">
        <pre className="font-mono text-sm whitespace-pre-wrap break-all select-all">{result.output}</pre>
      </div>
    </>
  }
  swapButton={
    <button
      type="button"
      onClick={handleSwap}
      disabled={!result.output}
      className="rounded-full border border-border bg-card p-1.5 text-muted-foreground transition-colors shadow-sm hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
      aria-label="Inverter entrada e saída"
    >
      <ArrowLeftRight className="h-3.5 w-3.5" />
    </button>
  }
  footer={
    <StatusBar
      items={[
        { label: "", value: input ? `Codificado em ${timeMs.toFixed(1)}ms` : "Aguardando", mono: true },
        { label: "Entrada", value: `${inputLen} chars · ${inputBytes} bytes`, mono: true },
        { label: "Saída", value: `${outputLen} chars${ratio ? ` · +${ratio}%` : ""}`, mono: true },
        { label: "cs", value: checksum || "—", mono: true },
      ]}
      right={<span className="font-mono text-[11px] text-muted-foreground">RFC 4648</span>}
    />
  }
/>
```

---

## Ferramentas mapeadas (16)

### ✅ Já implementadas em Layout C

| Ferramenta | Rota | Estado | Problemas |
|---|---|---|---|
| **Base64** | `/ferramentas/base64` | ✅ Referência | — |
| **Código Binário** | `/ferramentas/codigo-binario` | ✅ Layout C | `bg-green-600` hardcoded no status dot |
| **Código Morse** | `/ferramentas/codigo-morse` | ✅ Layout C | `bg-green-600` hardcoded; footer inline (não usa `<StatusBar>`) |
| **Codificador de URL** | `/ferramentas/codificador-de-url` | ✅ Layout C | `bg-green-600` hardcoded; footer inline |
| **Conversor de Timestamp** | `/ferramentas/converter-timestamp` | ✅ Layout C | `bg-green-600` hardcoded; footer inline; left column usa inputs nativos (não textarea) — aceitável |
| **Conversor CSV ↔ JSON** | `/ferramentas/conversor-csv-json` | ✅ Layout C | `bg-green-600` hardcoded; footer inline; tabela extra abaixo do grid quebra o container unificado |
| **Minificador CSS/JS/HTML** | `/ferramentas/minificador-css` | ✅ Layout C | `bg-green-600` hardcoded; footer inline |
| **Markdown → HTML** | `/ferramentas/converter-markdown-para-html` | ✅ Layout C | `bg-green-600` hardcoded; footer inline; preview usa `bg-card` em vez de `bg-muted/20` |
| **Criptografia de Texto** | `/ferramentas/criptografia-de-texto` | ✅ Layout C | `bg-green-600` hardcoded; footer inline; senha inline no header esquerdo — aceitável |
| **Gerador de Hash** | `/ferramentas/gerador-de-hash` | ✅ Layout C | **Botão "Calcular Hash" no footer** — viola princípio síncrono; `bg-green-600` hardcoded; footer inline; seção de verificação no painel direito — aceitável como extra |

### ❌ Ainda em layout vertical (precisam migrar)

| Ferramenta | Rota | Estado | Principal mudança |
|---|---|---|---|
| **Formatador JSON** | `/ferramentas/formatar-json` | ❌ Vertical | Input textarea esquerda → output formatado direita. Toolbar com indentação. Sem botão de submit. |
| **Conversor de Texto** | `/ferramentas/conversor-de-texto` | ❌ Vertical | Textarea esquerda → resultado direita. Botões de transformação no toolbar superior. |
| **Conversor de Temperatura** | `/ferramentas/conversor-de-temperatura` | ❌ Vertical | Input valor + escala origem esquerda → todas as escalas direita. |
| **Conversor de Unidades** | `/ferramentas/conversor-de-unidades` | ❌ Vertical | Input valor + unidade origem esquerda → resultado + unidade destino direita. |
| **Número por Extenso** | `/ferramentas/numero-por-extenso` | ❌ Vertical | Input numérico esquerda → texto por extenso direita. |
| **Imagem → Base64** | `/ferramentas/converter-imagem-para-base64` | ❌ Vertical | Upload/URL esquerda → preview + string base64 direita. |

---

## Análise detalhada — ferramentas que precisam migrar

### 1. Formatador JSON

**Arquivo:** `src/components/tools/json-formatter/json-formatter.tsx`
**Estado atual:** Layout 100% vertical — label + textarea → botões (Minificar, Limpar, toggle 2/4) → resultado em `<pre>` abaixo.

#### Problemas identificados

| Problema | Severidade | Onde |
|---|---|---|
| Layout vertical empilhado — resultado fica abaixo do input | 🔴 Alta | Estrutura geral |
| Botão "Minificar" com submit explícito | 🟡 Média | Deveria ser síncrono (colar → formatar automaticamente) |
| Toggle 2/4 espaços em botões `variant="default"` | 🟡 Média | Pode haver conflito com "um default por tela" |
| Resultado com `border border-input bg-card` | 🟢 Baixa | Deveria usar `bg-muted/20` |
| Label "Cole seu JSON aqui" em `text-sm font-medium` | 🟢 Baixa | Deveria ser ALL CAPS `text-[11px]` no header do painel |
| `dangerouslySetInnerHTML` para syntax highlight | 🟢 Baixa | Aceitável para esse caso, mas sem escaping manual de `"` — verificar se `highlightJSON` escapa corretamente |

#### Estrutura proposta

```
┌────────────────────────────────────────────┬────────────────────────────────────────────┐
│ [toolbar] JSON             Formatar · Minif│                                    [copiar]│
├────────────────────────────────────────────┼────────────────────────────────────────────┤
│ ENTRADA                          [limpar]  │ SAÍDA                              [copiar]│
│                                            │                                            │
│ <textarea> JSON bruto/minificado           │ <pre> JSON formatado com syntax highlight  │
│                                            │                                            │
├────────────────────────────────────────────┼────────────────────────────────────────────┤
│ [rodapé] · 142 bytes · 8 linhas · válido   │ [rodapé] · 142 bytes · 8 linhas · válido   │
└────────────────────────────────────────────┴────────────────────────────────────────────┘
```

#### Tarefas de refatoração

- [ ] Envolver componente em `<LayoutC>` com `left`, `right`, `toolbar`, `footer`
- [ ] **Toolbar superior:**
  - Label "FORMATO" + toggle "Formatar" / "Minificar" (determina se o output é indentado ou minificado)
  - Toggle indentação: "2" / "4" (aparece apenas no modo "Formatar")
  - Botão "Carregar arquivo" (opcional)
- [ ] **Painel esquerdo (ENTRADA):**
  - `<PaneHeader title="Entrada" actions={<limpar />} />`
  - Textarea com `font-mono`, `bg-transparent`, `min-h-[280px]`
  - Parse automático ao digitar (síncrono)
- [ ] **Painel direito (SAÍDA):**
  - `<PaneHeader title="Saída" actions={<copiar />} />`
  - `<pre>` com `bg-muted/20`, `font-mono`, `select-all`, syntax highlight
  - Estado vazio: placeholder "O JSON formatado aparecerá aqui..."
  - Estado erro: mensagem de erro com linha/coluna em `text-destructive`
- [ ] **Footer:** `<StatusBar>` com:
  - Status dot + label (Válido / Inválido / Aguardando)
  - Métricas mono: bytes de entrada, bytes de saída, linhas
- [ ] Remover botão "Minificar" como ação isolada — transformar em modo do output
- [ ] Remover `font-bold` do `SeoContent` da page

---

### 2. Conversor de Texto

**Arquivo:** `src/components/tools/text-converter/text-converter.tsx`
**Arquivos filhos:** `text-input.tsx`, `text-actions.tsx`, `text-output.tsx`
**Estado atual:** Layout vertical — input → botões de ação (uppercase, lowercase, etc.) → output.

#### Problemas identificados

| Problema | Severidade | Onde |
|---|---|---|
| Layout vertical empilhado | 🔴 Alta | Estrutura geral |
| Botões de ação no **meio** do conteúdo (entre input e output) | 🔴 Alta | `TextActions` — viola DESIGN.md: ações no header |
| Output é editável (`onChange` no `TextOutput`) | 🟡 Média | Deveria ser `readonly` ou `select-all` como todo conversor C |
| Não usa `font-mono` para texto técnico | 🟡 Média | `text-input.tsx` e `text-output.tsx` |

#### Estrutura proposta

```
┌────────────────────────────────────────────┬────────────────────────────────────────────┐
│ [toolbar] Transformar                      │                                    [copiar]│
│  [MAIÚSC] [minús] [Cap] [Rm Esp] [Rm Acc] [Inv]                                     │
├────────────────────────────────────────────┼────────────────────────────────────────────┤
│ ENTRADA                          [limpar]  │ RESULTADO                        [copiar]  │
│                                            │                                            │
│ <textarea> Texto original                  │ <pre> Texto transformado                   │
│                                            │                                            │
├────────────────────────────────────────────┼────────────────────────────────────────────┤
│ [rodapé] 142 chars → 142 chars             │                                            │
└────────────────────────────────────────────┴────────────────────────────────────────────┘
```

#### Tarefas de refatoração

- [ ] Refatorar para `<LayoutC>`
- [ ] **Toolbar superior:** botões de transformação em `<OptionSwitch>` ou grupo de botões pequenos
  - Cada botão: `text-[11px]`, `rounded px-2 py-0.5`, estado ativo com `bg-foreground/10`
  - Transformação acontece ao clicar (não precisa de "submit")
- [ ] **Painel esquerdo:** textarea com `font-mono`, placeholder, header "ENTRADA" + limpar
- [ ] **Painel direito:** `<pre>` ou `div` com `bg-muted/20`, `select-all`, header "RESULTADO" + copiar
- [ ] Output deve ser **não-editável** (`cursor-default select-all`)
- [ ] **Footer:** `<StatusBar>` com contagem de caracteres entrada → saída
- [ ] Remover componentes `TextInput`, `TextActions`, `TextOutput` — incorporar diretamente no componente principal ou extrair apenas o logic

---

### 3. Conversor de Temperatura

**Arquivo:** `src/components/tools/temperature-converter/temperature-converter.tsx`
**Estado atual:** Layout vertical — chips de escala origem → input valor → chips escala destino → resultado → grid de todas as escalas.

#### Problemas identificados

| Problema | Severidade | Onde |
|---|---|---|
| Layout vertical empilhado | 🔴 Alta | Estrutura geral |
| Chips de escala usam `bg-primary text-primary-foreground` | 🟡 Média | DESIGN.md §6.3: nunca usar `bg-primary` para chips/seleção — usar `bg-accent` ou `bg-foreground/10` |
| Resultado em `text-lg font-semibold` | 🟡 Média | Valor numérico deve ser `font-mono tabular-nums` |
| Grid de "Todas as escalas" usa `text-lg font-semibold` | 🟡 Média | Mesmo problema — números em sans grande |
| `border-primary/30 bg-primary/5` para destaque | 🟢 Baixa | Aceitável, mas preferir tokens semânticos |

#### Estrutura proposta

```
┌────────────────────────────────────────────┬────────────────────────────────────────────┐
│ [toolbar]                                  │                                            │
│  Escala origem: [°C] [°F] [K]              │                                            │
├────────────────────────────────────────────┼────────────────────────────────────────────┤
│ ENTRADA                          [limpar]  │ RESULTADO                                  │
│                                            │                                            │
│ Valor em °C                                │ 77.00 °F                                   │
│ [__________]                               │ Fórmula: °F = (°C × 9/5) + 32             │
│                                            │                                            │
│                                            │ Todas as escalas                           │
│                                            │ ─────────────────────────────────────      │
│                                            │ Celsius      25.00 °C                      │
│                                            │ Fahrenheit   77.00 °F                      │
│                                            │ Kelvin      298.15 K                       │
├────────────────────────────────────────────┼────────────────────────────────────────────┤
│ [rodapé] 1 valor · 3 escalas               │                                            │
└────────────────────────────────────────────┴────────────────────────────────────────────┘
```

#### Tarefas de refatoração

- [ ] Refatorar para `<LayoutC>`
- [ ] **Toolbar superior:** seleção de escala origem como `<OptionSwitch>` ou chips (não usar `bg-primary`)
- [ ] **Painel esquerdo:**
  - Header "ENTRADA" + limpar
  - Label "Valor" + input numérico com `font-mono`
  - Botão "Agora" (para timestamp) — não aplicável aqui, mas manter "Inverter escalas"
- [ ] **Painel direito:**
  - Header "RESULTADO"
  - Valor principal em `font-mono text-2xl tabular-nums`
  - Fórmula usada em `text-xs text-muted-foreground font-mono`
  - Seção "Todas as escalas" com lista label + valor mono
- [ ] Corrigir chips de escala: usar `bg-foreground/10 text-foreground` para ativo, nunca `bg-primary`
- [ ] Todos os valores numéricos em `font-mono tabular-nums`
- [ ] **Footer:** `<StatusBar>` com "1 valor · 3 escalas"

---

### 4. Conversor de Unidades

**Arquivo:** `src/components/tools/unit-converter/unit-converter-client.tsx`
**Estado atual:** Layout vertical — select categoria → input valor + select origem → botão inverter → input resultado + select destino.

#### Problemas identificados

| Problema | Severidade | Onde |
|---|---|---|
| Layout vertical empilhado | 🔴 Alta | Estrutura geral |
| Input de resultado é editável (`readOnly` mas com aparência de input) | 🟡 Média | Deveria ser `<pre>` ou `<div>` com `select-all`, não `<Input readOnly>` |
| Botão "Inverter" abaixo dos selects | 🟡 Média | Deveria ser swap button central do Layout C |
| Labels em `text-sm font-medium` | 🟢 Baixa | Aceitável fora do grid, mas dentro do Layout C usar ALL CAPS |
| Não usa `font-mono` para valores | 🟡 Média | Input de valor e resultado |

#### Estrutura proposta

```
┌────────────────────────────────────────────┬────────────────────────────────────────────┐
│ [toolbar]                                  │                                            │
│  Categoria: [Comprimento ▼]                │                                            │
├────────────────────────────────────────────┼────────────────────────────────────────────┤
│ ENTRADA                          [limpar]  │ RESULTADO                                  │
│                                            │                                            │
│ Valor                                      │ 100.00 cm                                  │
│ [1________]                                │                                            │
│ De: [Metro ▼]                              │ Para: [Centímetro ▼]                       │
│                                            │                                            │
├────────────────────────────────────────────┼────────────────────────────────────────────┤
│ [rodapé] 1 m = 100 cm                      │                                            │
└────────────────────────────────────────────┴────────────────────────────────────────────┘
```

#### Tarefas de refatoração

- [ ] Refatorar para `<LayoutC>`
- [ ] **Toolbar superior:** select de categoria (Comprimento, Massa, Volume, etc.)
- [ ] **Painel esquerdo:**
  - Header "ENTRADA" + limpar
  - Input numérico com `font-mono`
  - Select "De:" com unidades da categoria
- [ ] **Painel direito:**
  - Header "RESULTADO" + copiar
  - Resultado em `font-mono text-lg tabular-nums select-all` (não input)
  - Select "Para:" com unidades da categoria
- [ ] Swap button central (`ArrowLeftRight`) para trocar origem ↔ destino
- [ ] **Footer:** `<StatusBar>` com fórmula da conversão
- [ ] Todos os valores numéricos em `font-mono tabular-nums`

---

### 5. Número por Extenso

**Arquivo:** `src/components/tools/numero-por-extenso/numero-por-extenso-client.tsx`
**Estado atual:** Layout vertical — input de moeda → checkbox "incluir reais/centavos" → botões de exemplo → resultado em `ResultBox`.

#### Problemas identificados

| Problema | Severidade | Onde |
|---|---|---|
| Layout vertical empilhado | 🔴 Alta | Estrutura geral |
| Usa `<CurrencyInput>` de biblioteca externa | 🟡 Média | Funciona, mas input numérico nativo com `font-mono` é preferível |
| Botões de exemplo em `rounded-full border bg-background` | 🟢 Baixa | Estilo inconsistente — usar `rounded border-border bg-card` |
| Checkbox com label em `text-sm` | 🟢 Baixa | Aceitável, mas poderia ser toggle no header |
| Resultado em `ResultBox` com `CopyButton` abaixo | 🟡 Média | `ResultBox` é componente genérico de resultado isolado — no Layout C, resultado fica no painel direito |

#### Estrutura proposta

```
┌────────────────────────────────────────────┬────────────────────────────────────────────┐
│ [toolbar]                                  │                                            │
│  Modo: [Numérico] [Moeda R$]               │                                            │
├────────────────────────────────────────────┼────────────────────────────────────────────┤
│ ENTRADA                          [limpar]  │ RESULTADO                        [copiar]  │
│                                            │                                            │
│ Valor                                      │ Um milhão, duzentos e trinta e quatro      │
│ [R$ 1.234,56____]                          │ reais e cinquenta e seis centavos          │
│                                            │                                            │
│ Exemplos: [R$1] [R$100] [R$1.234,56]       │                                            │
├────────────────────────────────────────────┼────────────────────────────────────────────┤
│ [rodapé] 1.234,56 → 67 chars               │                                            │
└────────────────────────────────────────────┴────────────────────────────────────────────┘
```

#### Tarefas de refatoração

- [ ] Refatorar para `<LayoutC>`
- [ ] **Toolbar superior:** toggle "Numérico" / "Moeda R$"
- [ ] **Painel esquerdo:**
  - Header "ENTRADA" + limpar
  - Input numérico com `font-mono` (manter `CurrencyInput` se necessário, mas estilizar)
  - Botões de exemplo abaixo do input (aceitável como helpers)
- [ ] **Painel direito:**
  - Header "RESULTADO" + copiar
  - Texto por extenso em `font-mono text-sm` ou `text-base` (texto natural, não código)
  - `select-all` para facilitar cópia
- [ ] **Footer:** `<StatusBar>` com valor original → tamanho do texto
- [ ] Corrigir botões de exemplo: usar estilo do projeto (`rounded border-border bg-card hover:bg-muted`)

---

### 6. Imagem → Base64

**Arquivo:** `src/components/tools/image-base64/image-to-base64.tsx`
**Estado atual:** Layout vertical — toggle upload/URL → dropzone ou input URL → preview + info → resultado base64.

#### Problemas identificados

| Problema | Severidade | Onde |
|---|---|---|
| Layout vertical empilhado | 🔴 Alta | Estrutura geral |
| Usa `rounded-lg border-destructive/50` para erro | 🟢 Baixa | Preferir `border-destructive/30` |
| Preview da imagem com `max-h-75 max-w-full` | 🟢 Baixa | Aceitável, mas `max-h-75` é arbitrário |
| Info em `<div className="space-y-2 rounded-md border bg-card p-4">` | 🟢 Baixa | Aceitável, mas métricas (dimensões, tamanho) devem ser `font-mono` |
| Botão "Mostrar Base64 Puro" no meio do conteúdo | 🟡 Média | Deveria estar no header do painel direito |
| `ResultBox` genérico para resultado | 🟡 Média | No Layout C, resultado é painel direito |

#### Estrutura proposta

```
┌────────────────────────────────────────────┬────────────────────────────────────────────┐
│ [toolbar]                                  │                                            │
│  Origem: [Upload] [URL Remota]             │                                            │
├────────────────────────────────────────────┼────────────────────────────────────────────┤
│ ENTRADA                          [limpar]  │ RESULTADO                        [copiar]  │
│                                            │                                            │
│ [área de drop ou input URL]                │ Preview:                                   │
│                                            │ ┌────────────────────────────┐             │
│                                            │ │      [imagem]              │             │
│                                            │ └────────────────────────────┘             │
│                                            │                                            │
│                                            │ 1280 × 720 px · 234 KB · PNG              │
│                                            │                                            │
│                                            │ Base64 (data URI):                         │
│                                            │ <pre>data:image/png;base64,iVBOR...</pre> │
├────────────────────────────────────────────┼────────────────────────────────────────────┤
│ [rodapé] 234 KB → 312 KB (+33%)            │                                            │
└────────────────────────────────────────────┴────────────────────────────────────────────┘
```

#### Tarefas de refatoração

- [ ] Refatorar para `<LayoutC>`
- [ ] **Toolbar superior:** toggle "Upload" / "URL Remota"
- [ ] **Painel esquerdo:**
  - Header "ENTRADA" + limpar
  - Estado upload: `<ImageDropzone>`
  - Estado URL: input URL + botão "Carregar"
- [ ] **Painel direito:**
  - Header "RESULTADO" + copiar + toggle "Puro" / "Data URI"
  - Preview da imagem (se carregada)
  - Métricas: dimensões, formato, tamanho original, tamanho base64, overhead
  - String base64 em `<pre>` com `font-mono`, `break-all`, `select-all`
- [ ] **Footer:** `<StatusBar>` com tamanho original → tamanho base64 + overhead
- [ ] Métricas de dimensões/tamanho em `font-mono tabular-nums`
- [ ] Remover `ResultBox` genérico — incorporar no painel direito

---

## Problemas comuns nas ferramentas JÁ em Layout C

### 1. Cor hardcoded `bg-green-600` no status dot

**Afeta:** binary-converter, morse-converter, url-encoder, timestamp-converter, csv-json, css-minifier, markdown-to-html, text-cipher, hash-generator

**Fix:** Substituir por `bg-success` (token semântico).

```tsx
// Antes
<span className={`h-1.5 w-1.5 rounded-full ${result.output ? "bg-green-600" : "bg-foreground/30"}`} />

// Depois
<span className={`h-1.5 w-1.5 rounded-full ${result.output ? "bg-success" : "bg-foreground/30"}`} />
```

### 2. Footer inline em vez de `<StatusBar>`

**Afeta:** morse-converter, url-encoder, timestamp-converter, csv-json, css-minifier, markdown-to-html, text-cipher, hash-generator

**Fix:** Extrair o footer inline para usar o componente `<StatusBar>`.

```tsx
// Antes (inline)
footer={
  <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2">
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-1.5 w-1.5 rounded-full ${result.output ? "bg-green-600" : "bg-foreground/30"}`} />
      <span className="text-[11px] text-muted-foreground">{result.output ? "Convertido" : "Aguardando"}</span>
    </span>
    <span className="font-mono text-[11px] text-muted-foreground">{inputLen} chars → {outputLen} chars</span>
  </div>
}

// Depois (usando StatusBar)
footer={
  <StatusBar
    items={[
      { label: "", value: result.output ? "Convertido" : "Aguardando", mono: false },
      { label: "Entrada", value: `${inputLen} chars`, mono: true },
      { label: "Saída", value: `${outputLen} chars`, mono: true },
    ]}
  />
}
```

### 3. Hash Generator — botão "Calcular Hash" viola síncronismo

**Arquivo:** `hash-generator.tsx`

O Layout C exige conversão **síncrona** — sem botão de submit. O hash-generator requer processamento async (Web Crypto API), o que justifica o botão... mas podemos melhorar:

- **Opção A:** Auto-calcular ao digitar com debounce (aceitável para textos pequenos)
- **Opção B:** Manter o botão, mas movê-lo para o header do painel direito (não no footer)
- **Opção C:** Adicionar estado "Auto-calcular" toggle no toolbar

**Recomendação:** Opção B + debounce para texto. Manter botão apenas para arquivo (que requer input explícito).

### 4. CSV-JSON — tabela extra abaixo do grid

**Arquivo:** `csv-json-converter.tsx`

A tabela de preview (`CsvJsonTable`) aparece **abaixo** do `<LayoutC>`, quebrando o container unificado.

**Fix:** Mover a tabela para dentro do painel direito (como preview visual) ou substituir o `<pre>` pela tabela quando modo = JSON→CSV.

---

## Componente compartilhado sugerido: `<ConversionFooter>`

Para padronizar o footer de todas as ferramentas Layout C:

```tsx
// src/components/shared/conversion-footer.tsx

type ConversionFooterProps = {
  status: "idle" | "success" | "error" | "loading";
  statusLabel?: string;
  metrics: { label: string; value: string }[];
};

export function ConversionFooter({ status, statusLabel, metrics }: ConversionFooterProps) {
  const dotClass = {
    idle: "bg-foreground/30",
    success: "bg-success",
    error: "bg-destructive",
    loading: "animate-pulse bg-warning",
  }[status];

  return (
    <StatusBar
      items={[
        { label: "", value: statusLabel || "Aguardando", mono: false },
        ...metrics.map((m) => ({ label: m.label, value: m.value, mono: true })),
      ]}
    />
  );
}
```

---

## Anti-padrões a evitar

- ❌ Botão "Converter" — a transformação deve ser síncrona (exceto quando requer async pesado como hash de arquivo)
- ❌ Textarea com border interna — usar border do container grid
- ❌ Output editável — saída é `readonly` / `cursor-default` / `select-all`
- ❌ Gap entre colunas — usar `border-r` do container
- ❌ Resultado abaixo do input em desktop — usar grid 2 colunas
- ❌ Cores hardcoded (`bg-green-600`, `text-blue-600`) — usar tokens semânticos
- ❌ `font-bold` em valores numéricos — usar `font-mono font-medium tabular-nums`
- ❌ Ações (botões de transformação) no meio do conteúdo — mover para toolbar superior
- ❌ Chips/seletores com `bg-primary` — usar `bg-foreground/10` para estado ativo

---

## Checklist de implementação

### Estrutura
- [ ] Container unificado: `rounded-lg border border-border overflow-hidden grid md:grid-cols-2` (sem `gap-*`)
- [ ] Header por coluna: label ALL CAPS `text-[11px] font-semibold uppercase tracking-wider` + ações (limpar/copiar/seletor)
- [ ] Toolbar superior (quando aplicável): opções de direção, modo, formato
- [ ] Swap button central para conversores bidirecionais
- [ ] Entrada: `bg-transparent`, saída: `bg-muted/20 cursor-default select-all`
- [ ] Rodapé com `<StatusBar>` — metadados em `font-mono text-[11px]`
- [ ] Fonte mono em todo conteúdo técnico (código, base64, SQL, números)

### Tokens
- [ ] Nenhum hex/rgb/cor de paleta Tailwind (`bg-green-600` etc) em chrome
- [ ] Status dot: `bg-success`, `bg-destructive`, `bg-warning`, `bg-foreground/30`
- [ ] Toda borda usa `border-border` (1px)

### Tipografia
- [ ] Nenhum `font-bold` — apenas `font-semibold` (600) no máximo
- [ ] Todos os números/contagens/tamanhos em `font-mono tabular-nums`
- [ ] Labels em sans, nunca mono
- [ ] Section headers em ALL CAPS `text-[10px] tracking-wider`

### Densidade
- [ ] Padding interno de painel: `p-3` (textarea), `p-4` (resultado)
- [ ] Gap entre rows de form: `space-y-3`
- [ ] Section headers sem ícone à esquerda

### Anti-soft-SaaS
- [ ] Reler DESIGN.md §13 — nenhum item bate
