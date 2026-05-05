# Plano de Melhorias — Ferramenta Ninja

## Parte 1: Componente Reutilizável `OptionSwitch` ✅

**Objetivo:** Criar `src/components/shared/option-switch.tsx` baseado no switch Formatado/Minificado do `mock-data-generator.tsx:261-307`.

**Props:**
```ts
type OptionSwitchProps = {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
};
```

**Estilo:** Container `flex items-center gap-1 rounded-lg border p-1`. Botão ativo `bg-primary text-primary-foreground`, inativo `text-muted-foreground hover:text-foreground`.

---

## Parte 2: Adicionar `compact` a 12 páginas ✅

Adicionar prop `compact` no `<PageLayout>` dos arquivos:

| # | Arquivo |
|---|---------|
| 1 | `src/app/ferramentas/calculadora-salario-liquido/page.tsx` |
| 2 | `src/app/ferramentas/calculadora-13-salario/page.tsx` |
| 3 | `src/app/ferramentas/calculadora-de-hora-extra/page.tsx` |
| 4 | `src/app/ferramentas/calculadora-de-ferias/page.tsx` |
| 5 | `src/app/ferramentas/calculadora-de-rescisao/page.tsx` |
| 6 | `src/app/ferramentas/simulador-financiamento/page.tsx` |
| 7 | `src/app/ferramentas/rendimento-cdi-Selic/page.tsx` |
| 8 | `src/app/ferramentas/calculadora-de-dias-uteis/page.tsx` |
| 9 | `src/app/ferramentas/leitor-de-qr-code/page.tsx` |
| 10 | `src/app/ferramentas/gerador-de-codigo-de-barras/page.tsx` |
| 11 | `src/app/ferramentas/paleta-de-cores/page.tsx` |
| 12 | `src/app/ferramentas/teste-digitacao/page.tsx` |

**Mudança:** Adicionar `compact` antes de `toolHref` em cada `<PageLayout>`.

---

## Parte 3: Ajustes em Componentes Existentes (5 ferramentas) ✅

### 3a. `calculadora-de-porcentagem`
- **Arquivo:** `src/components/tools/percentage-calculator/percentage-calculator.tsx`
- `CalculatorCard`: adicionar `bg-card` na div wrapper
- `ResultDisplay`: substituir componente interno pelo `ResultBox` importado com `tone="primary"`, label="Resultado", valor como children

### 3b. `calculadora-de-dias-uteis`
- **Arquivo:** `src/components/tools/business-days-calculator/business-days-calculator.tsx`
- Substituir os dois `<button>` mode tabs (range/add) pelo `<OptionSwitch>`
- Opções: `[{label:"Dias úteis entre datas", value:"range"}, {label:"Adicionar dias úteis", value:"add"}]`

### 3c. `teste-digitacao`
- **Arquivo:** `src/components/tools/typing-test/typing-test.tsx`
- Botão Iniciar: adicionar `<Play>` quando idle, `<RotateCcw>` quando reiniciar
- Duração: substituir `<NativeSelect>` pelo `<OptionSwitch>` com opções `[{label:"30s",value:"30"}, {label:"1 min",value:"60"}, {label:"2 min",value:"120"}]`

### 3d. `recortar-imagem`
- **Arquivo:** `src/components/tools/image-cropper/image-cropper.tsx`
- Remover `max-w-2xl` da div wrapper principal (linha ~113) para card ocupar largura total

### 3e. `cronometro-online`
- **Arquivo:** `src/components/tools/stopwatch/stopwatch.tsx`
- Adicionar centralização horizontal completa no wrapper principal

---

## Parte 4: Reorganização de Layout (3 ferramentas) ✅

### 4a. `manter-tela-ligada`
- **Arquivo:** `src/components/tools/keep-awake/keep-awake.tsx`
- Trocar `space-y-8 lg:h-100` por `flex flex-col items-center justify-center` para centralizar verticalmente

### 4b. `converter-markdown-para-html`
- **Arquivo:** `src/components/tools/markdown-to-html/markdown-to-html.tsx`
- Botão Limpar: mover do header do editor para abaixo do `<Textarea>`
- Toolbar (Copiar HTML, Baixar, checkbox CSS): mover para dentro da coluna do preview, abaixo do container de preview
- Garantir `min-h-[400px]` igual em editor e preview

### 4c. `gerador-gradiente-css`
- **Arquivo:** `src/components/tools/gradient-generator/gradient-generator.tsx`
- Mover `<CopyButton>` do header `justify-between` para abaixo do `<pre>`, alinhado à direita (`flex justify-end`)
