# Plano: Wrapper compacto para ferramentas simples

## Problema
Ferramentas com pouco conteúdo (1-3 inputs, 1 botão) ficam "perdidas" na página entre o cabeçalho/separator e os cards de categoria, ocupando pouco espaço vertical.

## Solução
Adicionar prop `compact` ao `PageLayout`. Quando ativa, o `{children}` é envolvido num card visual centralizado com altura mínima.

---

## ✅ Parte 1 — Adicionar prop `compact` ao PageLayout

**Arquivo:** `src/components/shared/page-layout.tsx`

- Adicionar `compact?: boolean` ao tipo `PageLayoutProps`
- Substituir `{children}` por um container condicional:

```tsx
{compact ? (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="w-full max-w-lg rounded-xl border bg-card p-8 shadow-sm">
      {children}
    </div>
  </div>
) : (
  children
)}
```

---

## Parte 2 — Identificar ferramentas simples (classificação)

Critérios para ser classificada como **SIMPLE** (recebe `compact`):

1. ≤3 elementos interativos (inputs, buttons, checkboxes, selects)
2. Sem `type="file"` (upload de arquivo)
3. Sem `<canvas>` / tabelas
4. Saída é texto curto, não listas longas ou previews visuais grandes

**Lista classificada (~35 ferramentas):**

| Página | Componente | Motivo |
|--------|-----------|--------|
| base64 | 2 textareas + button | Pouco conteúdo |
| calculadora-adicional-noturno | 2 inputs + button | Pouco conteúdo |
| calculadora-de-idade | 2 inputs + button | Pouco conteúdo |
| calculadora-de-imc | 2 inputs + button | Pouco conteúdo |
| codigo-binario | 2 textareas | Pouco conteúdo |
| codigo-morse | 2 textareas | Pouco conteúdo |
| consulta-cep | 1 input + button | Pouco conteúdo |
| consulta-cnpj | 1 input + button | Pouco conteúdo |
| contador-de-caracteres | 1 textarea | Pouco conteúdo |
| conversor-csv-json | 2 textareas + button | Pouco conteúdo |
| conversor-de-temperatura | 3 inputs | Pouco conteúdo |
| conversor-de-texto | 2 textareas | Pouco conteúdo |
| conversor-timestamp | 2 inputs | Pouco conteúdo |
| cronometro-online | 4 buttons + timer | Pouco conteúdo |
| decodificador-pix | 1 input + button | Pouco conteúdo |
| formatar-json | 2 textareas + buttons | Pouco conteúdo |
| gerador-de-cnpj | 2 inputs + checkbox + button | Pouco conteúdo |
| gerador-de-cpf | 2 inputs + checkbox + button | Pouco conteúdo |
| gerador-de-numeros | inputs + button | Pouco conteúdo |
| gerador-de-senha | checkboxes + slider + button | Pouco conteúdo |
| gerador-de-texto | 1 textarea + button | Pouco conteúdo |
| gerador-de-uuid | select + input + button | Pouco conteúdo |
| gerador-meta-tags | 3 inputs | Pouco conteúdo |
| limpar-texto | textarea + options | Pouco conteúdo |
| manter-tela-ligada | 1 button | Pouco conteúdo |
| minificador-css | 2 textareas + button | Pouco conteúdo |
| numero-por-extenso | 1 input + button | Pouco conteúdo |
| previa-resultado-google | 3 inputs + preview | Pouco conteúdo |
| remover-caracteres-invisiveis | textarea + button | Pouco conteúdo |
| remover-duplicados | textarea + button | Pouco conteúdo |
| remover-espacos-duplicados | textarea + button | Pouco conteúdo |
| remover-quebras-de-linhas | textarea + button | Pouco conteúdo |
| sorteio-online | textarea + button | Pouco conteúdo |
| validador-de-boleto | 1 input + button | Pouco conteúdo |
| validador-de-cartao-de-credito | 1 input + button | Pouco conteúdo |

---

## ✅ Parte 3 — Adicionar `compact` nas páginas identificadas

Para cada página da lista acima, editar `src/app/ferramentas/<slug>/page.tsx`:

**Antes:**
```tsx
<PageLayout toolHref=... title=... description=...>
```

**Depois:**
```tsx
<PageLayout compact toolHref=... title=... description=...>
```

Estratégia: script batch via sed/jscodeshift para aplicar em todos os ~35 arquivos de uma vez.

---

## ✅ Parte 4 — Verificar build

```bash
npx tsc --noEmit          # ✅ apenas erros pré-existentes em .next
npx biome check ./src     # ✅ apenas erros pré-existentes de formatação/imports
```

---

## Parte 5 — Revisão visual (manual)

Abrir no navegador ~5 ferramentas representativas:

- **Simples com compact**: `base64`, `gerador-de-cpf`, `consultar-cep`
- **Simples sem compact** (verificar se não foi incluída erroneamente): `calculadora-de-porcentagem`
- **Complexa** (verificar se não pegou compact indevidamente): `simulador-de-financiamento`, `criador-de-curriculo`

Ajustes finos no `max-w-lg` do card se necessário (algumas ferramentas podem precisar de mais largura).
