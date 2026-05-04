# Referência rápida — O que cada configuração faz e por quê

## opencode.jsonc

### Controle de timeout (anti-travamento)

| Configuração | Valor | O que resolve |
|---|---|---|
| `timeout: 180000` | 3 min total | Modelo travou completamente → aborta após 3 min |
| `chunkTimeout: 15000` | 15s entre chunks | Modelo "pensando" sem retornar nada → aborta após 15s de silêncio |

Se o Kimi travar (o que acontece), o `chunkTimeout` é a sua defesa principal.
Sem ele, o OpenCode fica esperando indefinidamente enquanto queima tokens de contexto
que são reenviados a cada retry.

### Desativar thinking (anti-overthinking)

```json
"thinking": { "type": "disabled" }
```

O Kimi K2.6 tem modo de raciocínio interno (thinking/reasoning). Quando ativado,
ele gasta tokens extras "pensando" antes de responder. O problema específico com
o Kimi é que ele tende a entrar em loops de auto-verificação:
"será que isso está certo? deixa eu pensar de novo..."

Com thinking desativado, ele vai direto para a resposta (modo "instant").
Temperatura recomendada pela Moonshot para instant mode: 0.6.

### Desativar tools desnecessárias

```json
"todowrite": false   // gera 2-3 tool calls extras por turno
"webfetch": false     // modelo sai buscando docs sem você pedir
"websearch": false    // idem
```

Cada tool call é uma chamada à API com contexto acumulado.
3 tool calls desnecessárias × 15 turnos = 45 chamadas extras.

### maxSteps por agent (anti-loop)

```json
"maxSteps": 15  // build
"maxSteps": 10  // plan
"maxSteps": 8   // explore
```

Limita quantas tool calls cada agent pode fazer antes de ser forçado a parar.
Sem isso, o Kimi pode entrar em loop de "ler arquivo → pensar → ler outro → pensar..."
indefinidamente.

### Compaction threshold

```json
"compaction": { "threshold": 60000 }
```

Quando o contexto atinge 60k tokens, o OpenCode compacta automaticamente.
O Kimi tem 262k de contexto, mas não há motivo para deixar chegar lá —
quanto maior o contexto, mais tokens são reenviados a cada turno.

60k é agressivo mas intencional: mantém os custos baixos e força o modelo
a trabalhar com contexto enxuto.

## AGENTS.md

### Estratégia de exploração via grafo

Em vez de:
```
grep → read → grep → read → read  (5-10 tool calls, ~50k tokens)
```

Faz:
```
code-review-graph query  (1 tool call, ~700 tokens)
```

### Estratégia de edição via codemod

Em vez de:
```
read arquivo1 → edit arquivo1 → read arquivo2 → edit arquivo2 → ...  (2N tool calls)
```

Faz:
```
gerar script → executar script  (2 tool calls, independente de N arquivos)
```

## Arquivos do setup

```
opencode.jsonc     → copiar para a raiz do projeto
AGENTS.md          → copiar para a raiz do projeto
setup.sh           → executar uma vez para instalar dependências
```

## Comandos úteis no dia a dia

```bash
# Reconstruir o grafo após mudanças grandes
code-review-graph update

# Ver status do grafo
code-review-graph status

# Visualizar o grafo interativamente
code-review-graph visualize

# Testar um codemod ast-grep sem aplicar
ast-grep scan --rule regra.yaml

# Aplicar um codemod ast-grep
ast-grep scan --rule regra.yaml --rewrite
```
