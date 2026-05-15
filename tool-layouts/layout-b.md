# Layout B — Form + Resultado (Calculadoras e Geradores com Submit)

> Fonte: `LAYOUT-RESTRUCTURE.md` §"Layout B — Form + resultado (calculadoras)"
> Design: `DESIGN.md` §11.2.B, §12.2
> Implementação de referência: `src/components/tools/compound-interest/compound-interest-client.tsx`

## Quando usar

Ferramentas onde o usuário **preenche um formulário** e clica em calcular/gerar para obter um resultado. O resultado aparece em coluna direita *sticky* (visível enquanto edita) — nunca empilhado abaixo do form.

---

## Infraestrutura existente

| Componente | Arquivo | Status |
|---|---|---|
| `<LayoutB>` | `src/components/shared/layout-b.tsx` | Implementado — grid `[1fr_360px]` com form + resultado sticky |
| `<SectionLabel>` | `src/components/shared/layout-b/section-label.tsx` | Implementado — header de seção ALL CAPS com separador |
| `<ResultRow>` | `src/components/shared/layout-b/result-row.tsx` | Implementado — linha de resultado label + valor (com formatação BRL automática) |
| `<Chip>` | `src/components/shared/layout-b/chip.tsx` | Implementado — badge semântico (neutral/info/warn/success/danger) |
| `<CopyButton>` | `src/components/shared/copy-button.tsx` | Implementado — botão de copiar com feedback |
| `<OptionSwitch>` | `src/components/shared/option-switch.tsx` | Implementado — toggle segmentado |
| shadcn UI | `src/components/ui/` | Base disponível (Form, Input, Button, Checkbox, etc.) |

### Template canônico implementado

O `compound-interest-client.tsx` é a **implementação de referência** oficial do Layout B. Ele demonstra:

- Grid `lg:grid-cols-[1fr_360px]` com `border border-border rounded-md overflow-hidden`
- Coluna esquerda: formulário com `<SectionLabel>` + inputs + footer com info + reset
- Coluna direita: sticky com resultado principal em `text-[32px] font-mono`, detalhamento em `<ResultRow>`, ações (copiar) no rodapé
- Estados: vazio (placeholder), preenchido (valores), warning stripe no final
- Cálculo automático ao digitar (sem submit explícito) — aceitável para calculadoras financeiras

---

## Grid estrutural

```tsx
<div className="grid grid-cols-1 gap-0 items-start lg:grid-cols-[1fr_360px] border border-border rounded-md overflow-hidden">
  {/* Coluna esquerda — formulário */}
  <div className="bg-card flex flex-col h-full">
    <div className="divide-y divide-border">
      <div className="p-4">
        <SectionLabel>Dados</SectionLabel>
        <div className="space-y-3">
          {/* campos */}
        </div>
      </div>
      <div className="p-4">
        <SectionLabel>Parâmetros</SectionLabel>
        <div className="space-y-3">
          {/* campos */}
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-3 mt-auto">
      <span className="text-caption text-muted-foreground">Info</span>
      <Button variant="ghost" size="sm">Resetar</Button>
    </div>
  </div>

  {/* Coluna direita — resultado sticky */}
  <aside className="flex h-full lg:border-l max-lg:border-t border-border flex-col gap-3">
    <div className="flex-1">
      {/* Estado vazio */}
      <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
        <p className="text-sm text-muted-foreground">Preencha os dados para calcular</p>
      </div>
      {/* Estado preenchido */}
      <div className="p-4 bg-card border-b">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Resultado</span>
          <Chip tone="success">Estimativa</Chip>
        </div>
        <span className="text-[32px] font-semibold leading-none tracking-tight font-mono text-foreground">R$ 4.280,00</span>
      </div>
      <div className="px-4 py-3">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Detalhamento</p>
        <ResultRow label="Salário base" value={2000} />
        <ResultRow label="FGTS" value={1600} />
      </div>
      <div className="flex gap-2 border-t border-border p-3">
        <CopyButton text="..." label="Copiar" variant="outline" />
      </div>
    </div>
    <div className="flex items-start gap-2 border-t border-warning-line bg-warning-surface px-4 py-3 text-[11.5px] text-muted-foreground">
      <AlertTriangle className="mt-px h-3.5 w-3.5 shrink-0 text-warning" />
      <span>Disclaimer...</span>
    </div>
  </aside>
</div>
```

