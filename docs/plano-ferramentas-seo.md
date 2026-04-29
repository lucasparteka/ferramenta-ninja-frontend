# Plano de Ferramentas para Tráfego Orgânico (SEO)

## Objetivo

Criar ferramentas online gratuitas em pt-BR que atendem a intenções de busca reais no Google, gerando tráfego orgânico constante para a Ferramenta Ninja. A estratégia é: cada ferramenta = 1 página otimizada para 1 keyword cluster.

## Critérios de seleção

- **Frontend-first**: ferramentas que rodam 100% no browser, sem backend
- **Sem dependência de IA**: todas funcionam sem LLMs
- **Volume de busca**: priorizar keywords com alto volume no Google Brasil
- **Intenção informacional/transacional**: o usuário quer resolver um problema rápido
- **Diferencial**: interface limpa, resultado rápido, sem cadastro, sem propaganda invasiva

## Análise de volume de busca (estimativa mensal pt-BR)

Baseado em dados do Google Keyword Planner e Ubersuggest, agrupados por tier de prioridade.

---

## Tier 1 — Alta prioridade (implementado)

Ferramentas com alto volume de busca e implementação frontend-only simples.

| # | Ferramenta | Slug | Keyword principal | Volume mensal | Status |
|---|---|---|---|---|---|
| 1 | Comprimir Imagem | `/ferramentas/comprimir-imagem` | comprimir imagem | ~12.000 | ✅ Implementado |
| 2 | Redimensionar Imagem | `/ferramentas/redimensionar-imagem` | redimensionar imagem | ~8.100 | ✅ Implementado |
| 3 | Converter Imagem | `/ferramentas/converter-imagem` | converter imagem para png/jpg | ~6.600 | ✅ Implementado |
| 4 | Formatar JSON | `/ferramentas/formatar-json` | formatar json | ~8.100 | ✅ Implementado |

**Infraestrutura criada no Tier 1:**
- `src/lib/image/` — compressão, redimensionamento, conversão
- `src/components/shared/image-dropzone.tsx` — drag-and-drop reutilizável
- `src/components/shared/result-box.tsx` — ResultBox, ResultRow, ResultGrid
- `src/components/ui/input.tsx` — Input com `rounded-lg`
- `src/components/ui/textarea.tsx` — Textarea com `rounded-lg`
- `src/components/ui/select-native.tsx` — NativeSelect com `rounded-lg`

**Infraestrutura criada nos Tiers 2-3:**
- `src/lib/color/palette.ts` — conversão HEX↔RGB↔HSL, geração de paletas
- `src/lib/color/gradient.ts` — construção de gradientes CSS com color stops
- `src/lib/text/typing-test.ts` — amostras de texto, cálculos WPM/CPM/acurácia
- `src/utils/image.ts` — extração de crop via Canvas (`getCroppedImg`, `getCroppedImgFromElement`)
- `@theme inline` em `globals.css` — tokens `--color-code-bg` e `--color-code-text` para blocos escuros
- Chips toggle — substituíram `<NativeSelect>` onde aplicável (proporções, formatos, etc)

---

## Tier 2 — Média-alta prioridade (implementado)

Ferramentas de text/code com alto volume e implementação frontend-only.

| # | Ferramenta | Slug | Keyword principal | Volume mensal | Status |
|---|---|---|---|---|---|
| 5 | Base64 Encoder/Decoder | `/ferramentas/base64` | base64 encode decode | ~6.600 | ✅ Implementado |
| 6 | Timestamp Converter | `/ferramentas/converter-timestamp` | converter timestamp | ~4.400 | ✅ Implementado |
| 7 | Minificador CSS/JS/HTML | `/ferramentas/minificador-css` | minificar css/js | ~3.600 | ✅ Implementado |
| 8 | Teste de Digitação | `/ferramentas/teste-digitacao` | teste de digitação | ~2.400 | ✅ Implementado |
| 9 | Cronômetro Online | `/ferramentas/cronometro-online` | cronometro online | ~6.600 | ✅ Implementado |
| 10 | Gerador de Texto (Lorem Ipsum) | `/ferramentas/gerador-de-texto` | gerador de texto | ~14.800 | ✅ Implementado* |

\* O Gerador de Texto já cobre a funcionalidade de Lorem Ipsum. |

---

## Tier 3 — Média prioridade

Ferramentas de design/código com volume moderado.

