# 📦 Ferramenta de Dados Mock - Plano de Implementação

## 🎯 Objetivo

Criar uma página de ferramenta com dados mock prontos para uso em
testes, desenvolvimento e prototipação, alinhada com SEO e utilidade
prática para desenvolvedores.

------------------------------------------------------------------------

## 🚀 MVP (Prioridade Inicial)

### 1. JSON Realista

Fornecer exemplos prontos de: - Usuário (nome, email, endereço, roles) -
Produto (nome, preço, estoque, categoria) - API Response (success +
error) - Paginação (page, limit, total, data)

------------------------------------------------------------------------

### 2. CSV + JSON em Grande Volume

-   Arquivos com 100, 1.000 e 10.000 registros
-   Ideal para testes de performance e tabelas

------------------------------------------------------------------------

### 3. Edge Cases (Casos Problemáticos)

Dados para testar robustez: - Strings longas - Caracteres especiais (ç,
ã, emojis) - Valores nulos e undefined - Datas em múltiplos formatos -
Números extremos

------------------------------------------------------------------------

### 4. Mock de API

Estruturas completas: - Request (headers + body) - Response
(success/error) - Status codes simulados

------------------------------------------------------------------------

### 5. Gerador Simples

Inputs básicos: - Tipo de dado (user, product, etc.) - Quantidade (10,
50, 100, 1000) - Botão gerar

------------------------------------------------------------------------

## 🧠 Estrutura da Página

Seguir padrão do projeto:

H1 → Nome da ferramenta\
Descrição curta (SEO)\
Componente da ferramenta\
Conteúdo adicional (FAQ / explicação)

------------------------------------------------------------------------

## 🧩 Componentes Sugeridos

-   DataTypeSelector
-   QuantitySelector
-   GenerateButton
-   OutputViewer (com syntax highlight)
-   CopyButton
-   DownloadButton
-   ToggleMinifyFormat

------------------------------------------------------------------------

## ⚙️ Funcionalidades

-   Copiar para clipboard
-   Download (.json, .csv)
-   Alternar entre formatado e minificado
-   Preview com scroll
-   Feedback visual (copiado, erro, etc.)

------------------------------------------------------------------------

## 🧱 Estrutura de Código

    /components/tools/mock-data
      mock-data-generator.tsx
      data-type-selector.tsx
      output-viewer.tsx

    /lib/mock-data
      generateUser.ts
      generateProduct.ts
      generateApiResponse.ts

------------------------------------------------------------------------

## 🔍 SEO

-   Keywords: "dados mock", "json exemplo", "fake data generator",
    "dados para teste"
-   Conteúdo explicativo abaixo da ferramenta
-   FAQ com dúvidas comuns

------------------------------------------------------------------------

## 💡 Diferencial

-   Dados realistas (não genéricos)
-   Edge cases inclusos
-   Geração dinâmica
-   Foco em uso real por devs

------------------------------------------------------------------------

## ✅ Resultado Esperado

Uma ferramenta simples, rápida e extremamente útil para desenvolvedores,
com alto potencial de tráfego orgânico e retenção.
