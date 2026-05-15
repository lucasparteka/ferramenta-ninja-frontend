# Layout E — Inspector (Busca por ID → Ficha de Resultado)

> Fonte: `LAYOUT-RESTRUCTURE.md` §"Layout E — Inspector (busca por ID)"
> Design: `DESIGN.md` §12.5
> Estado: **Nenhuma ferramenta implementa o Layout E canônico. Todas usam layout vertical empilhado com cards de grid.**

## Quando usar

Ferramentas onde o usuário **insere um identificador** (CEP, CNPJ, código PIX, linha digitável) e a ferramenta **consulta/valida/decodifica** retornando uma ficha de resultado estruturada. Estados claros: vazio → loading → resultado → erro.

**Regra de ouro:** Se a ferramenta recebe um código/ID e retorna uma ficha de dados estruturados, é Layout E.

---

## Infraestrutura existente

| Componente | Arquivo | Status |
|---|---|---|
| `<LayoutE>` | `src/components/shared/layout-e.tsx` | ❌ **Não existe** |
| `<ResultBox>` | `src/components/shared/result-box.tsx` | ✅ Existe — mas é genérico, não segue estrutura de ficha |
| `<CopyButton>` | `src/components/shared/copy-button.tsx` | ✅ Existe |
| shadcn UI | `src/components/ui/` | Base disponível |

### Componente sugerido: `<LayoutE>`

```tsx
// src/components/shared/layout-e.tsx

type LayoutEProps = {
  header?: React.ReactNode;
  searchBar: React.ReactNode;
  state: "empty" | "loading" | "error" | "result";
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
  errorState?: React.ReactNode;
  result: React.ReactNode;
};

export function LayoutE({
  header,
  searchBar,
  state,
  emptyState,
  loadingState,
  errorState,
  result,
}: LayoutEProps) {
  return (
    <div className="space-y-6">
      {header}
      <div className="space-y-6">
        {searchBar}
        {state === "empty" && (emptyState ?? <EmptyState />)}
        {state === "loading" && (loadingState ?? <LoadingState />)}
        {state === "error" && (errorState ?? <ErrorState />)}
        {state === "result" && result}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 text-center p-8">
      <Search className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
      <p className="text-sm text-foreground">Digite um identificador para consultar</p>
      <p className="text-xs text-muted-foreground">Dados atualizados em tempo real</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[200px] items-center justify-center rounded-md border border-border bg-muted/20">
      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
    </div>
  );
}

function ErrorState({ message }: { message?: string }) {
  return (
    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
        <p className="text-xs text-destructive">{message ?? "Identificador não encontrado ou inválido."}</p>
      </div>
    </div>
  );
}
```

### Componente sugerido: `<ResultSheet>`

