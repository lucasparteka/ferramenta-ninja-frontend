# Project Rules

## Princípios de eficiência

- **Nunca releia um arquivo que já está no contexto.** Se o conteúdo já apareceu nesta conversa, use-o diretamente.
- **Nunca leia arquivos "por garantia".** Só leia um arquivo se precisar do conteúdo para tomar uma decisão.
- **Seja direto.** Não explique o que vai fazer antes de fazer. Faça e explique brevemente depois.
- **Não use todowrite.** Gerencie tarefas mentalmente sem criar tool calls extras.

## Antes de ler arquivos (read, grep, glob)

As tools read, grep e glob exigem aprovação. Antes de chamá-las:

1. Explique em 1 linha POR QUE precisa ler esse arquivo
2. Confirme que a informação NÃO está já no contexto
3. Confirme que NÃO pode obter a mesma informação via code-review-graph
4. Se precisar ler mais de 3 arquivos, apresente a lista completa e peça aprovação uma única vez

## Tools do code-review-graph (MCP)

O grafo JÁ ESTÁ CONSTRUÍDO. **Não chame build_or_update_graph_tool.**

Para buscar componentes/funções, use estas tools nesta ordem de preferência:

1. `code-review-graph_search_nodes_tool` — busca por nome exato ou parcial
2. `code-review-graph_get_dependents_tool` — quem importa/usa um símbolo
3. `code-review-graph_get_dependencies_tool` — o que um símbolo importa/usa
4. `code-review-graph_get_file_summary_tool` — resumo de um arquivo específico
5. `code-review-graph_semantic_search_nodes_tool` — busca semântica (último recurso)

Ao usar semantic_search, **NÃO filtre por kind=Function**.
Componentes React podem estar classificados como diferentes tipos no grafo.
Se a busca retornar vazio, tente sem filtro de kind antes de ir para grep.

**Só use grep/glob como fallback** se o grafo não tiver a informação necessária.

## Estratégia de exploração

1. Consulte o code-review-graph PRIMEIRO (0 tokens de leitura)
2. Se o grafo não responder, justifique por que precisa do grep/glob
3. Só leia arquivos individuais quando precisar do conteúdo exato para montar diffs

## Estratégia de edição em batch

Para mudanças repetitivas em múltiplos arquivos (mesmo padrão aplicado N vezes):

1. **Não edite arquivo por arquivo com edit/write**
2. Gere UM script (sed, ast-grep YAML, ou jscodeshift) que aplique a mudança em todos os arquivos
3. Execute o script via bash numa única chamada
4. Máximo de 3 tool calls: grafo → gerar script → executar script

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

- TypeScript / React / Next.js
