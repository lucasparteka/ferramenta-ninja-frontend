# Layout E — Inspector (Busca por ID → Ficha de Resultado)

> Fonte: `LAYOUT-RESTRUCTURE.md` §"Layout E — Inspector (busca por ID)"
> Design: `DESIGN.md` §12.5

## Quando usar

Ferramentas onde o usuário **insere um identificador** (CEP, CNPJ, código PIX, linha digitável) e a ferramenta **consulta/valida/decodifica** retornando uma ficha de resultado estruturada em grid. Estados claros: vazio → loading → resultado → erro.

> Nota: Embora o `DESIGN.md` original (§12.5) mencione que "inspector usa Layout B com input compacto", o `LAYOUT-RESTRUCTURE.md` formalizou o Layout E como padrão canônico separado para essas ferramentas, com estrutura de search bar + grid de resultado + estados bem definidos.

## Grid estrutural

```tsx
<div className="space-y-6">
  {/* Search bar */}
  <div className="flex gap-2">
    <Input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="00.000.000/0000-00"
      className="font-mono"
      onKeyDown={e => e.key === "Enter" && handleSearch()}
    />
    <Button onClick={handleSearch} disabled={loading}>
      {loading
        ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
        : <Search className="mr-2 h-3.5 w-3.5" />
      }
      {loading ? "Consultando..." : "Consultar"}
    </Button>
  </div>

  {/* Estado */}
  {state === "empty" && <EmptyState />}
  {state === "loading" && <LoadingState />}
  {state === "error" && <ErrorState />}
  {state === "result" && (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      {sections.map(section => (
        <div key={section.title} className="rounded-md border border-border bg-card">
          <div className="border-b border-border px-4 py-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </h3>
          </div>
          <div className="divide-y divide-border">
            {section.rows.map(row => (
              <div key={row.label} className="flex items-start justify-between px-4 py-2.5">
                <span className="text-xs text-muted-foreground min-w-[100px]">{row.label}</span>
                <span className={cn("text-xs text-right", row.mono && "font-mono")}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )}
</div>
```

## Ferramentas mapeadas (6)

| Ferramenta | Rota | Justificativa de layout |
|---|---|---|
| **Decodificador PIX** | `/ferramentas/decodificador-pix` | Usuário cola o código PIX (copia e cola) → ficha decodificada com chave, valor, descrição, merchant info. Mapeado como `decodificador-pix` no restructure. |
| **Consulta CEP** | `/ferramentas/consulta-cep` | Input de CEP → ficha com logradouro, bairro, cidade, UF, DDD. Mapeado como `consulta-cep`. |
| **Consulta CNPJ** | `/ferramentas/consulta-cnpj` | Input de CNPJ → ficha com identificação, endereço, contato, atividade, sócios. Mapeado como `consulta-cnpj` — template prioritário do Layout E. |
| **Tabela FIPE** | `/ferramentas/tabela-fipe` | Seletores em cascata (tipo/marca/modelo/ano) + busca → ficha do veículo com preço médio, código FIPE, mês de referência. |
| **Validador de Boleto** | `/ferramentas/validador-boleto` | Input da linha digitável → ficha de validação com código de barras, valores, vencimento, banco, status de validação. Mapeado como `validador-boleto`. |
| **Validador de Cartão de Crédito** | `/ferramentas/validador-de-cartao-de-credito` | Input do número do cartão → ficha com bandeira detectada, Luhn válido/inválido, BIN, máscara formatada. |

## Estados

### Vazio
```tsx
<div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 text-center p-8">
  <Search className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} />
  <p className="text-sm text-foreground">Digite um identificador para consultar</p>
  <p className="text-xs text-muted-foreground">Dados atualizados em tempo real</p>
</div>
```

### Loading
```tsx
<div className="flex min-h-[200px] items-center justify-center rounded-md border border-border bg-muted/20">
  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
</div>
```

### Erro
```tsx
<div className="rounded-md border border-destructive/30 bg-destructive/5 p-4">
  <div className="flex items-start gap-2">
    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
    <p className="text-xs text-destructive">Identificador não encontrado ou inválido.</p>
  </div>
</div>
```

## Anti-padrões a evitar

- ❌ Resultado empilhado em coluna única no desktop — usar `md:grid-cols-2`
- ❌ Input sem `font-mono` — identificadores são dados técnicos
- ❌ Botão de consulta sem estado de loading
- ❌ Label e valor sem separação clara — usar `min-w-[100px]` no label
- ❌ Section headers sem ALL CAPS

## Checklist de implementação

- [ ] H1 `text-2xl font-semibold tracking-tight` + descrição `text-sm text-muted-foreground`
- [ ] Search bar compacta: `Input` mono + `Button` com ícone `Search`/`Loader2`
- [ ] Submit via Enter (`onKeyDown`)
- [ ] Estados: vazio (`border-dashed`), loading (`animate-spin`), erro (`border-destructive/30`), resultado (grid)
- [ ] Grid de resultado: `grid-cols-1 md:grid-cols-2 gap-4`
- [ ] Cada seção: card com `border-b` no header + `divide-y` nas rows
- [ ] Cada row: label `text-xs text-muted-foreground min-w-[100px]` + valor `text-xs` (mono quando aplicável)
- [ ] Dados numéricos/IDs/códigos em `font-mono`
- [ ] Prose (labels) em sans — nunca mono
