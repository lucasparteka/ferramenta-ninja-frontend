# RESTRUCTURE-LEARNINGS.md

> Aprendizados das refatorações de layout das ferramentas `character-counter` e `text-diff` para o Layout D (Análise com sidebar). Este documento serve como guia rápido para futuras implementações do mesmo padrão.

---

## 1. O que fazer

### Container raiz
- **Use o componente `<LayoutD>` de `@/components/shared/layout-d`** — não escreva o grid manualmente.
- `<LayoutD>` aceita `header`, `sidebar`, `children`, `sidebarWidth` (default 240) e `mainAreaClassName`.
- Internamente usa `rounded-sm` (não `rounded-lg`), `flex flex-col md:grid`, e `style` para a largura da sidebar.
- Nunca use `gap-*` no container — a separação visual vem de `border-r` e `divide-y`.

### Header interno do card
- Sempre comece com uma barra de header interno: `border-b border-border px-4 py-2.5 col-span-full`.
- No mobile, use `flex flex-col gap-2 md:flex-row md:items-center md:justify-between` para quebrar suavemente quando os botões não cabem.
- Ações principais à direita: CTA único (`variant="default"`), ações secundárias (`outline`), ícones isolados (`ghost` + `icon-sm`).
- Botão de excluir/limpar (apenas ícone) deve ser o **último** da fila — nunca deixe um ícone solto entre botões com label.

### Badge de modo/estado no header
- O badge ao lado do título **deve sempre estar em português** — nunca em inglês ou em siglas técnicas que o usuário final não entenderia.
- O badge deve comunicar algo útil: o modo ativo, o estado atual ou o tipo de entrada. Evite repetir o nome da ferramenta.
- Referência dos badges aprovados nas ferramentas existentes:
  - `TEMPO REAL` — processamento reativo (character-counter)
  - `COMPARAÇÃO` — ferramenta de diff entre textos (text-diff)
  - `LISTA` — ferramenta que processa listas de linhas (remove-duplicates)
  - `LIMPEZA` — ferramenta de sanitização de texto (text-cleaner)
  - `MODELO` / `ALEATÓRIO` — modo do gerador de texto (text-generator, dinâmico)
  - `FORMATAÇÃO` — editor com marcação rich text (whatsapp-formatter)
  - `SORTEIO` — ferramenta de sorteio (random-picker)
  - `PRONTO` / `DIGITANDO` / `CONCLUÍDO` — estado da sessão (typing-test, dinâmico)

### Área principal (coluna esquerda)
- Se há mais de um elemento filho (ex: dois textareas), adicione `p-4` no container para evitar que fiquem colados às bordas.
- Textareas internas devem ter `border-0 rounded-none bg-transparent p-0 focus-visible:ring-0` para não conflitarem com a borda do painel pai.
- Se houver um botão de swap entre duas áreas:
  - Posicione-o entre as duas áreas no DOM.
  - Use `rotate-90 md:rotate-0` no ícone para indicar direção vertical no mobile e horizontal no desktop.
  - Use `variant="ghost"` e `size="icon-sm"`, sem label.

### Toolbar inferior
- Sempre presente na área principal: `border-t border-border bg-muted/40 px-4 py-2`.
- Indicador de status: bolinha `bg-green-600` (não `bg-foreground/40`) + label `text-[11px] text-muted-foreground`.
- Metadados à direita em `font-mono text-[11px] text-muted-foreground`.

### Sidebar (coluna direita)
- Fundo: `bg-muted/30`.
- Separações internas: `divide-y divide-border` no container.
- Section headers: `text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3`.
- Métricas: label `text-xs text-muted-foreground` + valor `font-mono text-xs font-medium tabular-nums`.
- Opções: label à esquerda + controle à direita, com `flex items-center justify-between`.

### Section headers
- Sempre ALL CAPS, `text-[10px]`, `tracking-wider`, `text-muted-foreground`.
- Usar `mb-3` no header para separar do conteúdo abaixo.

---

## 2. O que evitar