---

## Ferramentas mapeadas (22)

### ✅ Já implementadas em Layout B (ou estrutura equivalente)

| Ferramenta | Rota | Estado | Problemas |
|---|---|---|---|
| **Calculadora de Rescisão** | `/ferramentas/calculadora-de-rescisao` | ✅ Usa `<LayoutB>` | Não usa `<SectionLabel>`/`<ResultRow>`/`<Chip>` compartilhados; section header próprio `text-[10px]` OK; `font-mono` no título grande OK; `text-green-600` hardcoded no seguro-desemprego |
| **Calculadora Salário Líquido** | `/ferramentas/calculadora-salario-liquido` | ✅ Grid próprio B | `border` sem `border-border` no container; `p-5` em vez de `p-4`; footer usa `bg-muted` em vez de `bg-muted/40`; tracking `[0.08em]` em vez de `tracking-wider` |
| **Calculadora IMC** | `/ferramentas/calculadora-de-imc` | ✅ Grid próprio B | Mesmos problemas do salary; `text-[32px] font-semibold font-mono` OK; chip de classificação usa `<Chip>` ✅ |
| **Simulador Financiamento** | `/ferramentas/simulador-financiamento` | ✅ Grid próprio B | `font-bold` no badge "P"/"S" dos sistemas; tabela de amortização abaixo do grid quebra container; `text-[12px]` em vez de `text-xs` em alguns lugares |
| **Juros Compostos** | `/ferramentas/calculadora-juros-compostos` | ✅ Referência | Container com `border` sem `border-border`; `p-5` em vez de `p-4`; footer `bg-muted` em vez de `bg-muted/40`; tracking `[0.08em]` em vez de `tracking-wider` |
| **Calculadora Dias Úteis** | `/ferramentas/calculadora-de-dias-uteis` | ✅ Grid próprio B | Mesmos problemas de padding/footer; `<Row>` inline em vez de `<ResultRow>` |
| **Calculadora de Idade** | `/ferramentas/calculadora-de-idade` | ❓ Precisa verificar | Mapeada como vertical no LAYOUT-RESTRUCTURE |
| **Calculadora de Férias** | `/ferramentas/calculadora-de-ferias` | ❓ Precisa verificar | Mapeada como vertical no LAYOUT-RESTRUCTURE |
| **13º Salário** | `/ferramentas/calculadora-13-salario` | ❓ Precisa verificar | Mapeada como vertical no LAYOUT-RESTRUCTURE |
| **Rendimento CDI/Selic** | `/ferramentas/rendimento-cdi-selic` | ❓ Precisa verificar | Mapeada como vertical no LAYOUT-RESTRUCTURE |
| **Adicional Noturno** | `/ferramentas/calculadora-adicional-noturno` | ❓ Precisa verificar | Mapeada como vertical no LAYOUT-RESTRUCTURE |
| **Hora Extra** | `/ferramentas/calculadora-de-hora-extra` | ❓ Precisa verificar | Mapeada como vertical no LAYOUT-RESTRUCTURE |
| **Porcentagem** | `/ferramentas/calculadora-de-porcentagem` | ❓ Precisa verificar | Mapeada como vertical no LAYOUT-RESTRUCTURE |
| **Calcular Horas Trabalhadas** | `/ferramentas/calcular-horas-trabalhadas` | ❓ Precisa verificar | Mapeada como vertical no LAYOUT-RESTRUCTURE |

### ❌ Ainda em layout vertical (precisam migrar)