```tsx
// src/components/shared/result-sheet.tsx

type Section = {
  title: string;
  rows: { label: string; value: React.ReactNode; mono?: boolean }[];
};

type ResultSheetProps = {
  sections: Section[];
};

export function ResultSheet({ sections }: ResultSheetProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {sections.map((section) => (
        <div key={section.title} className="rounded-md border border-border bg-card">
          <div className="border-b border-border px-4 py-2">
            <h3 className="text-caption font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </h3>
          </div>
          <div className="divide-y divide-border">
            {section.rows.map((row) => (
              <div key={row.label} className="flex items-start justify-between px-4 py-2.5">
                <span className="text-xs text-muted-foreground min-w-[100px]">{row.label}</span>
                <span className={cn("text-xs text-right", row.mono && "font-mono")}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Grid estrutural (canônico)

```
┌─────────────────────────────────────────────────────────────────────┐
│ [h1] Título da ferramenta                                           │
│ [p]  Descrição curta                                                │
├─────────────────────────────────────────────────────────────────────┤
│ [Search Bar]                                                        │
│ ┌────────────────────────────────────────────────┐ ┌──────────────┐ │
│ │ [Input font-mono]                              │ │ [Consultar]  │ │
│ └────────────────────────────────────────────────┘ └──────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│ [Estado]                                                            │
│                                                                     │
│ VAZIO:  ┌─────────────────────────────────────────────────────┐    │
│         │  [Search icon]                                      │    │
│         │  "Digite um identificador para consultar"           │    │
│         │  "Dados atualizados em tempo real"                  │    │
│         └─────────────────────────────────────────────────────┘    │
│                                                                     │
│ LOADING: ┌────────────────────────────────────────────────────┐    │
│          │  [spinner]                                         │    │
│          └────────────────────────────────────────────────────┘    │
│                                                                     │
│ ERRO:    ┌────────────────────────────────────────────────────┐    │
│          │  [AlertTriangle] "CNPJ não encontrado"             │    │
│          └────────────────────────────────────────────────────┘    │
│                                                                     │
│ RESULTADO:                                                          │
│ ┌──────────────────────┐ ┌──────────────────────┐                  │
│ │ IDENTIFICAÇÃO        │ │ LOCALIZAÇÃO          │                  │
│ ├──────────────────────┤ ├──────────────────────┤                  │
│ │ CNPJ          valor  │ │ Logradouro    valor  │                  │
│ │ Razão Social  valor  │ │ Bairro        valor  │                  │
│ │ ...                  │ │ ...                  │                  │
│ └──────────────────────┘ └──────────────────────┘                  │
│ ┌──────────────────────┐                                           │
│ │ ATIVIDADE            │                                           │
│ │ ...                  │                                           │
│ └──────────────────────┘                                           │
└─────────────────────────────────────────────────────────────────────┘
```

### Tokens de grid

- Container: `space-y-6`
- Search bar: `flex gap-2` com `Input` (flex-1) + `Button`
- Input: `font-mono` — identificadores são dados técnicos
- Grid de resultado: `grid grid-cols-1 gap-4 md:grid-cols-2`
- Cada seção: card com `border border-border bg-card`
- Header de seção: `border-b border-border px-4 py-2` + `text-caption font-semibold uppercase tracking-wider text-muted-foreground`
- Rows: `divide-y divide-border` com `flex items-start justify-between px-4 py-2.5`
- Label: `text-xs text-muted-foreground min-w-[100px]`
- Valor: `text-xs text-right` + `font-mono` quando aplicável

---

## Ferramentas mapeadas (6)

| Ferramenta | Rota | Estado atual | Problema principal |
|---|---|---|---|
| **Consulta CNPJ** | `/ferramentas/consulta-cnpj` | ⚠️ Layout vertical empilhado | Input sem `font-mono`; resultado em cards `sm:grid-cols-2`, não ficha com sections |
| **Decodificador PIX** | `/ferramentas/decodificador-pix` | ⚠️ Layout vertical empilhado | Badge com `rounded-full`; botão copiar inline; textarea sem header estruturado |
| **Consulta CEP** | `/ferramentas/consulta-cep` | ⚠️ Layout vertical empilhado | Provavelmente segue mesmo padrão do CNPJ |
| **Tabela FIPE** | `/ferramentas/tabela-fipe` | ⚠️ Layout vertical empilhado | Seletores em cascata + busca → provavelmente não usa Layout E canônico |
| **Validador de Boleto** | `/ferramentas/validador-boleto` | ⚠️ Layout vertical empilhado | Provavelmente segue padrão de input + resultado abaixo |
| **Validador de Cartão** | `/ferramentas/validador-de-cartao-de-credito` | ⚠️ Layout vertical empilhado | Provavelmente input + badge de validação inline |

---

## Análise detalhada — ferramentas existentes

### 1. Consulta CNPJ

**Arquivo:** `src/components/tools/consulta-cnpj/consulta-cnpj-client.tsx`
**Estado:** Layout vertical com form (input + botão) + resultado em grid de cards.

#### Problemas identificados

| Problema | Severidade | Onde |
|---|---|---|
| Input sem `font-mono` | 🔴 Alta | CNPJ é dado técnico — deve ser `font-mono` |
| Label em `text-sm font-medium text-foreground` | 🟡 Média | DESIGN.md §4.2: `text-xs font-medium text-muted-foreground` |
| `max-w-sm` no container do input | 🟡 Média | Limita largura — search bar deve usar largura total |
| Botão sem ícone | 🟡 Média | DESIGN.md: botões de ação devem ter ícone quando há espaço |
| Estado de loading apenas no texto do botão | 🟡 Média | Não há estado de loading visual na área de resultado |
| Resultado em cards individuais `sm:grid-cols-2` | 🟡 Média | Não segue estrutura de ficha com sections e `divide-y` |
| Badges "Optante Simples" e "MEI" com `border-primary/30 bg-primary/10` | 🟢 Baixa | Cores de badge aceitáveis, mas poderiam usar tokens semânticos (`bg-success/10`) |
| Sócios com card por sócio | 🟢 Baixa | Aceitável para lista, mas faltaria section header ALL CAPS |
| `ResultBox` genérico como wrapper | 🟡 Média | Não encapsula a estrutura canônica de ficha |
| `space-y-6` entre form e resultado | 🟢 Baixa | Densidade aceitável |
| Não tem empty state estruturado | 🔴 Alta | Estado idle não mostra nada abaixo do form |

#### Estrutura proposta (Layout E)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Consulta CNPJ                                                       │
│ Consulte dados de empresas pelo CNPJ                                │
├─────────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────┐ ┌──────────────┐ │
│ │ [00.000.000/0000-00]                         │ │ [Consultar]  │ │
│ └────────────────────────────────────────────────┘ └──────────────┘ │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ VAZIO:                                                              │
│ ┌───────────────────────────────────────────────────────────────┐  │
│ │ [Search]                                                      │  │
│ │ "Digite um CNPJ para consultar"                               │  │
│ │ "Dados fornecidos pela Receita Federal"                       │  │
│ └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│ RESULTADO:                                                          │
│ ┌──────────────────────┐ ┌──────────────────────┐                  │
│ │ IDENTIFICAÇÃO        │ │ LOCALIZAÇÃO          │                  │
│ ├──────────────────────┤ ├──────────────────────┤                  │
│ │ CNPJ          ...    │ │ Logradouro    ...    │                  │
│ │ Razão Social  ...    │ │ Número        ...    │                  │
│ │ Nome Fantasia ...    │ │ Complemento   ...    │                  │
│ │ Situação      ...    │ │ Bairro        ...    │                  │
│ │ Abertura      ...    │ │ Cidade/UF     ...    │                  │
│ └──────────────────────┘ │ CEP           ...    │                  │
│                          └──────────────────────┘                  │
│ ┌──────────────────────┐ ┌──────────────────────┐                  │
│ │ ATIVIDADE            │ │ CAPITAL E CONTATO    │                  │
│ ├──────────────────────┤ ├──────────────────────┤                  │
│ │ Principal     ...    │ │ Capital Social ...   │                  │
│ │ Natureza Jur. ...    │ │ Telefone       ...   │                  │
│ │ Porte         ...    │ │ E-mail         ...   │                  │
│ └──────────────────────┘ └──────────────────────┘                  │
│ ┌───────────────────────────────────────────────────────────────┐  │
│ │ SÓCIOS E ADMINISTRADORES                                      │  │
│ ├───────────────────────────────────────────────────────────────┤  │
│ │ Nome                    │ Cargo                               │  │
│ │ Fulano de Tal           │ Sócio-Administrador                 │  │
│ └───────────────────────────────────────────────────────────────┘  │
│ [Copiar dados]                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

#### Tarefas de refatoração

- [ ] Criar componente `<LayoutE>` e `<ResultSheet>`
- [ ] **Search bar:**
  - Input `w-full font-mono` com placeholder formatado
  - Botão "Consultar" com ícone `Search`/`Loader2`
  - Submit via Enter (`onKeyDown`)
  - Remover `max-w-sm`
- [ ] **Estados:**
  - Vazio: `border-dashed bg-muted/30` com ícone + descrição
  - Loading: `bg-muted/20` com spinner centralizado
  - Erro: `border-destructive/30 bg-destructive/5` com `AlertTriangle`
  - Resultado: grid `md:grid-cols-2` de sections
- [ ] **Ficha de resultado:**
  - Sections: IDENTIFICAÇÃO, LOCALIZAÇÃO, ATIVIDADE, CAPITAL E CONTATO
  - Cada section: card com header `border-b` + rows `divide-y`
  - Labels: `text-xs text-muted-foreground min-w-[100px]`
  - Valores: `text-xs text-right` (CNPJ, CEP, telefone em `font-mono`)
- [ ] **Sócios:** table ou lista com section header ALL CAPS
- [ ] **Badges:** usar `bg-success/10 text-success` para status positivos
- [ ] **Label do input:** `text-xs font-medium text-muted-foreground`
- [ ] **Botão de ação:** incluir ícone `Search`/`Loader2`

---

### 2. Decodificador PIX

**Arquivo:** `src/components/tools/decodificador-pix/decodificador-pix-client.tsx`
**Estado:** Layout vertical com textarea + botões + resultado em grid de cards.

#### Problemas identificados

| Problema | Severidade | Onde |
|---|---|---|
| Textarea sem header estruturado | 🟡 Média | Não há section header "CÓDIGO PIX" acima do textarea |
| Label em `text-sm font-medium` | 🟡 Média | `text-xs font-medium text-muted-foreground` |
| Botão "Decodificar" sem ícone | 🟡 Média | Deveria ter ícone (ex: `Search` ou `QrCode`) |
| Botão "Limpar" com `variant="secondary"` | 🟡 Média | DESIGN.md: ações secundárias em `outline` ou `ghost` |
| Badge "Código válido" com `rounded-full` | 🔴 Alta | DESIGN.md §6.2: max `rounded-lg` |
| Badge usa `bg-primary/20 text-primary` | 🟢 Baixa | Aceitável, mas `bg-success/10 text-success` é mais semântico |
| Botão "copiar" inline com `text-primary hover:underline` | 🟡 Média | Deveria ser `CopyButton` ou botão `ghost` |
| Grid de resultado em `sm:grid-cols-2` com cards | 🟡 Média | Não segue estrutura de ficha com `divide-y` |
| CRC em `text-xs text-muted-foreground` | ✅ Bom | Correto |
| `space-y-6` entre elementos | 🟢 Baixa | Densidade aceitável |
| Não tem empty state estruturado | 🔴 Alta | Estado inicial não mostra placeholder visual |
| Não tem loading state | 🔴 Alta | Decodificação é instantânea (client-side), mas poderia ter para consistência |

#### Estrutura proposta (Layout E)

```
┌─────────────────────────────────────────────────────────────────────┐
│ Decodificador PIX                                                   │
│ Decodifique códigos PIX Copia e Cola                                │
├─────────────────────────────────────────────────────────────────────┤
│ CÓDIGO PIX                                                          │
│ ┌─────────────────────────────────────────────────────────────┐    │
│ │ 00020126580014br.gov.bcb.pix0136...                         │    │
│ └─────────────────────────────────────────────────────────────┘    │
│ ┌──────────────┐ ┌──────────────┐                                  │
│ │ [Decodificar]│ │ [Limpar]     │                                  │
│ └──────────────┘ └──────────────┘                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│ VAZIO:                                                              │
│ ┌───────────────────────────────────────────────────────────────┐  │
│ │ [QrCode]                                                      │  │
│ │ "Cole um código PIX para decodificar"                         │  │
│ │ "Suporta todos os tipos de chave"                             │  │
│ └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│ RESULTADO:                                                          │
│ ┌────────────────────────┐ ┌────────────────────────┐              │
│ │ DADOS DA TRANSFERÊNCIA │ │ INFORMAÇÕES TÉCNICAS   │              │
│ ├────────────────────────┤ ├────────────────────────┤              │
│ │ Beneficiário    ...    │ │ Chave PIX       ...    │              │
│ │ Chave PIX       ...    │ │ Tipo            ...    │              │
│ │ Valor           ...    │ │ TxID            ...    │              │
│ │ Cidade          ...    │ │ CRC             ...    │              │
│ │ PSP             ...    │ │                        │              │
│ │ Info adicional  ...    │ │                        │              │
│ └────────────────────────┘ └────────────────────────┘              │
│ [badge: Código válido]  CRC: ABCD (calculado ABCD)                 │
└─────────────────────────────────────────────────────────────────────┘
```

#### Tarefas de refatoração

- [ ] Refatorar para `<LayoutE>`
- [ ] **Search bar:**
  - Section header "CÓDIGO PIX" em ALL CAPS
  - Textarea `font-mono` com `min-h-[120px]`
  - Botão "Decodificar" com ícone (`Search` ou `QrCode`) `variant="default"`
  - Botão "Limpar" com ícone `Trash` `variant="ghost"` (não `secondary`)
- [ ] **Estados:**
  - Vazio: ícone `QrCode` + instrução
  - Resultado: ficha com sections DADOS DA TRANSFERÊNCIA + INFORMAÇÕES TÉCNICAS
- [ ] **Ficha:**
  - Sections com header ALL CAPS
  - Rows com `divide-y`
  - Labels `text-xs text-muted-foreground min-w-[100px]`
  - Valores `text-xs text-right`
  - Código PIX, TxID, CRC em `font-mono`
- [ ] **Badge:**
  - "Código válido": `rounded-md` (nunca `rounded-full`), `bg-success/10 text-success`
  - "Atenção": `bg-warning/10 text-warning`
- [ ] **Botão copiar:** usar `<CopyButton>` em vez de link inline
- [ ] **CRC:** manter em `text-xs text-muted-foreground` abaixo do badge

---

### 3. Outras ferramentas Layout E

As ferramentas restantes (Consulta CEP, Tabela FIPE, Validador de Boleto, Validador de Cartão) provavelmente seguem o mesmo padrão vertical empilhado. A refatoração segue o mesmo modelo:

- **Search bar:** input `font-mono` + botão com ícone
- **Estados:** vazio/loading/erro/resultado
- **Ficha:** grid `md:grid-cols-2` de sections com `divide-y`
- **Tipografia:** labels `text-xs text-muted-foreground`, valores técnicos em `font-mono`

---

## Problemas no `PageLayout` (afeta todas)

**Arquivo:** `src/components/shared/page-layout.tsx`

| Problema | Onde | Fix |
|---|---|---|
| `font-bold` no h1 | Linha 52 | `font-semibold` (DESIGN.md §4.1) |
| `text-2xl font-bold` | Linha 52 | `text-2xl font-semibold tracking-tight` |

> Fix rápido: `font-bold` → `font-semibold`

---

## Anti-padrões a evitar

- ❌ Input de identificador sem `font-mono`
- ❌ Label em `text-sm font-medium text-foreground` — usar `text-xs font-medium text-muted-foreground`
- ❌ Resultado empilhado em coluna única no desktop — usar `md:grid-cols-2`
- ❌ Section headers sem ALL CAPS — sempre `text-caption font-semibold uppercase tracking-wider`
- ❌ Label e valor sem separação clara — usar `min-w-[100px]` no label
- ❌ Badge com `rounded-full` — max `rounded-md`
- ❌ Botão de ação sem ícone
- ❌ Botão "Limpar" com `variant="secondary"` — usar `ghost` ou `outline`
- ❌ Empty state ausente — estado idle deve mostrar placeholder visual
- ❌ Loading state ausente — sempre mostrar feedback durante consulta
- ❌ Cards individuais sem estrutura de ficha — agrupar em sections com `divide-y`
- ❌ `max-w-sm` no input — search bar deve usar largura disponível

---

## Checklist de implementação

### Estrutura
- [ ] Criar componente `<LayoutE>` em `src/components/shared/layout-e.tsx`
- [ ] Criar componente `<ResultSheet>` em `src/components/shared/result-sheet.tsx`
- [ ] Search bar: `flex gap-2` com `Input font-mono flex-1` + `Button` com ícone
- [ ] Submit via Enter (`onKeyDown`)
- [ ] Estados: vazio (`border-dashed`), loading (`animate-spin`), erro (`border-destructive/30`), resultado (grid)
- [ ] Grid de resultado: `grid-cols-1 md:grid-cols-2 gap-4`
- [ ] Cada seção: card com `border-b` no header + `divide-y` nas rows
- [ ] Cada row: label `text-xs text-muted-foreground min-w-[100px]` + valor `text-xs text-right` (mono quando aplicável)

### Tokens
- [ ] Container: `space-y-6`
- [ ] Estado vazio: `border-dashed border-border bg-muted/30`
- [ ] Estado loading: `border border-border bg-muted/20`
- [ ] Estado erro: `border-destructive/30 bg-destructive/5`
- [ ] Card de seção: `border border-border bg-card`
- [ ] Badge válido: `bg-success/10 text-success rounded-md` (nunca `rounded-full`)
- [ ] Badge alerta: `bg-warning/10 text-warning rounded-md`

### Tipografia
- [ ] Section headers: `text-caption font-semibold uppercase tracking-wider text-muted-foreground`
- [ ] Labels de campo: `text-xs text-muted-foreground min-w-[100px]`
- [ ] Valores técnicos (CNPJ, CEP, código PIX, CRC): `font-mono text-xs`
- [ ] Valores gerais: `text-xs text-right`
- [ ] Título: `text-2xl font-semibold tracking-tight`
- [ ] Nenhum `font-bold`

### Densidade
- [ ] Search bar: gap-2
- [ ] Grid de sections: gap-4
- [ ] Padding interno de card: header `px-4 py-2`, rows `px-4 py-2.5`
- [ ] Gap entre search e resultado: `space-y-6`

### Anti-soft-SaaS
- [ ] Input mono sempre visível
- [ ] Estados claros (vazio/loading/erro/resultado)
- [ ] Ficha densa com muitos dados visíveis de uma vez
- [ ] Botões de ação com ícones
- [ ] Nenhum espaço vazio sem propósito