- ❌ `rounded-lg` no container da ferramenta — usar `rounded-sm`.
- ❌ `gap-*` no container do grid — usar bordas (`border-r`, `divide-y`).
- ❌ Botão de ícone solto entre botões com label no header.
- ❌ Elementos filhos colados nas bordas do painel — sempre adicionar `p-4` quando necessário.
- ❌ Textareas com borda própria dentro de painéis com borda — usar `border-0`.
- ❌ Indicador de status com `bg-foreground/40` — usar `bg-green-600`.
- ❌ `shadow-*` em qualquer painel, card ou input — sombra só em popover/dialog/toast.
- ❌ Mais de um `variant="default"` por tela.
- ❌ Section headers sem `mb-3` — o conteúdo gruda no header.

---

## 3. Padrões específicos por tipo de conteúdo

### Ferramenta com um único textarea (character-counter)
- Textarea ocupa toda a coluna principal com `flex-1 min-h-[280px]`.
- Sidebar contém apenas métricas numéricas (contagens).

### Ferramenta com dois textareas (text-diff)
- Grid interno `grid-cols-1 md:grid-cols-[1fr_auto_1fr]` com botão swap no meio.
- Resultado do processamento aparece abaixo das textareas, separado por `border-t`.
- Sidebar contém métricas do resultado (adições, remoções, blocos) + opções de configuração.

### Ferramenta com input e output lado a lado (remove-duplicates)
- Grid interno `grid-cols-1 md:grid-cols-2` com padding `p-4` no container.
- Input editável à esquerda, output read-only à direita.
- Sidebar contém métricas do resultado (linhas originais, únicas, removidas) + opções.
- Processamento manual: botão de ação no header (`variant="default"`).

### Ferramenta com processamento automático (text-cleaner)
- Não precisa de botão de ação no header — o processamento é reativo.
- Header contém apenas CopyButton (condicional) + Limpar.
- Resultados intermediários (highlight de caracteres invisíveis, diff) aparecem em seções com `border-t` e `p-4`.
- Sidebar pode conter seções condicionais de avisos/problemas detectados.
- Upload de arquivo com drag-and-drop pode ser mantido dentro do input sem conflitar com o layout.

---

## 4. Checklist rápido antes de entregar

- [ ] Usa `<LayoutD>` de `@/components/shared/layout-d` (não grid manual).
- [ ] Header interno tem `col-span-full` e quebra no mobile (`flex-col md:flex-row`).
- [ ] Badge ao lado do título está em português e é compreensível para o usuário final.
- [ ] Botão de ícone (limpar/excluir) é o último no header.
- [ ] Área principal tem `border-r border-border`.
- [ ] Sidebar tem `bg-muted/30 divide-y divide-border`.
- [ ] Section headers são `text-[10px] uppercase tracking-wider`.
- [ ] Números usam `font-mono tabular-nums`.
- [ ] Toolbar inferior tem bolinha `bg-green-600`.
- [ ] Nenhum `shadow-*` em painéis.
- [ ] Build passa (`pnpm build`).

---

## 5. Decisões de design que funcionaram

1. **Quebra de header no mobile**: `flex-col gap-2 md:flex-row` resolveu o aperto de elementos sem comprometer o desktop.
2. **Botão swap entre textareas**: Mais intuitivo que no header — o usuário entende que está trocando os dois campos visuais.
3. **Ícone rotacionado no mobile**: `rotate-90 md:rotate-0` no `ArrowLeftRight` comunica corretamente a direção do swap em cada breakpoint.
4. **Sidebar com estatísticas condicionais**: Mostrar métricas do resultado apenas quando relevante evita poluição visual.
5. **Container `overflow-hidden`**: Essencial para que `rounded-sm` funcione corretamente com `border-r` internos.
6. **Opções na sidebar em lista vertical**: `flex items-center justify-between` com label à esquerda e controle (checkbox/toggle) à direita funciona melhor que wrap horizontal em espaços estreitos.
7. **Problemas detectados na sidebar**: Avisos condicionais (ex: "Texto parece vindo do Word") funcionam bem como seção separada na sidebar, não como banner inline.
8. **Input/output lado a lado**: `grid-cols-2` dentro da área principal funciona bem para ferramentas de transformação de lista, desde que ambos tenham `min-h` consistente.

---

---