| Ferramenta | Rota | Principal mudança |
|---|---|---|
| **Gerador de Senha** | `/ferramentas/gerador-de-senha` | Form esquerda (length, checkboxes) → resultado direita (senha + força) |
| **Gerador de CPF** | `/ferramentas/gerador-de-cpf` | Form esquerda (quantidade, formato) → lista CPFs direita |
| **Gerador de CNPJ** | `/ferramentas/gerador-de-cnpj` | Form esquerda (quantidade, formato) → lista CNPJs direita |
| **Gerador de Cartão de Crédito** | `/ferramentas/gerador-de-cartao-de-credito` | Form esquerda (bandeira, quantidade) → lista cartões direita |
| **Gerador de UUID** | `/ferramentas/gerador-de-uuid` | Form esquerda (versão, namespace, quantidade) → lista UUIDs direita |
| **Gerador de Dados Mock** | `/ferramentas/gerador-de-dados-mock` | Form esquerda (schema, quantidade) → tabela/JSON direita |
| **Gerador de Meta Tags** | `/ferramentas/gerador-meta-tags` | Form esquerda (campos OG) → código HTML + preview direita |
| **Gerador de Código de Barras em Lote** | `/ferramentas/gerador-de-codigo-de-barras-em-lote` | Upload/config esquerda → lista para download direita |

---

## Análise detalhada — ferramentas que precisam migrar

### 1. Gerador de Senha

**Arquivo:** `src/components/tools/password-generator/password-generator.tsx`
**Arquivos filhos:** `password-options.tsx`, `password-output.tsx`
**Estado atual:** Layout vertical — slider + checkboxes → botão "Gerar senha" → input readonly abaixo.

#### Problemas identificados

| Problema | Severidade | Onde |
|---|---|---|
| Layout vertical empilhado | 🔴 Alta | Estrutura geral |
| Slider com `accent-primary` | 🟡 Média | `password-options.tsx` — `accent-*` é paleta Tailwind |
| Checkboxes em cards `bg-secondary hover:border-primary` | 🟡 Média | `bg-secondary` e `hover:border-primary` não são tokens semânticos |
| Botão "Gerar senha" com `variant="default"` + ícone | 🟡 Média | OK como CTA, mas no Layout B o botão fica no footer do form |
| Output em `<Input readOnly>` | 🟢 Baixa | Funciona, mas no Layout B o resultado é display (não input) |
| Não há preview de força da senha | 🟢 Baixa | Poderia ter medidor visual no painel direito |

#### Estrutura proposta

```
┌────────────────────────────────────────────┬────────────────────────────────────────────┐
│ SENHA                                      │ RESULTADO                                  │
│                                            │                                            │
│ ─ CONFIGURAÇÃO                             │ ┌────────────────────────────────────────┐ │
│ Tamanho                                    │ │ Zx9#mK2$pL5v                           │ │
│ [=========●========]  12 chars             │ └────────────────────────────────────────┘ │
│                                            │ [Copiar]  [Regenerar]                      │
│ ─ CARACTERES                               │                                            │
│ ☑ Maiúsculas  ☑ Minúsculas                 │ Força: ████████░░░░ Média                  │
│ ☑ Números     ☐ Símbolos                   │                                            │
│                                            │ Entropia: ~78 bits                         │
├────────────────────────────────────────────┤ Tempo de quebra: ~3 anos                   │
│ [?] Gerada automaticamente        [Resetar]│                                            │
└────────────────────────────────────────────┴────────────────────────────────────────────┘
```

#### Tarefas de refatoração

- [ ] Refatorar para grid Layout B
- [ ] **Coluna esquerda:**
  - Seção "CONFIGURAÇÃO" com slider de tamanho (1–128) + input numérico
  - Seção "CARACTERES" com toggles/checkboxes (maiúsculas, minúsculas, números, símbolos)
  - Footer: info "Gerada no navegador" + botão reset
- [ ] **Coluna direita:**
  - Display da senha em `font-mono text-xl select-all break-all` (não input)
  - Ações: copiar, regenerar
  - Medidor de força (entropy/bars) com cores semânticas
  - Tempo estimado de quebra
