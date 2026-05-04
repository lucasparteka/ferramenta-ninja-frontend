#!/bin/bash
# ============================================
# Setup: OpenCode + Kimi K2.6 + code-review-graph
# ============================================
# Execute com: chmod +x setup.sh && ./setup.sh

set -e

echo "=========================================="
echo "  OpenCode + Kimi K2.6 Setup"
echo "=========================================="
echo ""

# ─────────────────────────────────────────────
# 1. Instalar OpenCode
# ─────────────────────────────────────────────
echo "[1/5] Verificando OpenCode..."
if command -v opencode &> /dev/null; then
    echo "  ✓ OpenCode já instalado: $(opencode --version 2>/dev/null || echo 'versão desconhecida')"
else
    echo "  → Instalando OpenCode..."
    curl -fsSL https://opencode.ai/install | bash
fi

# ─────────────────────────────────────────────
# 2. Instalar uv (gerenciador Python para uvx)
# ─────────────────────────────────────────────
echo ""
echo "[2/5] Verificando uv..."
if command -v uv &> /dev/null; then
    echo "  ✓ uv já instalado"
else
    echo "  → Instalando uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.local/bin:$PATH"
fi

# ─────────────────────────────────────────────
# 3. Instalar code-review-graph
# ─────────────────────────────────────────────
echo ""
echo "[3/5] Instalando code-review-graph..."
if command -v code-review-graph &> /dev/null; then
    echo "  ✓ code-review-graph já instalado"
else
    uv tool install code-review-graph
    echo "  ✓ code-review-graph instalado"
fi

# ─────────────────────────────────────────────
# 4. Instalar ast-grep (para codemods)
# ─────────────────────────────────────────────
echo ""
echo "[4/5] Verificando ast-grep..."
if command -v ast-grep &> /dev/null; then
    echo "  ✓ ast-grep já instalado"
else
    echo "  → Instalando ast-grep..."
    if command -v brew &> /dev/null; then
        brew install ast-grep
    elif command -v cargo &> /dev/null; then
        cargo install ast-grep --locked
    elif command -v npm &> /dev/null; then
        npm install -g @ast-grep/cli
    else
        echo "  ⚠ Não foi possível instalar ast-grep automaticamente."
        echo "    Instale manualmente: https://ast-grep.github.io/guide/quick-start.html"
    fi
fi

# ─────────────────────────────────────────────
# 5. Configurar API key do Moonshot
# ─────────────────────────────────────────────
echo ""
echo "[5/5] Configurando API key..."
echo ""
echo "  Para configurar o Moonshot no OpenCode, execute:"
echo ""
echo "    opencode"
echo "    /connect"
echo "    → Selecione 'Moonshot AI'"
echo "    → Cole sua API key"
echo ""

# ─────────────────────────────────────────────
# Instruções finais
# ─────────────────────────────────────────────
echo "=========================================="
echo "  Setup completo!"
echo "=========================================="
echo ""
echo "  Próximos passos no seu projeto:"
echo ""
echo "  1. Copie opencode.jsonc para a raiz do projeto:"
echo "     cp opencode.jsonc /caminho/do/projeto/opencode.jsonc"
echo ""
echo "  2. Copie AGENTS.md para a raiz do projeto:"
echo "     cp AGENTS.md /caminho/do/projeto/AGENTS.md"
echo ""
echo "  3. Dentro do projeto, construa o grafo:"
echo "     cd /caminho/do/projeto"
echo "     code-review-graph build"
echo ""
echo "  4. Inicie o OpenCode:"
echo "     opencode"
echo ""
echo "  5. Para reconstruir o grafo após mudanças grandes:"
echo "     code-review-graph update"
echo ""
echo "=========================================="
