# Plano de Implementação — Manter Tela Ligada

## Resumo
Nova ferramenta que impede a tela do dispositivo de desligar (screen lock / sleep), com timer de sessão, Picture-in-Picture e opção de tempo programado com presets e slider customizado.

## Parte 1 — Estrutura e Rota ✅
1. **Registrar ferramenta em `src/lib/data/tools.ts`** ✅
   - Adicionar entrada na categoria `utilitarios` com nome, href, descrição, ícone (`Monitor` do lucide-react), tags e intent.
   - href: `/ferramentas/manter-tela-ligada`

2. **Criar página da ferramenta** ✅
   - Arquivo: `src/app/ferramentas/manter-tela-ligada/page.tsx`
   - Seguir padrão das outras páginas: exportar `metadata`, usar `PageLayout`, incluir `RelatedTools`, SEO content e FAQ.
   - Importar e renderizar o componente principal `<KeepAwake />`.

## Parte 2 — Componente Principal (`KeepAwake`) ✅
Arquivo: `src/components/tools/keep-awake/keep-awake.tsx`

### Funcionalidades
- **Manter tela ligada:** usar `navigator.wakeLock.request("screen")` (Wake Lock API). Fallback: reproduzir vídeo invisível de 1px em loop (trick universal para browsers que não suportam Wake Lock). O fallback deve ser silencioso e sem impacto visual. ✅
- **Timer de sessão:** contador que inicia quando a função é ativada e pausa quando desativada. Usar `requestAnimationFrame` ou `setInterval` (padrão do cronômetro do projeto). Formato: `HH:MM:SS`. ✅
- **Picture-in-Picture (PiP):** botão para abrir o timer em uma janela PiP usando `documentPictureInPicture.requestWindow()` (API moderna) ou fallback para `video.requestPictureInPicture()` com um canvas animado desenhando o timer. A janela PiP deve mostrar o timer em tempo real e um botão para desativar. ✅
- **Tempo programado:** permitir definir um tempo limite após o qual a função se desliga automaticamente. ✅
  - Presets: 15 min, 30 min, 1 h, Customizado. ✅
  - Slider customizado: range 1 a 10 horas, step 30 minutos (valores em minutos: 60, 90, 120, ..., 600). ✅
  - Usar componente `Slider` existente (`src/components/shared/slider.tsx`). ✅
  - Usar `ToggleGroup` ou botões para os presets (como já existe no projeto, verificar se há componente; senão, usar `Button` com estado ativo/inativo). ✅

### Estados
- `isActive: boolean` — se a tela está sendo mantida ligada. ✅
- `elapsedMs: number` — tempo ativo na sessão. ✅
- `mode: "infinite" | "timed"` — modo atual. ✅
- `preset: "15min" | "30min" | "1h" | "custom"` — preset selecionado. ✅
- `customMinutes: number` — valor do slider (60–600, step 30). ✅
- `remainingMs: number` — tempo restante no modo timed. ✅
- `wakeLockRef: WakeLockSentinel | null` — referência do wake lock. ✅
- `timerRef: number` — referência do interval/raf. ✅

### Comportamentos
- Ao ativar:
  - Solicitar wake lock (ou iniciar fallback). ✅
  - Iniciar timer de sessão. ✅
  - Se modo timed, iniciar countdown do tempo restante. ✅
- Ao desativar (manual ou ao fim do countdown):
  - Liberar wake lock. ✅
  - Parar timers. ✅
  - Resetar elapsed/remaining se desativação manual; se fim do countdown, manter elapsed e mostrar mensagem. ✅
- Ao trocar de aba/minimizar:
  - Wake Lock API já lida com isso em browsers compatíveis; fallback de vídeo também continua funcionando. ✅

