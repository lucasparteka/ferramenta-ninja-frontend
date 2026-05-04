# Project Rules

## Princípios de eficiência

- **Nunca releia um arquivo que já está no contexto.** Se o conteúdo já apareceu nesta conversa, use-o diretamente.
- **Nunca leia arquivos "por garantia".** Só leia um arquivo se precisar do conteúdo para tomar uma decisão.
- **Seja direto.** Não explique o que vai fazer antes de fazer. Faça e explique brevemente depois.
- **Não use todowrite.** Gerencie tarefas mentalmente sem criar tool calls extras.

## Estratégia de exploração

Antes de buscar arquivos com grep/glob, **sempre consulte o code-review-graph primeiro**:

1. Use `get_callers`, `get_callees`, `get_impact_radius` ou `search` do MCP code-review-graph
2. O grafo retorna a lista exata de arquivos afetados em ~700 tokens
3. Só use grep/glob como fallback se o grafo não tiver a informação

## Estratégia de edição em batch

Para mudanças repetitivas em múltiplos arquivos (mesmo padrão aplicado N vezes):

1. **Não edite arquivo por arquivo com edit/write**
2. Gere UM script (sed, ast-grep YAML, ou jscodeshift) que aplique a mudança em todos os arquivos
3. Execute o script via bash numa única chamada
4. Máximo de 3 tool calls: grafo → gerar script → executar script

Exemplo de ast-grep YAML para adicionar prop:
```yaml
id: add-prop
language: tsx
rule:
  pattern: <ComponentName $$$PROPS>
fix: <ComponentName $$$PROPS newProp={value}>
```

Exemplo de sed para substituição simples:
```bash
sed -i 's/funcaoAntiga(arg1)/funcaoNova(arg1, arg2)/g' arquivo1.tsx arquivo2.tsx
```

## Estratégia de edição com julgamento

Para mudanças que variam por arquivo (contexto diferente em cada um):

1. Consulte o grafo para identificar arquivos
2. Monte o plano COMPLETO com todos os diffs exatos numa única resposta
3. Aplique as edições — cada edit deve ser preciso, sem releitura prévia

## Regras para o modelo

- **Não pense em voz alta.** Vá direto à ação ou à resposta.
- **Não repita o conteúdo de arquivos** que acabou de ler. Resuma em 1 linha se necessário.
- **Não peça confirmação** para ações triviais. Só pergunte quando houver ambiguidade real.
- **Prefira edições cirúrgicas** (edit com old_str/new_str) a reescrever arquivos inteiros (write).
- **Ao encontrar erro**, corrija diretamente em vez de explicar o erro e perguntar o que fazer.

## Stack do projeto

- TypeScript / React
- Ajuste conforme o projeto real
