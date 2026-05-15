# Auditoria SEO Completa — Ferramenta Ninja

> Gerado em: 2026-05-15 | Base: código-fonte completo analisado por agentes especializados

---

## O QUE ESTÁ BEM (Pontos Fortes)

### Fundação técnica sólida
- **Metadata API nativa do Next.js** usada corretamente em todas as páginas — sem biblioteca extra, sem overhead
- **Title template** configurado (`%s | Ferramenta Ninja`) — consistência em todo o site
- **metadataBase** definido (`https://ferramenta.ninja`) — URLs absolutas corretas em OG/canonical
- **lang="pt-BR"** no HTML — sinal correto de idioma para o Google
- **Inter + JetBrains Mono** com `display: swap` — evita FOIT, sem impacto no CLS

### Schemas JSON-LD (dados estruturados)
Implementação acima da média para o segmento:
- `Organization` + `WebSite` com `SearchAction` (SearchBox no Google) — no `<head>` global
- `WebApplication` em cada ferramenta (isAccessibleForFree: true, browserRequirements, operatingSystem)
- `BreadcrumbList` em cada ferramenta e categoria
- `FAQPage` nas ferramentas relevantes (QR codes, calculadoras, conversores)
- `Article` + `BlogPosting` nos posts de blog
- `CollectionPage` com `ItemList` nas páginas de categoria

### Sitemap dinâmico (`src/app/sitemap.ts`)
- Cobre 100% das páginas: ferramentas (0.8), categorias (0.9), blog (0.7), estáticas (0.5), home (1.0)
- Prioridades e `changeFrequency` bem calibrados
- `lastModified` nos posts de blog usa `updatedAt` do conteúdo real

### Robots (`src/app/robots.ts`)
- Permite crawl de todo conteúdo público
- Bloqueia `/curriculo-render/` (páginas privadas com token) e `/api/` (endpoints internos)
- Aponta para o sitemap

### Redirects 301 (`next.config.ts`)
- 4 redirecionamentos permanentes de categorias antigas → novas — correto para preservar link juice

### Open Graph e Twitter Card
- Configurados globalmente com fallback
- OG image dinâmica via `/api/og` (Edge Runtime, 1200×630px)
- Posts de blog incluem `publishedTime` e `modifiedTime`

### Linkagem interna
- **Header:** nav com todas as categorias em dropdown
- **Footer:** categorias + 8 ferramentas populares (por peso/popularidade) + recursos + sobre
- **RelatedTools:** cada ferramenta linka 3–7 ferramentas relacionadas — PageRank interno distribuído
- **Breadcrumbs semânticos:** `<nav aria-label="breadcrumb">` com `<ol>/<li>` e `aria-current`

### Performance base
- `output: standalone`, `compress: true`, `poweredByHeader: false`
- Imagens em AVIF/WebP (`next.config.ts`)
- Sem imagens decorativas desnecessárias — site é orientado a ferramentas, texto domina
- Loading states nos componentes (idle → loading → done/error)

---

## O QUE ESTÁ RUIM / AUSENTE (Problemas e Lacunas)

### 🔴 CRÍTICO

#### 1. Zero analytics implementado
- **Problema:** Nenhum GA4, GTM, ou equivalente no código. A política de privacidade menciona "analytics anonimizado" — contradição.
- **Impacto:** Impossível medir tráfego orgânico, conversões, bounce rate, quais ferramentas performam. Sem dados = sem estratégia baseada em evidência.
- **Arquivo:** `src/app/layout.tsx` — adicionar `<Script>` do GA4 ou GTM

#### 2. Blog com conteúdo insuficiente
- **Problema:** Apenas 3 posts. Para um site com 96 ferramentas cobrindo finanças, identidade, PDF, imagem, QR code, CSV — o blog é quase invisível.
- **Impacto:** Sem blog robusto, o site compete apenas por queries transacionais ("gerador de QR code"). Keywords informacionais ("como criar QR code PIX", "o que é CDI", "como calcular rescisão") ficam sem cobertura.
- **Oportunidade perdida:** Cada categoria e ferramenta popular deveria ter um artigo pilar.

