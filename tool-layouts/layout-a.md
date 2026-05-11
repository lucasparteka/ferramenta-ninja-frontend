# Layout A — 3 Painéis (Geradores com Preview Visual)

> Fonte: `LAYOUT-RESTRUCTURE.md` §"Layout A — 3 painéis (geradores com preview)"
> Design: `DESIGN.md` §11.2.A, §12.1

## Quando usar

Ferramentas onde o usuário ajusta parâmetros e o output muda em tempo real, com **preview visual** obrigatório. O usuário sente que está usando um instrumento de precisão — painel de controles, canvas central, ajustes de estilo.

## Grid estrutural

```tsx
<div className="grid grid-cols-[280px_1fr_300px] gap-0 border border-border rounded-lg overflow-hidden">
  <div className="border-r border-border p-4">{/* Esquerda */}</div>
  <div className="border-r border-border bg-muted/40">{/* Centro */}</div>
  <div className="bg-card border-l border-border p-4">{/* Direita */}</div>
</div>
```

## Ferramentas mapeadas (10)

| Ferramenta | Rota | Justificativa de layout |
|---|---|---|
| **Gerador de QR Code** | `/ferramentas/gerador-de-qr-code` | Preview do QR gerado + controles de conteúdo/formato. Mapeado como `qr-generator` no LAYOUT-RESTRUCTURE. |
| **Gerador de QR Code Personalizado** | `/ferramentas/gerador-de-qr-code-personalizado` | Preview central + painel esquerdo com modo (cor/gradiente/logo) + painel direito com cor, raio, padding. |
| **Gerador de QR Code WiFi** | `/ferramentas/gerador-de-qr-code-wifi` | Mesma estrutura do gerador de QR — SSID/senha/tipo no esquerdo, preview central, estilo à direita. Mapeado como `wifi-qr`. |
| **Gerador de QR Code PIX** | `/ferramentas/gerador-de-qr-code-pix` | Chave PIX + valor + descrição no esquerdo, preview do QR PIX central, opções de exportação à direita. Mapeado como `pix-qr`. |
| **Gerador de Código de Barras** | `/ferramentas/gerador-de-codigo-de-barras` | Seletor de formato (EAN, CODE128, etc.) + dados no esquerdo, preview central, ajustes de altura/largura/margem à direita. |
| **Paleta de Cores** | `/ferramentas/paleta-de-cores` | Modo de geração (harmonia, imagem, aleatório) no esquerdo, preview central com swatches, ajustes de quantidade/formato à direita. |
| **Gerador de Gradiente CSS** | `/ferramentas/gerador-gradiente-css` | Tipo (linear/radial/conic) + ângulo + cores no painel, preview central com canvas, código CSS à direita. |
| **Recortar Imagem** | `/ferramentas/recortar-imagem` | Upload/origem no esquerdo, preview central com área de crop interativa, controles de proporção/tamanho à direita. |
| **Redimensionar Imagem** | `/ferramentas/redimensionar-imagem` | Upload + modo (largura/altura/percentual) no esquerdo, preview central com dimensões, opções de formato/qualidade à direita. |
| **Comprimir Imagem** | `/ferramentas/comprimir-imagem` | Upload + formato de saída no esquerdo, preview lado a lado (original vs comprimida) no centro, slider de qualidade/métricas de redução à direita. |

## Anti-padrões a evitar

- ❌ Resultado em rota separada ou abaixo do form
- ❌ Coluna única empilhada no desktop
- ❌ Botões de "Gerar" no meio do conteúdo (o CTA principal fica no sticky header)
- ❌ Cards flutuantes com gap — usar painéis conectados com `border-r`/`border-l`

## Checklist de implementação

- [ ] Sticky header com título + CTA único (`variant="default"`)
- [ ] Painel esquerdo 280px: modo/seleção em botões verticais `w-full`
- [ ] Painel central: fundo `bg-muted/40`, canvas com `aspect-square`
- [ ] Painel direito 300px: `bg-card`, controles separados por `border-t`
- [ ] Section headers em ALL CAPS `text-[11px] font-semibold uppercase tracking-wider`
- [ ] Todos os números/dimensensões/IDs em `font-mono` com `tabular-nums`
- [ ] Container externo: `rounded-lg border border-border overflow-hidden` (sem `gap-*`)
- [ ] Um único `variant="default"` por tela
