# Plano de Implementação: Gerador de Dados Mock

## 1. Visão Geral

Criar uma ferramenta que gere dados mock realistas (JSON e CSV) para desenvolvedores usarem em testes, prototipação e desenvolvimento. A ferramenta seguirá o padrão estabelecido no projeto: página Next.js com `PageLayout`, componente client interativo, SEO completo e conteúdo explicativo.

## 2. Análise do Projeto

### 2.1 Stack Tecnológico
- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS + shadcn/ui
- **Ícones**: Lucide React
- **Padrão de Ferramentas**: Cada ferramenta = rota em `src/app/ferramentas/<slug>/page.tsx`

### 2.2 Componentes Compartilhados Disponíveis
- `PageLayout` → SEO, breadcrumb, FAQ, related tools, JSON-LD
- `CopyButton` → Clipboard com feedback visual (ícones Copy/Check com transição)
- `ResultBox/ResultRow/ResultGrid` → Exibição de resultados estruturados
- `Slider` → Seletor de quantidade
- `Button`, `Textarea`, `Select` → shadcn/ui base

### 2.3 Libs Utilitárias Existentes
- `src/lib/text/random.ts` → Geração de palavras/frases aleatórias (pode ser reaproveitada)
- `src/lib/data/tools.ts` → Registro central de todas as ferramentas
- `src/lib/seo/jsonld.ts` → Schemas para SEO

### 2.4 Padrão de Página de Ferramenta
```tsx
// Estrutura padrão observada em ferramentas existentes:
1. Export metadata (title, description, keywords)
2. Componente SeoContent() com sections explicativas
3. Page default com <PageLayout toolHref="..." title="..." description="...">
4. Componente client da ferramenta como children
```

---

## 3. Arquivos a Criar/Modificar

### 3.1 Registro da Ferramenta
**Arquivo**: `src/lib/data/tools.ts`
**Ação**: Adicionar nova ferramenta na categoria `"dados"`

```typescript
{
  name: "Gerador de Dados Mock",
  href: "/ferramentas/gerador-de-dados-mock",
  description: "Gere dados mock realistas em JSON e CSV para testes e desenvolvimento",
  icon: Database,  // ou Package
  tags: ["mock", "json", "csv", "dados", "teste", "dev"],
  intent: "generate",
  weight: 2,
}
```

### 3.2 Página da Ferramenta
**Arquivo**: `src/app/ferramentas/gerador-de-dados-mock/page.tsx`
**Ação**: Criar página com metadata SEO e estrutura padrão

**Metadata**:
- Title: "Gerador de Dados Mock Online Grátis | Ferramenta Ninja"
- Description: "Gere dados mock realistas em JSON e CSV. Usuários, produtos, API responses e edge cases para testes e desenvolvimento."
- Keywords: `["dados mock", "json exemplo", "fake data generator", "dados para teste", "csv mock", "gerador de dados"]`

**SeoContent sections**:
1. O que são dados mock?
2. Casos de uso (testes, prototipação, APIs, performance)
3. Tipos de dados disponíveis
4. Perguntas frequentes (5-6 FAQs)

### 3.3 Componentes da Ferramenta

#### `src/components/tools/mock-data/mock-data-generator.tsx` (CLIENT COMPONENT)
Componente principal da ferramenta. Responsabilidades:
- Estado: tipo de dado, quantidade, formato (JSON/CSV), estado de minificação
- Chamar funções de geração
- Exibir resultado com syntax highlight
- Ações: copiar, download, alternar formato

#### `src/components/tools/mock-data/data-type-selector.tsx`
Seletor de tipo de dado mock:
- Usuário
- Produto
- API Response (success)
- API Response (error)
- Paginação
- Edge Cases

#### `src/components/tools/mock-data/output-viewer.tsx`
Visualizador de saída:
- Syntax highlight para JSON (reutilizar lógica do json-formatter)
- Preview com scroll
- Toggle formatado/minificado
- Contador de registros/bytes

### 3.4 Libs de Geração de Dados

#### `src/lib/mock-data/generators.ts`
Funções puras de geração:

```typescript
export type MockDataType = "user" | "product" | "api-success" | "api-error" | "pagination" | "edge-cases";

export interface MockUser {
  id: number;
  name: string;
  email: string;
  address: { street: string; city: string; state: string; zip: string };
  roles: string[];
  createdAt: string;
}

export interface MockProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  sku: string;
}

export function generateUsers(count: number): MockUser[]
export function generateProducts(count: number): MockProduct[]
export function generateApiResponse(type: "success" | "error", data: unknown)
export function generatePagination(data: unknown[], page: number, limit: number)
export function generateEdgeCases(): Record<string, unknown>
```

#### `src/lib/mock-data/csv-export.ts`
Conversão para CSV:
```typescript
export function jsonToCSV(data: Record<string, unknown>[]): string
export function downloadFile(content: string, filename: string, mimeType: string)
```

#### `src/lib/mock-data/names.ts`
Listas de dados realistas (nomes brasileiros, cidades, categorias de produtos) para evitar dados genéricos em inglês.

---

## 4. Especificação de Funcionalidades

