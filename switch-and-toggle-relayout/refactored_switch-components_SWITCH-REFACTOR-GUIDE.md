# Guia de refatoração — padronização de switch

## Contexto

Existiam 5 padrões distintos para o mesmo trabalho. Este guia consolida tudo em 2 componentes canônicos.

| Antes | Depois |
|---|---|
| `SwitchRow` (canônico) + inline `role="switch"` + `<input type="checkbox">` | `SwitchRow` único |
| `OptionSwitch` (canônico) + `Segmented` (rescisao) | `OptionSwitch` único |

---

## O que mudou nos componentes

### `SwitchRow`

| Propriedade | Antes | Depois |
|---|---|---|
| Tamanho do pill | `h-4 w-7` (16×28px) | `h-5 w-9` (20×36px) |
| Cor ativa | `bg-foreground/80` (cinza escuro) | `bg-primary` (azul) |
| Tamanho do thumb | `h-3 w-3` (12px) | `h-4 w-4` (16px) |
| Posição ativa do thumb | `left-[14px]` | `left-[18px]` |
| API de props | sem alteração | sem alteração |

A API é 100% compatível — nenhum arquivo que já usa `<SwitchRow>` precisa mudar além do import, caso mova o arquivo.

### `OptionSwitch`

| Propriedade | Antes | Depois |
|---|---|---|
| Container | `border border-border rounded-md p-0.5` (fundo transparente) | `bg-muted border border-border rounded-md p-0.5 gap-0.5` |
| Botão ativo | `bg-muted shadow-[inset_0_0_0_1px_var(--border)]` | `bg-card shadow-[0_1px_3px_oklch(0_0_0/0.12),0_0_0_0.5px_oklch(0_0_0/0.08)] font-semibold` |
| Acessibilidade | sem role/aria no container | `role="radiogroup"` no container, `role="radio"` + `aria-checked` nos botões |
| Novo prop `fullWidth` | ausente | `fullWidth?: boolean` — substitui o `w-full flex-1` manual do `Segmented` |
| Tipo exportado | tipo `Option` interno | `OptionSwitchOption` exportado (compatível com `SegmentedOption`) |

---

## Mapa de migração

### 1. Substituir inline `role="switch"` por `<SwitchRow>`

**Arquivos afetados:**
- `src/components/tools/text-generator/text-generator.tsx`
- `src/components/tools/random-picker/random-picker.tsx`

**Antes (pattern inline):**
```tsx
<div className="flex items-center justify-between gap-3 py-1.5 cursor-pointer"
     onClick={() => setAllowRepeat(!allowRepeat)}>
  <span className="text-xs font-medium">Permitir repetição</span>
  <button role="switch" aria-checked={allowRepeat}
          className={cn("relative h-4 w-7 shrink-0 rounded-full transition-colors",
            allowRepeat ? "bg-foreground/80" : "bg-border")}>
    <span className={cn("absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all shadow-sm",
      allowRepeat ? "left-[14px]" : "left-0.5")} />
  </button>
</div>
```

**Depois:**
```tsx
import { SwitchRow } from "@/components/shared/switch-row";

<SwitchRow
  label="Permitir repetição"
  checked={allowRepeat}
  onChange={setAllowRepeat}
/>
```

---

### 2. Substituir `<input type="checkbox">` por `<SwitchRow>`

**Arquivos afetados:**
- `src/components/tools/work-hours-calculator/work-hours-calculator.tsx` (ou cliente)
- `src/components/tools/hash-generator/hash-generator.tsx`
- `src/components/tools/markdown-to-html/markdown-to-html.tsx`

**Antes:**
```tsx
<label className="flex items-center gap-2 text-sm cursor-pointer">
  <input
    type="checkbox"
    checked={includeSaturday}
    onChange={(e) => setIncludeSaturday(e.target.checked)}
    className="accent-primary"
  />
  Incluir sábado e domingo
</label>
```

**Depois:**
```tsx
import { SwitchRow } from "@/components/shared/switch-row";

<SwitchRow
  label="Incluir sábado e domingo"
  checked={includeSaturday}
  onChange={setIncludeSaturday}
/>
```

---

### 3. Substituir `<Segmented>` por `<OptionSwitch fullWidth>`

**Arquivos afetados:**
- `src/components/tools/rescisao/_parts/` — todos que importam `Segmented`

**Antes:**
```tsx
import { Segmented, SegmentedOption } from "./_parts/segmented";

const options: SegmentedOption[] = [
  { value: "sem-justa-causa", label: "Sem justa causa" },
  { value: "com-justa-causa", label: "Com justa causa" },
];

<Segmented value={tipo} onChange={setTipo} options={options} />
```

**Depois:**
```tsx
import { OptionSwitch, OptionSwitchOption } from "@/components/shared/option-switch";

const options: OptionSwitchOption[] = [
  { value: "sem-justa-causa", label: "Sem justa causa" },
  { value: "com-justa-causa", label: "Com justa causa" },
];

<OptionSwitch value={tipo} onChange={setTipo} options={options} fullWidth />
```

O tipo `OptionSwitchOption` tem a mesma forma que `SegmentedOption` (`{ value: string; label: string }`), então a declaração de dados não precisa mudar.

---

### 4. Deletar `Segmented` após migração

Após substituir todas as ocorrências:

```bash
# verificar que não há mais imports antes de deletar
grep -r "from.*segmented" src/

# deletar
rm src/components/tools/rescisao/_parts/segmented.tsx
```

---

## Checklist de execução

- [ ] Atualizar `src/components/shared/switch-row.tsx` com o novo arquivo
- [ ] Atualizar `src/components/shared/option-switch.tsx` com o novo arquivo
- [ ] Migrar `text-generator.tsx` — substituir inline switch por `<SwitchRow>`
- [ ] Migrar `random-picker.tsx` — substituir inline switch por `<SwitchRow>`
- [ ] Migrar `work-hours-calculator` — substituir checkbox por `<SwitchRow>`
- [ ] Migrar `hash-generator` — substituir checkbox por `<SwitchRow>`
- [ ] Migrar `markdown-to-html` — substituir checkbox por `<SwitchRow>`
- [ ] Migrar `rescisao` — substituir `<Segmented>` por `<OptionSwitch fullWidth>`
- [ ] Deletar `src/components/tools/rescisao/_parts/segmented.tsx`
- [ ] Rodar `pnpm build` e verificar sem erros de tipo