## 6. Padrões específicos: whatsapp-formatter, typing-test, text-generator, random-picker

### Ferramenta com editor rico (whatsapp-formatter)
- **Sidebar mais larga quando o conteúdo exige**: O padrão canônico é 240px, mas o preview do WhatsApp precisa de mais espaço para ser útil. Use 380px nesses casos em vez de comprimir o conteúdo ou usar layout 50/50 (layout C).
- **Toolbar de formatação embutida na área principal**: Botões de formatação (Bold, Italic, etc.) ficam em uma sub-barra `border-b` dentro da área principal, não no header do card. O header fica reservado para ações de documento (Copiar, Desfazer, Limpar).
- **Ação contextual alinhada à direita na toolbar**: Ações que afetam os elementos da toolbar (ex: "Limpar estilos") devem ficar na mesma linha das opções relacionadas, alinhadas com `ml-auto`. Isso evita que o usuário procure a ação em lugar errado.
- **Estado ativo de botões de formatação**: Use `variant="secondary"` para estado ativo, não `variant="default"`. Isso evita múltiplos botões "primários" na tela.
- **Key com index em listas de linhas de texto**: Ao mapear linhas de texto (ex: `text.split("\n")`), use `key={index}` — nunca `key={line}`, pois linhas duplicadas geram a chave duplicada e o warning do React.

### Ferramenta com estado de sessão (typing-test)
- **Badge dinâmico no header**: Para ferramentas com estados bem definidos (idle/running/finished), o badge no header é o lugar certo para refletir o estado atual (PRONTO → DIGITANDO → CONCLUÍDO). Atualiza sem poluir a UI.
- **Input oculto para captura de teclas**: O padrão `<Input className="absolute h-0 w-0 opacity-0" />` requer `position: relative` no container pai para funcionar corretamente. Adicione `relative` na `<div>` da área principal.
- **Seção de resultado condicional na sidebar**: Mostrar o resultado final (WPM, precisão) apenas no estado `finished` dentro da sidebar é limpo — o espaço fica disponível durante o teste e reaparece quando relevante.
- **Indicador de status com cor dinâmica**: O dot de status (`h-1.5 w-1.5 rounded-full`) pode variar entre `bg-foreground/30` (inativo) e `bg-green-600` (ativo) para comunicar estado sem texto extra.

### Ferramenta de geração com controles na sidebar (text-generator)
- **Controles de tipo/formato como botões verticais**: Em vez de `<select>` nativo ou `OptionSwitch` horizontal, use botões empilhados verticalmente na sidebar com `bg-foreground/10` para o item ativo. Funciona melhor no espaço estreito e é mais consistente com o padrão da sidebar.
- **Badge reflete configuração ativa**: O badge no header pode mostrar o modo atual (LOREM IPSUM / ALEATÓRIO) em vez de um rótulo estático. Dá contexto imediato ao usuário sobre o que será gerado.
- **Opções condicionais na sidebar**: Seções que só fazem sentido para um modo específico (ex: "Começar com Lorem" só para tipo lorem) aparecem e somem conforme a seleção. Não deixe opções inaplicáveis visíveis.

### Ferramenta de lista com resultado na sidebar (random-picker)
- **Resultado na sidebar permite editar e ver simultaneamente**: Colocar o resultado (vencedores) na sidebar mantém a lista de itens sempre visível na área principal enquanto o usuário confere quem ganhou.
- **Ordem das seções na sidebar**: Coloque o resultado ANTES das opções quando o resultado é o que o usuário quer ver primeiro. A sidebar é lida de cima para baixo.
- **Erro inline no toolbar inferior**: Mensagens de erro de validação curtas (ex: "Adicione pelo menos um item") cabem bem no toolbar inferior, com o dot vermelho (`bg-destructive`) como indicador visual. Evita toasts ou banners desnecessários.
- **Ícone de ação primária com label**: O botão principal de ação pode ter um ícone suplementar ao texto (ex: `<Shuffle />` + "Sortear") quando o ícone reforça a semântica. Não coloque ícone só por estética.

---

*Última atualização: após refatoração de whatsapp-formatter, typing-test, text-generator e random-picker.*