- [ ] Corrigir slider: usar `accent-foreground` ou custom CSS com variável CSS
- [ ] Corrigir cards de checkbox: `bg-card border-border hover:border-foreground/20`
- [ ] Remover `bg-secondary`, `hover:border-primary`, `accent-primary`

---

### 2. Gerador de CPF

**Arquivo:** `src/components/tools/cpf-generator/cpf-generator.tsx`
**Estado atual:** Layout vertical — input quantidade + checkbox formatar → botão → lista.

#### Problemas identificados

| Problema | Severidade | Onde |
|---|---|---|
| Layout vertical empilhado | 🔴 Alta | Estrutura geral |
| Input `w-24` para quantidade | 🟢 Baixa | OK, mas no Layout B fica no form esquerdo |
| Checkbox com label `text-sm` | 🟢 Baixa | Aceitável |
| Lista em `<CpfList>` abaixo do botão | 🟡 Média | Deveria estar no painel direito |

#### Tarefas de refatoração

- [ ] Refatorar para grid Layout B
- [ ] **Coluna esquerda:**
  - Seção "CONFIGURAÇÃO"
  - Input quantidade (1–100) com `font-mono`
  - Toggle: formatar com pontuação
  - Botão "Gerar" no footer
- [ ] **Coluna direita:**
  - Header "CPFs GERADOS" + badge com contagem
  - Lista em `font-mono text-sm`, cada item com botão copiar individual
  - Botão "Copiar todos" no rodapé
- [ ] Estado vazio: "Configure e clique em Gerar"

---

### 3. Gerador de UUID

**Arquivo:** `src/components/tools/uuid-generator/uuid-generator.tsx`
**Estado atual:** Layout vertical — chips de versão → inputs condicionais → botão → lista.

#### Problemas identificados

| Problema | Severidade | Onde |
|---|---|---|
| Layout vertical empilhado | 🔴 Alta | Estrutura geral |
| Chips de versão com `bg-primary text-primary-foreground` | 🔴 Alta | Violão DESIGN.md §6.3 — nunca `bg-primary` para seleção |
| Chips `rounded-full` | 🟢 Baixa | DESIGN.md §6.2: max `rounded-lg` |
| `border border-border bg-background` nos chips inativos | 🟢 Baixa | Preferir `bg-card` |
| Descrição da versão em `text-sm` abaixo dos chips | 🟢 Baixa | Aceitável, mas poderia ser tooltip |
| Input de namespace com `className="font-mono"` | ✅ Bom | Já usa mono corretamente |

#### Tarefas de refatoração

- [ ] Refatorar para grid Layout B
- [ ] **Coluna esquerda:**
  - Seção "VERSÃO" com `<OptionSwitch>` (não chips `rounded-full`)
  - Seção "CONFIGURAÇÃO" condicional (namespace, nome para v3/v5)
  - Input quantidade (1–100) para v1/v4
  - Botão "Gerar" no footer
- [ ] **Coluna direita:**
  - Lista de UUIDs em `font-mono text-sm`
  - Ações: copiar todos, copiar individual
- [ ] Corrigir chips de versão: usar `<OptionSwitch>` ou botões `rounded-md` com `bg-foreground/10` para ativo
- [ ] Remover todos os `bg-primary text-primary-foreground` de seleção
- [ ] Remover `rounded-full` — usar `rounded-md`

---

### 4. Gerador de Meta Tags

**Arquivo:** `src/components/tools/meta-tag-generator/meta-tag-generator.tsx`
**Estado atual:** Layout vertical — campos empilhados → preview Google/OG abaixo → código HTML abaixo.

#### Problemas identificados

| Problema | Severidade | Onde |
|---|---|---|
| Layout vertical empilhado | 🔴 Alta | Estrutura geral |
| Preview Google com cores hex hardcoded | 🔴 Alta | `#1a0dab`, `#006621`, `#4d5156`, `#8ab4f8`, etc. |
| Preview Facebook com `bg-[#f0f2f5]` e `dark:bg-[#3a3b3c]` | 🔴 Alta | Cores hardcoded |
| Contadores de caracteres em `text-xs text-muted-foreground` | 🟡 Média | Deveriam ser `font-mono` |
| Código HTML em `<Textarea readOnly>` | 🟡 Média | No Layout B, código fica no painel direito como `<pre>` |
| Labels em `text-sm font-medium` | 🟢 Baixa | DESIGN.md §4.2: labels de campo em `text-xs font-medium` |