### UI
- Layout em cards ou seções usando os padrões visuais do projeto (Tailwind utilities, tokens globais). ✅
- Botões: `Button` do projeto (variantes: default, outline, ghost). ✅
- Slider: `Slider` compartilhado. ✅
- Display do timer: `ResultBox` ou texto estilizado similar ao cronômetro. ✅
- PiP: botão com ícone `PictureInPicture` (lucide-react). ✅

## Parte 3 — PiP (Picture-in-Picture) ✅
- Verificar suporte a `documentPictureInPicture` (Chrome/Edge 116+). ✅
- Se suportado:
  - Criar uma janela PiP pequena (300x150) via `documentPictureInPicture.requestWindow()`. ✅
  - Renderizar nela um mini-componente React com o timer e um botão "Desligar". ✅
  - Usar `ReactDOM.createPortal` ou renderizar manualmente no `document` da janela PiP. ✅
  - Atualizar o conteúdo via estado compartilhado (postMessage ou referência ao estado do componente pai). ✅
- Se não suportado:
  - Fallback: usar `<canvas>` + `video` + `requestPictureInPicture()`. ✅
  - Desenhar o timer no canvas a cada frame e streamar para o vídeo. ✅
- Botão PiP desabilitado se nenhuma API estiver disponível. ✅

## Parte 4 — SEO e Conteúdo ✅
- `metadata` na página com title e description otimizados. ✅
- Adicionado `keywords` com termos relevantes (manter tela ligada, wake lock, screen awake, etc.). ✅
- Adicionado `openGraph` para compartilhamento em redes sociais. ✅
- Seção de FAQ expandida para 7 perguntas: ✅
  - Funciona em qual sistema operacional?
  - Precisa instalar algo?
  - O que é Picture-in-Picture?
  - Gasta muita bateria?
  - Funciona em segundo plano?
  - Qual a diferença entre Wake Lock e vídeo invisível?
  - O timer é preciso?
- `SeoContent` explicando casos de uso (PC corporativo, apresentações, leitura longa, cozinha, estudos, monitoramento). ✅
- Nova seção "Como funciona a ferramenta" explicando Wake Lock API, fallback de vídeo, modos infinito/programado, presets e slider. ✅
- Nova seção "Compatibilidade de navegadores" detalhando suporte a Wake Lock e PiP em Chrome, Edge, Safari e Firefox. ✅

## Parte 5 — Testes e Ajustes
- Testar wake lock em Chrome/Edge (suporte nativo).
- Testar fallback em Safari/Firefox.
- Testar PiP em Chrome/Edge.
- Verificar se o timer continua preciso ao trocar de aba.
- Garantir que o vídeo fallback seja invisível (`width: 1px; height: 1px; opacity: 0; position: fixed; pointer-events: none`).
- Verificar se não há erros de TypeScript (tipos da Wake Lock API podem precisar de `@types/dom-view-transitions` ou declaração manual se não estiver no TS padrão).

## Dependências
- Nenhuma lib nova necessária para wake lock (API nativa).
- Nenhuma lib nova para PiP (API nativa).
- Se necessário, instalar componente `Switch` ou `ToggleGroup` do shadcn/ui caso o projeto não tenha. Verificar antes se já existe.

## Arquivos a criar/modificar
| Arquivo | Ação |
|---------|------|
| `src/lib/data/tools.ts` | Adicionar tool na categoria `utilitarios` |
| `src/app/ferramentas/manter-tela-ligada/page.tsx` | Criar página com metadata e layout |
| `src/components/tools/keep-awake/keep-awake.tsx` | Criar componente principal |
| `src/components/tools/keep-awake/pip-window.tsx` | Criar componente PiP (opcional, pode ficar no mesmo arquivo) |
| `plan.md` | Este arquivo (já criado) |

## Observações
- O projeto usa `function` ao invés de arrow functions e `type` ao invés de `interface`.
- UI em pt-BR, código em inglês.
- Sem comentários no código.
- Usar apenas Tailwind utilities + design tokens do CSS global.
- Não expor erros internos; mensagens amigáveis em pt-BR.
