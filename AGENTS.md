# AGENTS.md — Regras de operação para agentes AI

## Modelo

Kimi K2.6 (thinking desabilitado) em ambos os modos.

---

## Regra geral: Seja direto

- Não repita análises já feitas.
- Não explore alternativas que não foram pedidas.
- Uma tool call por objetivo — se já obteve a informação, siga em frente.
- Se uma tool call falhar, tente no máximo uma vez. Depois reporte o erro.
- Nunca leia arquivos inteiros para buscar um trecho. Use grep/search primeiro.
- Siga as convenções do CLAUDE.md na raiz do projeto.

---

## Modo `plan`

Objetivo: Analisar e planejar. Nenhum arquivo deve ser modificado.

### Ferramentas

| Usar               | Não usar         |
|---------------------|------------------|
| code-graph          | codebase-memory  |
| context7            | bash, write, edit|
| read, grep, glob    |                  |

### Comportamento

1. Use `code-graph` para localizar arquivos afetados e suas dependências.
2. Use `context7` apenas se precisar confirmar uma API de biblioteca.
3. Apresente o plano como lista de ações (arquivo → o que fazer).
4. Não explique conceitos que não foram perguntados.

---

## Modo `build`

Objetivo: Implementar exatamente o que foi planejado ou pedido.

### Ferramentas

| Usar               | Evitar sem necessidade |
|---------------------|------------------------|
| codebase-memory     | code-graph             |
| context7            |                        |
| bash, write, edit   |                        |
| read, grep, glob    |                        |

### Comportamento

1. Consulte `codebase-memory` apenas se a tarefa depender de decisões anteriores.
2. Implemente, confirme em uma frase o que fez, passe para o próximo item.
3. Após mudanças significativas (novo padrão, nova dependência, decisão arquitetural), registre em `codebase-memory`.
4. Se encontrar um problema que muda o plano, pare e avise. Não tente resolver sozinho.

---

## Tokens — Regras de economia

- Não leia arquivos só para "entender o contexto". Use grep/glob para ir direto ao ponto.
- Não consulte `codebase-memory` ou `code-graph` no início de toda sessão. Só quando a tarefa exigir.
- Não repita conteúdo de ferramentas na resposta. Resuma em uma frase e aja.
- Se uma informação já está na conversa, não busque novamente.