### 4.1 Gerador Simples (MVP)
- [ ] Seletor de tipo de dado (dropdown)
- [ ] Seletor de quantidade (10, 50, 100, 500, 1000, 10000)
- [ ] Botão "Gerar"
- [ ] Preview do resultado com syntax highlight
- [ ] Botão "Copiar" (reutilizar CopyButton)
- [ ] Botão "Download JSON"
- [ ] Botão "Download CSV" (quando aplicável)
- [ ] Toggle "Formatado / Minificado"

### 4.2 Dados Realistas
- [ ] **Usuário**: nome brasileiro, email válido, endereço com cidade/estado BR, roles (admin, user, editor), createdAt ISO
- [ ] **Produto**: nome realista, preço em BRL, estoque, categoria, SKU
- [ ] **API Response**: estrutura completa com status, message, data, timestamp
- [ ] **Paginação**: page, limit, total, totalPages, data[]
- [ ] **Edge Cases**: strings longas, caracteres especiais (ç, ã, é, emojis), null, undefined, datas em múltiplos formatos, números extremos (MAX_SAFE_INTEGER, negativos, decimais)

### 4.3 Feedback Visual
- [ ] Toast/estado "Copiado!" ao copiar
- [ ] Contador de registros gerados
- [ ] Indicador de tamanho (bytes/KB)
- [ ] Loading state durante geração de grandes volumes

---

## 5. SEO e Conteúdo

### 5.1 Keywords Alvo
Primárias: `dados mock`, `gerador de dados mock`, `json exemplo`, `fake data generator`
Secundárias: `dados para teste`, `csv mock`, `mock api response`, `edge cases dados`

### 5.2 Estrutura de Conteúdo SEO
```
H1: Gerador de Dados Mock Online
→ Descrição curta
→ Componente da ferramenta
→ Seção: O que são dados mock?
→ Seção: Casos de uso
→ Seção: Tipos de dados disponíveis
→ Seção: Perguntas frequentes (FAQ)
→ RelatedTools
```

### 5.3 FAQ Sugerido
1. O que são dados mock?
2. Para que servem dados mock?
3. Posso usar em produção?
4. Quais formatos são suportados?
5. Há limite de registros?
6. Os dados são enviados para servidor?

---

## 6. Dependências

### 6.1 Verificar/Instalar
- `lucide-react` → já instalado (usar ícone Database ou Package)
- Componentes shadcn/ui → verificar se `Select`, `Button`, `Textarea` estão disponíveis
- Syntax highlight → reutilizar lógica do `json-formatter` (função `highlightJSON`)

### 6.2 Sem Dependências Externas
Toda a geração será feita no cliente, sem chamadas de API.

---

## 7. Checklist de Implementação

### Fase 1: Setup
- [ ] Adicionar ferramenta em `src/lib/data/tools.ts`
- [ ] Criar diretórios:
  - `src/app/ferramentas/gerador-de-dados-mock/`
  - `src/components/tools/mock-data/`
  - `src/lib/mock-data/`

### Fase 2: Libs de Geração
- [ ] Criar `src/lib/mock-data/names.ts` (listas de nomes, cidades, categorias)
- [ ] Criar `src/lib/mock-data/generators.ts` (funções de geração)
- [ ] Criar `src/lib/mock-data/csv-export.ts` (conversão e download)

### Fase 3: Componentes UI
- [ ] Criar `data-type-selector.tsx`
- [ ] Criar `output-viewer.tsx` (com syntax highlight reutilizado)
- [ ] Criar `mock-data-generator.tsx` (componente principal)

### Fase 4: Página
- [ ] Criar `src/app/ferramentas/gerador-de-dados-mock/page.tsx`
- [ ] Escrever conteúdo SEO completo
- [ ] Configurar metadata (title, description, keywords)

### Fase 5: Testes e Ajustes
- [ ] Testar geração de todos os tipos de dados
- [ ] Testar download JSON e CSV
- [ ] Testar copy para clipboard
- [ ] Testar toggle formatado/minificado
- [ ] Verificar responsividade mobile
- [ ] Verificar SEO (title, description, JSON-LD)

---

## 8. Notas Técnicas

### 8.1 Performance
- Para volumes grandes (10.000 registros), usar `requestIdleCallback` ou `setTimeout` para não bloquear a UI
- Considerar virtualização ou paginação no preview para grandes volumes

### 8.2 Reutilização
- Syntax highlight: copiar função `highlightJSON` do `json-formatter.tsx`
- CopyButton: usar componente existente em `src/components/shared/copy-button.tsx`
- PageLayout: usar componente existente com `toolHref`, `title`, `description`, `extraContent`

### 8.3 Padrões do Projeto
- Usar `"use client"` apenas no componente interativo (mock-data-generator.tsx)
- Página (`page.tsx`) deve ser Server Component (sem "use client")
- Usar `cn()` do `@/lib/utils` para classes condicionais
- Seguir padrão de nomenclatura: kebab-case para arquivos, PascalCase para componentes

---

## 9. Resultado Esperado

Uma ferramenta funcional em `/ferramentas/gerador-de-dados-mock` que:
- Gere dados mock realistas em JSON e CSV
- Suporte múltiplos tipos de dados e volumes
- Tenha SEO otimizado com conteúdo explicativo
- Siga o design system e padrões do projeto
- Seja útil para desenvolvedores em testes e prototipação