#### 3. Imagem OG genérica para todas as ferramentas
- **Problema:** Todas as ferramentas usam a mesma `/api/og` sem parâmetros customizados na maioria das páginas. A rota aceita `?title=` mas as tool pages não estão passando esse parâmetro via metadata.
- **Impacto:** Ao compartilhar uma ferramenta específica no WhatsApp/LinkedIn/X, a imagem exibida é genérica — taxa de clique menor.
- **Correção:** Nos metadados de cada tool page, usar `/api/og?title={toolName}`.

### 🟠 IMPORTANTE

#### 4. `console.error()` em produção
- **Arquivo:** `src/app/error.tsx` linha 15
- **Problema:** Vaza informações de erro no console do usuário.

#### 5. `keywords` meta tag inconsistente
- Algumas páginas têm array de keywords, a maioria não. Google não usa esse campo para ranking, mas a inconsistência aponta para processo de criação de metadata sem padrão enforçado.

#### 6. Twitter Card apenas no root layout
- Páginas individuais não sobrescrevem `twitter.images`. Se alguém compartilha uma ferramenta específica no X, usa a imagem genérica em vez da `/api/og?title=`.

#### 7. Sem `manifest.json` (PWA)
- Arquivo `public/manifest.json` ausente.
- Para um site de ferramentas usadas no celular, PWA básico é relevante. Google considera positivo para mobile UX.

#### 8. Sem Suspense / `loading.tsx` nas rotas
- Next.js App Router suporta `loading.tsx` por rota para skeleton screens durante navegação.
- Nenhum arquivo `loading.tsx` encontrado em nenhuma rota.
- Impacto: percepção de velocidade em navegações client-side.

#### 9. Sem schema `HowTo` nas calculadoras e geradores
- Calculadoras trabalhistas, simuladores financeiros e geradores de QR code são candidatos naturais para schema `HowTo`.
- O Google exibe rich results de "How-to" com steps na SERP — diferenciação visual significativa.

#### 10. Sem `aggregateRating` no schema `WebApplication`
- `WebApplication` está implementado, mas sem `aggregateRating`. Sites que têm avaliações aparecem com estrelas na SERP.
- Solução: sistema simples de avaliação (localStorage ou backend) exposto no schema.

#### 11. Thin content em ferramentas simples
- Ferramentas como `cronometro-online`, `manter-tela-ligada`, `sorteio-online` têm utilidade real mas podem ter pouco texto no SeoContent.
- Google pode classificar como thin content se a página tiver menos de ~300 palavras de conteúdo útil.

### 🟡 OPORTUNIDADES

#### 12. Páginas que deveriam existir e não existem

| Página / Conteúdo | Justificativa SEO |
|---|---|
| Blog: "Como calcular rescisão trabalhista passo a passo" | Alta intenção informacional, leva direto para a ferramenta |
| Blog: "O que é CDI e como calcular rendimento" | Consulta financeira muito buscada |
| Blog: "Como criar QR Code PIX para o seu negócio" | Combina duas ferramentas populares |
| Blog: "Tabela FIPE: como consultar o valor do seu carro" | Alta demanda de busca, leva para a ferramenta |
| Blog: "CNPJ para MEI: como validar e consultar" | Contexto para ferramentas de validação |
| `/ferramentas/conversor-pdf-para-word` | Um dos termos mais buscados em ferramentas de PDF |
| `/ferramentas/calculadora-de-imposto-renda` | Altamente buscado em período de IR (anual, sazonal) |
| `/ferramentas/verificador-de-links` | Ferramenta para desenvolvedores, nicho forte |
| `/ferramentas/gerador-de-link-instagram` | Análogo ao gerador de link WhatsApp — fácil de criar |
| Hub `/ferramentas/qr-code` consolidado | Landing page reunindo as 6 ferramentas QR com linkagem concentrada |

#### 13. Categoria `/categorias/[slug]` sem conteúdo editorial
- As páginas de categoria listam ferramentas mas têm pouco conteúdo textual diferenciado.
- Adicionar parágrafo introdutório de 150–200 palavras por categoria aumenta relevância topical e pode ranquear para termos de categoria.

#### 14. FAQ ausente em várias categorias
- `faqSchema` está implementado (`src/lib/seo/jsonld.ts`) mas não aplicado em todas as categorias.
- Categorias como "calculadoras", "validadores", "consultas" têm perguntas óbvias a responder.

#### 15. Nenhuma estratégia de Core Web Vitals documentada
- CWV (LCP, INP, CLS) não são monitorados — sem analytics, não tem como saber.
- Fontes com `display: swap` ✅, AVIF ✅, mas INP das ferramentas interativas não está medido.