#### Estrutura proposta

```
┌────────────────────────────────────────────┬────────────────────────────────────────────┐
│ META TAGS                                  │ RESULTADO                                  │
│                                            │                                            │
│ ─ INFORMAÇÕES BÁSICAS                      │ Preview Google                             │
│ Título                    [__________] 58  │ [snippet]                                  │
│ Descrição                 [__________] 142 │                                            │
│ URL                       [__________]     │ Preview Open Graph                         │
│ Imagem OG                 [__________]     │ [card]                                     │
│                                            │                                            │
│ ─ CONFIGURAÇÃO                             │ Código HTML                                │
│ Tipo de conteúdo          [Website ▼]      │ <pre> código formatado </pre>              │
│ Autor                     [__________]     │ [Copiar código]                            │
│ Palavras-chave            [__________]     │                                            │
├────────────────────────────────────────────┤                                            │
│                                    [Copiar]│                                            │
└────────────────────────────────────────────┴────────────────────────────────────────────┘
```

#### Tarefas de refatoração

- [ ] Refatorar para grid Layout B
- [ ] **Coluna esquerda:**
  - Seção "INFORMAÇÕES BÁSICAS" com inputs + contadores mono
  - Seção "CONFIGURAÇÃO" com select e inputs extras
  - Contadores: `font-mono text-caption` (ex: `58 / 60`)
- [ ] **Coluna direita:**
  - Preview Google (simulação) — pode manter cores do Google mas com comentário explicativo
  - Preview Open Graph — pode manter cores do Facebook com comentário
  - Código HTML em `<pre>` com `bg-muted/20 font-mono text-sm select-all`
  - Botão "Copiar código"
- [ ] Labels de campo: `text-xs font-medium` (não `text-sm`)
- [ ] Adicionar comentário no código explicando que as cores do preview são intencionais (simulação Google/Facebook)
- [ ] Preview: usar variáveis CSS onde possível para dark mode, ou manter hardcoded justificado

---

## Problemas comuns nas ferramentas JÁ em Layout B

### 1. Padding inconsistente

**Afeta:** salary-calculator, bmi-calculator, compound-interest, loan-calculator, business-days-calculator

**Problema:** Usam `p-5` em vez de `p-4`.

**Fix:** Padronizar para `p-4` (DESIGN.md §7.1).

### 2. Footer com `bg-muted` sólido

**Afeta:** salary-calculator, bmi-calculator, compound-interest

**Problema:** `bg-muted` em vez de `bg-muted/40`.

**Fix:** `bg-muted/40` para manter consistência com outros layouts.

### 3. Section headers com tracking personalizado

**Afeta:** salary-calculator, bmi-calculator, compound-interest, loan-calculator, business-days-calculator

**Problema:** `tracking-[0.08em]` em vez de `tracking-wider`.

**Fix:** Padronizar para `tracking-wider` (token semântico do Tailwind).

### 4. Container sem `border-border` explícito

**Afeta:** salary-calculator, bmi-calculator, compound-interest

**Problema:** `<div className="... border rounded-md ...">` — `border` sozinho herda `border-border` no tema, mas é melhor ser explícito.

**Fix:** `border border-border`.

### 5. Rescisão — cor hardcoded `text-green-600`

**Afeta:** termination-calculator

**Problema:** Status de seguro-desemprego usa `text-green-600`.

**Fix:** `text-success`.

### 6. Financiamento — `font-bold` em badges

**Afeta:** loan-calculator

**Problema:** Badges "P" e "S" dos sistemas usam `font-bold`.

**Fix:** `font-semibold` (nunca `font-bold`).

