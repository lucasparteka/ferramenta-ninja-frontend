# Layout C — Input ↔ Output (Conversores Síncronos)

> Fonte: `LAYOUT-RESTRUCTURE.md` §"Layout C — Input ↔ output (conversores)"
> Design: `DESIGN.md` §11.2.C, §12.3

## Quando usar

Ferramentas de **conversão/formatação síncrona** — o usuário digita/coloca conteúdo de um lado e o resultado aparece do outro **sem botão de submit**. Transformação é imediata ao digitar.

## Grid estrutural

```tsx
<div className="grid grid-cols-1 gap-0 border border-border rounded-lg overflow-hidden md:grid-cols-2">
  <div className="border-r border-border flex flex-col">
    <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Entrada</span>
      {/* seletor + limpar */}
    </div>
    <textarea className="flex-1 min-h-[280px] resize-none bg-transparent p-3 font-mono text-sm" />
  </div>
  <div className="flex flex-col">
    <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Saída</span>
      {/* copiar + info */}
    </div>
    <pre className="flex-1 min-h-[280px] bg-muted/20 p-3 font-mono text-sm" />
  </div>
</div>

{/* Rodapé de metadados */}
<div className="border-t border-border bg-muted/40 px-4 py-2 flex items-center gap-4">
  <span className="font-mono text-[11px] text-muted-foreground">{inputBytes} bytes</span>
  <span className="text-[11px] text-muted-foreground">→</span>
  <span className="font-mono text-[11px] text-muted-foreground">{outputBytes} bytes</span>
</div>
```

## Ferramentas mapeadas (11)

| Ferramenta | Rota | Justificativa de layout |
|---|---|---|
| **Converter CSV para SQL** | `/ferramentas/converter-csv-para-sql` | CSV no textarea esquerdo → SQL (INSERT/CREATE TABLE) no direito. Sem botão — atualiza ao digitar. Mapeado como `csv-json` no restructure. |
| **Número por Extenso** | `/ferramentas/numero-por-extenso` | Input numérico esquerdo → texto por extenso direito. Conversão síncrona, sem submit. |
| **Conversor de Unidades** | `/ferramentas/conversor-de-unidades` | Seletor de categoria + valor + unidade origem → múltiplas unidades de saída. Atualização síncrona. |
| **Conversor de Temperatura** | `/ferramentas/conversor-de-temperatura` | Valor + unidade origem → múltiplas saídas (°C, °F, K). O LAYOUT-RESTRUCTURE mapeia `temperature-converter` para C. |
| **Formatar JSON** | `/ferramentas/formatar-json` | JSON bruto/minificado esquerdo → JSON formatado/indentado direito. Header com opções (indentação, sort keys). Mapeado como `json-formatter`. |
| **Converter CSV para PDF** | `/ferramentas/converter-csv-para-pdf` | CSV esquerdo → preview/geração de PDF direito. Header com opções de formatação. |
| **Converter Imagem em Texto** | `/ferramentas/converter-imagem-em-texto` | Upload de imagem esquerdo (preview) → texto OCR extraído direito. Conversão unidirecional, mas segue padrão C de input/output lado a lado. |
| **Converter Imagem** | `/ferramentas/converter-imagem` | Upload de imagem esquerdo → preview da imagem convertida direito. Seletor de formato de saída no header da coluna direita. |
| **Converter Imagem para Base64** | `/ferramentas/converter-imagem-para-base64` | Upload de imagem esquerdo (com preview) → string base64 direito. Mapeado como `image-base64` no restructure. |
| **Gerador de Box Shadow CSS** | `/ferramentas/gerador-de-box-shadow-css` | Controles no header esquerdo (X, Y, blur, spread, cor) → preview visual + código CSS direito. O LAYOUT-RESTRUCTURE mapeia `box-shadow` explicitamente para C: "Input CSS ↔ preview visual". |
| **Leitor de QR Code** | `/ferramentas/leitor-de-qr-code` | Upload/colagem de imagem com QR esquerdo → texto/link decodificado direito. Input/output lado a lado. |

## Botão de swap (quando aplicável)

Para conversores bidirecionais (ex: converter-imagem ↔ base64, se houver modo reverso):

```tsx
<div className="relative hidden md:flex items-center justify-center">
  <button
    className="absolute z-10 rounded-md border border-border bg-card p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    aria-label="Inverter direção"
  >
    <ArrowLeftRight className="h-3.5 w-3.5" />
  </button>
</div>
```

## Anti-padrões a evitar

- ❌ Botão "Converter" — a transformação deve ser síncrona
- ❌ Textarea com border interna — usar border do container grid
- ❌ Output editável — saída é `readonly`/`cursor-default`
- ❌ Gap entre colunas — usar `border-r` do container

## Checklist de implementação

- [ ] Container unificado: `rounded-lg border border-border overflow-hidden grid md:grid-cols-2` (sem `gap-*`)
- [ ] Header por coluna: label ALL CAPS + ações (limpar/copiar/seletor)
- [ ] Entrada: `bg-transparent`, saída: `bg-muted/20 cursor-default select-all`
- [ ] Rodapé com metadados: tamanho original, tamanho resultado, ratio
- [ ] Fonte mono em todo conteúdo técnico (código, base64, SQL)
- [ ] Um único CTA por tela (geralmente "Copiar resultado" no header da coluna direita)