#### 16. Sem Preconnect / DNS Prefetch para recursos externos
- Nenhuma tag `<link rel="preconnect">` no layout.
- Verificar se Inter/JetBrains são servidas localmente (via `next/font` serve localmente ✅ — OK) ou via CDN externo.

---

## PÁGINAS QUE PODEM NÃO PRECISAR EXISTIR

| Página | Status | Análise |
|--------|--------|---------|
| `/curriculo-render/[token]` | Bloqueada em robots.txt ✅ | Nenhum risco — já protegida |
| `/api/*` | Bloqueada em robots.txt ✅ | Correto |
| `/politica-de-privacidade` | Priority 0.5, yearly | Baixo valor SEO mas necessária juridicamente |
| `/termos-de-uso` | Priority 0.5, yearly | Idem |
| `/metodologia` | Conteúdo possivelmente fino | Se tiver <200 palavras, considerar merge com `/sobre` ou enriquecer |

Nenhuma página atual é claramente prejudicial ao SEO. Não há canibalização identificada.

---

## DIAGNÓSTICO GERAL

| Área | Nota | Detalhe |
|------|------|---------|
| Metadata (title/desc) | A | Todas as páginas têm, template correto |
| JSON-LD / Schemas | A | 7 tipos implementados, cobertura ampla |
| Sitemap | A | Dinâmico, completo, prioridades corretas |
| Robots | A | Correto, bloqueia apenas o necessário |
| Redirects | A | 301 permanentes, preserva link juice |
| Open Graph | B+ | Global OK, imagem dinâmica por-página pode melhorar |
| Linkagem interna | B+ | Header, footer, related tools — boa cobertura |
| Blog / Conteúdo | C | 3 posts é insuficiente para o tamanho do site |
| Analytics | F | Não existe — problema crítico |
| Core Web Vitals | B | Fontes e imagens OK, INP sem dados |
| Schemas avançados (HowTo, Ratings) | C | Apenas o básico implementado |
| PWA / Manifest | D | Ausente |

---

## PLANO DE AÇÃO

### Fase 1 — Crítico (imediato)
1. **Instalar GA4** via `next/script` com `strategy="afterInteractive"` em `src/app/layout.tsx`
2. **Corrigir OG image dinâmica** nas tool pages — passar `?title=` na URL da imagem nos metadados
3. **Remover `console.error()`** de `src/app/error.tsx` linha 15

### Fase 2 — Importante (próximas 2 semanas)
4. **Criar `public/manifest.json`** com ícones, nome, cores — PWA básico
5. **Adicionar schema `HowTo`** nas 5 calculadoras mais acessadas
6. **Escrever 5 artigos de blog** alinhados às ferramentas de maior tráfego potencial
7. **Adicionar `loading.tsx`** nas rotas de ferramentas para skeleton screens

### Fase 3 — Oportunidades (próximo mês)
8. **Conteúdo editorial em páginas de categoria** — 150–200 palavras por categoria
9. **FAQ nas categorias** usando `faqSchema` já disponível em `src/lib/seo/jsonld.ts`
10. **Criar hub `/ferramentas/qr-code`** consolidando as 6 ferramentas QR
11. **Sistema de avaliação simples** para expor `aggregateRating` no schema

### Fase 4 — Crescimento (contínuo)
12. **Blog: cadência mínima de 2 artigos/mês** por 6 meses — foco em termos informacionais de alta demanda
13. **Novas ferramentas:** conversor PDF→Word, calculadora IR, verificador de links
14. **Monitorar CWV** via GA4 + Google Search Console após analytics instalado

---

## ARQUIVOS-CHAVE

| Arquivo | Ação |
|---------|------|
| `src/app/layout.tsx` | Adicionar GA4 Script |
| `src/app/error.tsx` | Remover console.error (linha 15) |
| `src/lib/seo/jsonld.ts` | Adicionar `howToSchema()` e suporte a `aggregateRating` |
| `src/app/sitemap.ts` | Incluir novos posts de blog quando criados |
| `src/app/ferramentas/*/page.tsx` | Atualizar imagem OG para incluir `?title=` |
| `public/manifest.json` | Criar do zero |
| `src/app/blog/` | Criar novos posts |
| `src/app/categorias/[slug]/page.tsx` | Adicionar conteúdo editorial e FAQ |