### 7. Financiamento — tabela abaixo do grid

**Afeta:** loan-calculator

**Problema:** A tabela de amortização aparece **abaixo** do grid principal, quebrando o container unificado.

**Fix:** Mover para dentro do painel direito (como seção expansível) ou criar um segundo grid abaixo com borda separada.

---

## Componente compartilhado sugerido: `<FormFooter>`

Para padronizar o footer do form em todas as calculadoras:

```tsx
// src/components/shared/layout-b/form-footer.tsx

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type FormFooterProps = {
  info?: string;
  onReset?: () => void;
  resetDisabled?: boolean;
  children?: React.ReactNode; // botão de submit/gerar
};

export function FormFooter({ info, onReset, resetDisabled, children }: FormFooterProps) {
  return (
    <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-3 mt-auto">
      {info ? (
        <span className="text-caption text-muted-foreground">{info}</span>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-2">
        {onReset && (
          <Button type="button" variant="ghost" size="sm" onClick={onReset} disabled={resetDisabled}>
            <RotateCcw className="mr-1.5 h-3 w-3" />
            Resetar
          </Button>
        )}
        {children}
      </div>
    </div>
  );
}
```

---

## Anti-padrões a evitar

- ❌ Resultado aparece **abaixo** do form — o usuário precisa rolar para ver
- ❌ Form com `space-y-6` entre campos — usar `space-y-3`
- ❌ Mais de um `variant="default"` por tela
- ❌ Padding `p-6` em painéis — manter `p-4`
- ❌ `bg-primary` para chips/seleção — usar `bg-foreground/10`
- ❌ `rounded-full` em botões/chips — max `rounded-lg`
- ❌ `font-bold` em qualquer lugar — max `font-semibold`
- ❌ Labels de input em `text-sm` — usar `text-xs font-medium`
- ❌ Valores numéricos em sans — sempre `font-mono tabular-nums`
- ❌ Botões de ação soltos no meio do form — agrupar no footer

---

## Checklist de implementação

### Estrutura
- [ ] Grid: `grid grid-cols-1 gap-0 lg:grid-cols-[1fr_360px] border border-border rounded-md overflow-hidden`
- [ ] Coluna esquerda: form com seções separadas por `divide-y divide-border`
- [ ] Cada seção: `<SectionLabel>` + `space-y-3` entre campos
- [ ] Cada campo: `<label className="text-xs font-medium">` + input em `space-y-1.5`
- [ ] Footer do form: `bg-muted/40` com info + reset + submit
- [ ] Coluna direita: `lg:sticky lg:top-[calc(3.5rem+1px)]`
- [ ] Painel direito: `rounded-md border border-border bg-card` (ou integrado ao grid)
- [ ] Estado vazio: `border-dashed` + texto "Preencha os dados para calcular"
- [ ] Estado preenchido: valor principal `text-[32px] font-semibold font-mono`
- [ ] Detalhamento: `<ResultRow>` com label + valor mono
- [ ] Ações: copiar/imprimir em `outline`, `size="sm"`
- [ ] Warning stripe: `border-t border-warning-line bg-warning-surface`

### Tokens
- [ ] Container: `border border-border` (1px)
- [ ] Painel direito: `bg-card`
- [ ] Footer: `bg-muted/40`
- [ ] Chips: usar `<Chip>` com tone semântico
- [ ] Nenhum `bg-primary` em seleção/chips

### Tipografia
- [ ] Section headers: `text-[10px] font-semibold uppercase tracking-wider text-muted-foreground`
- [ ] Labels: `text-xs font-medium text-foreground`
- [ ] Valores: `font-mono tabular-nums`
- [ ] Título grande: `text-[32px] font-semibold leading-none tracking-tight`
- [ ] Nenhum `font-bold`

### Densidade
- [ ] Padding de seção: `p-4`
- [ ] Gap entre campos: `space-y-3`
- [ ] Gap entre label e input: `space-y-1.5`

### Anti-soft-SaaS
- [ ] Reler DESIGN.md §13 — nenhum item bate
