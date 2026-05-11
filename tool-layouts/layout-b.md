# Layout B — Form + Resultado (Calculadoras e Geradores com Submit)

> Fonte: `LAYOUT-RESTRUCTURE.md` §"Layout B — Form + resultado (calculadoras)"
> Design: `DESIGN.md` §11.2.B, §12.2

## Quando usar

Ferramentas onde o usuário **preenche um formulário** e clica em calcular/gerar para obter um resultado. O resultado aparece em coluna direita *sticky* (visível enquanto edita) — nunca empilhado abaixo do form.

## Grid estrutural

```tsx
<div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
  <div className="space-y-6">{/* Form */}</div>
  <div className="lg:sticky lg:top-[calc(3.5rem+1px)]">
    <div className="rounded-md border border-border bg-card p-4 space-y-4">
      {/* Resultado */}
    </div>
  </div>
</div>
```

## Ferramentas mapeadas (9)

| Ferramenta | Rota | Justificativa de layout |
|---|---|---|
| **Calcular Horas Trabalhadas** | `/ferramentas/calcular-horas-trabalhadas` | Entrada de horários (entrada/saída/almoço) → cálculo de total de horas. Resultado em sidebar sticky com detalhamento por dia. Calculadora típica. |
| **Gerador de Senha** | `/ferramentas/gerador-de-senha` | Parâmetros no form (comprimento, símbolos, números, maiúsculas) → senha gerada. O LAYOUT-RESTRUCTURE mapeia `password-generator` para B: form esquerda + resultado sticky direita. |
| **Gerador de CPF** | `/ferramentas/gerador-de-cpf` | Opções (com ou sem pontuação, estado de origem) no form → CPF gerado. Simples, sem preview visual complexo. |
| **Gerador de CNPJ** | `/ferramentas/gerador-de-CNPJ` | Opções de formatação + estado → CNPJ gerado. Mesmo padrão do gerador de CPF. |
| **Gerador de Cartão de Crédito** | `/ferramentas/gerador-de-cartao-de-credito` | Bandeira + quantidade + formato → cartões gerados. Resultado em lista na sidebar. |
| **Gerador de UUID** | `/ferramentas/gerador-de-uuid` | Versão (v1/v4/v5) + quantidade + maiúsculas/minúsculas → UUIDs gerados. |
| **Gerador de Dados Mock** | `/ferramentas/gerador-de-dados-mock` | Schema/configuração de campos (nome, email, CPF, etc.) + quantidade → tabela/JSON de dados fictícios. |
| **Gerador de Meta Tags** | `/ferramentas/gerador-meta-tags` | Campos do form (título, descrição, imagem OG, Twitter card, etc.) → bloco de meta tags HTML gerado. |
| **Gerador de Código de Barras em Lote** | `/ferramentas/gerador-de-codigo-de-barras-em-lote` | Upload de CSV/textarea com dados + configuração de formato → lista de códigos gerados para download. Não tem preview individual em tempo real como o gerador unitário (Layout A). |

## Estados do resultado

- **Vazio:** `border-dashed` + texto "Preencha os dados para calcular"
- **Preenchido:** valor principal em `text-2xl font-semibold`, label em `text-xs text-muted-foreground`
- **Detalhamento:** tabela com `divide-y divide-border`, label `text-xs text-muted-foreground` + valor `font-mono text-xs`

## Anti-padrões a evitar

- ❌ Resultado aparece **abaixo** do form — o usuário precisa rolar para ver
- ❌ Form com `space-y-6` entre campos — usar `space-y-3`
- ❌ Mais de um `variant="default"` por tela
- ❌ Padding `p-6` em painéis — manter `p-4`

## Checklist de implementação

- [ ] H1 `text-2xl font-semibold tracking-tight` + descrição `text-sm text-muted-foreground`
- [ ] Form com grupos separados por section headers ALL CAPS
- [ ] CTA `[Calcular]`/`[Gerar]` no rodapé do form — `variant="default"`, `w-full`
- [ ] Resultado em coluna direita `lg:sticky`
- [ ] Valores numéricos/totais/IDs em `font-mono` com `tabular-nums`
- [ ] Botões de ação no resultado em `outline`, `size="sm"`
- [ ] Labels de input em `text-xs font-medium`, campos em `space-y-3`
