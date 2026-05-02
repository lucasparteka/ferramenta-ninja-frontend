# 🤖 Setup de Desenvolvimento com OpenCode

Este documento descreve o passo a passo completo para configurar o ambiente de desenvolvimento assistido por IA usando **OpenCode**, **Kimi K2.6** e três servidores MCP (Model Context Protocol).

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

| Ferramenta | Versão mínima | Verificação |
|---|---|---|
| [Node.js](https://nodejs.org/) | 18+ | `node -v` |
| [Python](https://python.org/) | 3.11+ | `python --version` |
| pnpm (ou npm) | 8+ | `pnpm -v` |
| Git | 2.40+ | `git --version` |

> **Nota:** Este projeto utiliza `pnpm`, mas os comandos MCP usam `npx -y` (ou `pnpm dlx`) para executar pacotes remotos, funcionando independentemente do package manager do projeto.

---

## 1️⃣ Instalar o OpenCode CLI

```bash
# Via npm (recomendado)
npm install -g opencode

# Ou via pnpm
pnpm add -g opencode

# Verificar instalação
opencode --version
```

---

## 2️⃣ Instalar os Servidores MCP

Os MCPs são ferramentas que o OpenCode utiliza para interagir com o seu codebase, documentação e grafo de dependências.

### 2.1 Code Graph (cgc)

Analisa o grafo de dependências do seu código.

```bash
# Instalar via pip
pip install codegraphcontext

# Verificar instalação
which cgc
# Saída esperada: /c/Users/<usuario>/AppData/Local/Programs/Python/Python313/Scripts/cgc
```

### 2.2 Context7 (Upstash)

Indexa e consulta documentação de bibliotecas e frameworks.

> Não requer instalação prévia — é executado via `npx` sob demanda.

```bash
# Testar execução remota
npx -y @upstash/context7-mcp --help
```

### 2.3 Codebase Memory (DeusData)

Armazena memória persistente do seu codebase entre sessões.

```bash
# Baixar e instalar o binary estático
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash

# Verificar instalação
which codebase-memory-mcp
# Saída esperada: /c/Users/<usuario>/.local/bin/codebase-memory-mcp
```

---

## 3️⃣ Indexar o Projeto (OBRIGATÓRIO)

> ⚠️ **ATENÇÃO:** Os MCPs de grafo precisam indexar seu código antes de responderem qualquer query. Sem esse passo, eles conectam mas retornam resultados vazios.

### 3.1 Indexar com Code Graph

Na raiz do projeto (`frontend/`), execute:

```bash
# Indexar todo o código do projeto atual
cgc index .

# Verificar se o grafo foi criado
cgc list

# (Opcional) Iniciar watcher para re-indexar automaticamente em mudanças
cgc watch .
```

### 3.2 Indexar com Codebase Memory

```bash
# Habilitar auto-index (indexa automaticamente na primeira conexão MCP)
codebase-memory-mcp config set auto_index true

# Ou indexar manualmente agora
codebase-memory-mcp index .
```

> O `auto_index true` é recomendado — na primeira vez que o OpenCode conectar ao MCP, o projeto será indexado automaticamente [^39^].

---

## 4️⃣ Configurar Variáveis de Ambiente

Na raiz do projeto, crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e preencha suas chaves de API:

```bash
# ============================================
# OpenCode - Moonshot API (Kimi K2.6)
# ============================================
MOONSHOT_API_KEY=sk-sua-chave-aqui

# ============================================
# MCP - Context7 (documentação de libs)
# ============================================
CONTEXT7_API_KEY=ctx7sk-sua-chave-aqui

# ============================================
# MCP - Codebase Memory (DeusData)
# ============================================
# Não requer API key — o binary já foi instalado no passo 2.3
```

> ⚠️ **Importante:** Nunca commite o arquivo `.env`. Ele já deve estar listado no `.gitignore`.

---

## 5️⃣ Estrutura de Configuração do OpenCode

O arquivo `opencode.json` deve estar na raiz do projeto (`frontend/`). Ele define:

- **Provider Moonshot** com Kimi K2.6
- **3 servidores MCP** (code-graph, context7, codebase-memory)
- **2 agents primários**: `plan` (somente leitura) e `build` (acesso total)

### Modelos configurados

| Agent | Modelo | Temperatura | Função |
|---|---|---|---|
| `plan` | `moonshot/kimi-k2.6` | 0.1 | Planejamento arquitetural, análise e leitura |
| `build` | `moonshot/kimi-k2.6` | 0.3 | Implementação, edição de arquivos e execução de comandos |

### Permissões por agent

| Permissão | `plan` | `build` |
|---|---|---|
| `read` | ✅ allow | ✅ allow |
| `edit` | ❌ deny | ✅ allow |
| `bash` | ❌ deny | ✅ allow |
| `write` | ❌ deny | ✅ allow |
| `external_directory` | ❌ deny | ⚠️ ask |

---

## 6️⃣ Iniciar uma Sessão

Abra o terminal na raiz do projeto (`frontend/`) e execute:

```bash
opencode
```

O OpenCode carregará automaticamente:
1. As variáveis do `.env`
2. O `opencode.json` do diretório atual
3. Os servidores MCP configurados

---

## 🎮 Uso dos Agents Durante a Sessão

### Alternar entre agents

Durante a conversa, pressione a tecla **Tab** para alternar entre `plan` e `build`.

### Fluxo recomendado de trabalho

1. **Inicie com `plan`**
   - Descreva a tarefa ou feature a ser implementada
   - O agente analisará o codebase, consultará os MCPs e gerará um plano detalhado
   - Nenhum arquivo será modificado nesta fase

2. **Valide o plano**
   - Revise as sugestões, dependências e arquivos identificados
   - Ajuste o escopo se necessário

3. **Alterne para `build`**
   - Pressione **TAB** para trocar para o agente `build`
   - O contexto da conversa é preservado
   - Execute a implementação com acesso total a edição e comandos bash

### Invocar subagents manualmente

Você também pode mencionar subagents com `@`:

```
@general me ajude a refatorar essa função
@explore onde está definido o tipo User?
```

---

## 🛠️ Comandos Úteis do OpenCode

| Comando | Descrição |
|---|---|
| `/models` | Listar e trocar modelos disponíveis |
| `/agents` | Listar agents configurados |
| `/mcp` | Ver status dos servidores MCP |
| `/compact` | Compactar o contexto da sessão |
| `/clear` | Limpar o histórico da conversa |
| `Ctrl+C` | Interromper execução atual |
| `Ctrl+D` | Sair do OpenCode |

---

## 📝 Solução de Problemas

### Erro: "command not found: cgc"
```bash
# Adicione o Scripts do Python ao PATH
export PATH="$PATH:/c/Users/$USER/AppData/Local/Programs/Python/Python313/Scripts"
```

### Erro: "codebase-memory-mcp not found"
```bash
# Reinstale o binary
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash
```

### Erro: "Invalid API key"
- Verifique se o `.env` está na raiz do projeto
- Confirme se as variáveis `MOONSHOT_API_KEY` e `CONTEXT7_API_KEY` estão preenchidas
- Reinicie o OpenCode após editar o `.env`

### MCP não conecta ou retorna vazio
```bash
# Verificar se os comandos MCP funcionam isoladamente
npx -y @upstash/context7-mcp --api-key $CONTEXT7_API_KEY
cgc mcp
codebase-memory-mcp

# Verificar se o projeto foi indexado
cgc list
codebase-memory-mcp list
```

### Code Graph não encontra símbolos
```bash
# Reindexar o projeto
cgc index .

# Verificar status do grafo
cgc stats
```

---

## 📁 Arquivos de Configuração

```
frontend/
├── .env                  # Variáveis de ambiente (não commitar)
├── .env.example          # Template de variáveis
├── .gitignore            # Deve incluir .env
├── opencode.json         # Configuração do OpenCode, providers, MCPs e agents
└── README.md             # Este arquivo
```

---

> 💡 **Dica:** Para adicionar o DeepSeek V4 Pro no futuro (para o agent `plan`), basta reintroduzir o provider `deepseek` no `opencode.json` e alterar o `model` do agent `plan` para `deepseek/deepseek-v4-pro`.