| # | Ferramenta | Slug | Keyword principal | Volume mensal | Status |
|---|---|---|---|---|---|
| 11 | Paleta de Cores | `/ferramentas/paleta-de-cores` | paleta de cores | ~4.400 | ✅ Implementado |
| 12 | Gerador de Gradiente CSS | `/ferramentas/gerador-gradiente-css` | gradiente css | ~2.900 | ✅ Implementado |
| 13 | Recortar Imagem | `/ferramentas/recortar-imagem` | recortar imagem | ~3.600 | ✅ Implementado |
| 14 | Gerador de Meta Tags | `/ferramentas/gerador-meta-tags` | meta tags gerador | ~2.400 | ✅ Implementado |
| 15 | Assinatura de Email | `/ferramentas/assinatura-email` | assinatura email | ~2.400 | 🔲 Pendente |

---

## Tier 4 — Requer backend (futuro)

Ferramentas que precisariam de API ou processamento server-side.

| # | Ferramenta | Slug | Keyword principal | Volume mensal | Status |
|---|---|---|---|---|---|
| 16 | Markdown → HTML | `/ferramentas/markdown-para-html` | markdown para html | ~2.900 | 🔲 Backend |
| 17 | SVG → PNG | `/ferramentas/svg-para-png` | converter svg para png | ~2.400 | 🔲 Backend |
| 18 | Regex Tester | `/ferramentas/teste-regex` | regex tester | ~3.600 | 🔲 Backend* |
| 19 | Conversor de Moeda | `/ferramentas/converter-moeda` | converter moeda/dolar | ~14.800 | 🔲 Backend |
| 20 | Texto para Redes Sociais | `/ferramentas/texto-redes-sociais` | texto para instagram | ~2.400 | 🔲 Backend* |

*Regex e Texto redes sociais podem ser frontend-only, mas precisam de UX mais complexa.

---

## Volume total estimado

| Tier | Ferramentas | Volume mensal estimado |
|---|---|---|
| T1 (implementado) | 4 | ~34.800 |
| T2 (implementado) | 6 | ~38.400 |
| T3 (parcial) | 4/5 | ~13.300 |
| T4 (backend) | 5 | ~26.100 |
| **Total** | **20** | **~112.600** |

---

## Padrões de implementação

### Estrutura de cada ferramenta

```
src/components/tools/<slug>/
  <slug>.tsx              # Componente client-side
src/app/ferramentas/<slug>/
  page.tsx                # Página Next.js com SEO (metadata, FAQ, conteúdo)
src/lib/<categoria>/
  <modulo>.ts             # Lógica pura (se necessário)
```

### Componentes reutilizáveis

- `PageLayout` — layout padrão de cada ferramenta
- `ResultBox` / `ResultRow` / `ResultGrid` — exibição de resultados numéricos
- `ImageDropzone` — upload de imagens com drag-and-drop
- `ImageUploader` — upload com crop integrado (usa `react-image-crop`)
- `Input` (shadcn, `rounded-lg`) — campos de texto
- `Textarea` (shadcn, `rounded-lg`) — campos de texto multilinha
- `NativeSelect` (shadcn, `rounded-lg`) — dropdowns
- `Slider` — controles de range
- `DateInput` — campo de data com date picker
- `ColorPicker` — seletor de cor com HEX/RGB/HSL

### Layout padrão (stacked)

- Formulário em cima, resultados embaixo
- Resultados só aparecem após cálculo (não mostram "—")
- Valores principais em `text-primary` (não verde)
- Valores negativos/destrutivos em `text-destructive`
- Formulário com `max-w-2xl` (ou `max-w-4xl` para ferramentas de código), sem card wrapper
- Resultados com `ResultBox` → `ResultGrid` → `ResultRow`
- Inputs de código grandes: `min-h-[300-400px]` com fonte mono
- Blocos de código com fundo escuro via `@theme inline` (`--color-code-bg`, `--color-code-text`)
- Chips toggle em vez de `<NativeSelect>` onde aplicável (proporções, formatos)
- Sem classes arbitrárias hardcoded (`bg-[#...]`)
- Usar `DateInput` do projeto para campos de data

### SEO por página

- `title` e `description` específicos por ferramenta
- FAQ com `schema.org/FAQPage`
- H1, H2 com keywords
- Conteúdo SEO abaixo da ferramenta
- Breadcrumbs com structured data
- Sitemap automático via `next-sitemap`

---

## Próximos passos

1. **Tier 3** — Implementar Assinatura de Email (última pendente do Tier 3)
2. **Tier 4** — Avaliar quais podem ser frontend-only antes de implementar
3. **Padronização** — Continuar migrando ferramentas existentes para os padrões atuais
4. **Monitoramento** — Registrar no Google Search Console e acompanhar impressões/cliques por página