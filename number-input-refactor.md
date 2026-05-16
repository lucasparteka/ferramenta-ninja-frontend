# NumberInput — Plano de Migração

> Mapeamento dos 14 inputs numéricos que precisam ser migrados para `<NumberInput>`,
> conforme o padrão descrito em [`input-value.md`](./input-value.md).

---

## 1. `christmas-bonus-client.tsx` — 2 inputs

### 1.1 `monthsWorked` (linha ~150)

| Campo | Valor |
|-------|-------|
| State | `number` |
| Range | 1 — 12 |
| Tipo | Inteiro |
| Issue | `Number("")` = 0, abaixo do min=1. Limpar trava no 0 inválido. |
| Substituir por | `<NumberInput min={1} max={12} />` |

```tsx
// ANTES
<Input
  id="monthsWorked"
  type="number"
  min={1}
  max={12}
  value={state.monthsWorked}
  onChange={(e) => set("monthsWorked")(Number(e.target.value))}
/>

// DEPOIS
<NumberInput
  id="monthsWorked"
  value={state.monthsWorked}
  onChange={(v) => set("monthsWorked")(v)}
  min={1}
  max={12}
/>
```

### 1.2 `dependents` (linha ~165)

| Campo | Valor |
|-------|-------|
| State | `number` |
| Range | 0 — ∞ |
| Tipo | Inteiro |
| Issue | `Number("")` = 0. Funciona, mas zera sem querer ao limpar. |
| Substituir por | `<NumberInput min={0} />` |

```tsx
// ANTES
<Input
  id="dependents"
  type="number"
  min={0}
  value={state.dependents}
  onChange={(e) => set("dependents")(Number(e.target.value))}
/>

// DEPOIS
<NumberInput
  id="dependents"
  value={state.dependents}
  onChange={(v) => set("dependents")(v)}
  min={0}
/>
```

---

## 2. `compound-interest-client.tsx` — 2 inputs

### 2.1 `annualRate` (linha ~146)

| Campo | Valor |
|-------|-------|
| State | `number` |
| Range | 0 — ∞ |
| Tipo | Decimal (step=0.01) |
| Issue | `Number("")` = 0. Zera a taxa ao limpar. |
| Substituir por | `<NumberInput min={0} step={0.01} />` |

```tsx
// ANTES
<Input
  id="annualRate"
  type="number"
  step={0.01}
  min={0}
  value={state.annualRate}
  onChange={(e) => set("annualRate")(Number(e.target.value))}
/>

// DEPOIS
<NumberInput
  id="annualRate"
  value={state.annualRate}
  onChange={(v) => set("annualRate")(v)}
  min={0}
  step={0.01}
/>
```

### 2.2 `months` (linha ~159)

| Campo | Valor |
|-------|-------|
| State | `number` |
| Range | 1 — 600 |
| Tipo | Inteiro |
| Issue | `Number("")` = 0, abaixo do min=1. |
| Substituir por | `<NumberInput min={1} max={600} />` |

```tsx
// ANTES
<Input
  id="months"
  type="number"
  min={1}
  max={600}
  value={state.months}
  onChange={(e) => set("months")(Number(e.target.value))}
/>

// DEPOIS
<NumberInput
  id="months"
  value={state.months}
  onChange={(v) => set("months")(v)}
  min={1}
  max={600}
/>
```

---

## 3. `fixed-income-client.tsx` — 4 inputs

### 3.1 `days` (linha ~131)

| Campo | Valor |
|-------|-------|
| State | `number` |
| Range | 1 — 7300 |
| Tipo | Inteiro |
| Issue | `Number("")` = 0, abaixo do min=1. |
| Substituir por | `<NumberInput min={1} max={7300} />` |

```tsx
// ANTES
<Input
  id="days"
  type="number"
  min={1}
  max={7300}
  value={state.days}
  onChange={(e) => set("days")(Number(e.target.value))}
/>

// DEPOIS
<NumberInput
  id="days"
  value={state.days}
  onChange={(v) => set("days")(v)}
  min={1}
  max={7300}
/>
```

### 3.2 `annualIndexRate` (linha ~202)

| Campo | Valor |
|-------|-------|
| State | `number` |
| Range | 0 — ∞ |
| Tipo | Decimal (step=0.01) |
| Issue | `Number("")` = 0. Zera ao limpar. |
| Substituir por | `<NumberInput min={0} step={0.01} />` |

```tsx
// ANTES
<Input
  id="annualIndexRate"
  type="number"
  step={0.01}
  min={0}
  value={state.annualIndexRate}
  onChange={(e) => set("annualIndexRate")(Number(e.target.value))}
/>

// DEPOIS
<NumberInput
  id="annualIndexRate"
  value={state.annualIndexRate}
  onChange={(v) => set("annualIndexRate")(v)}
  min={0}
  step={0.01}
/>
```

### 3.3 `indexPercentage` (linha ~220)

| Campo | Valor |
|-------|-------|
| State | `number` |
| Range | 0 — 300 |
| Tipo | Decimal (step=0.01) |
| Issue | `Number("")` = 0. Zera ao limpar. |
| Substituir por | `<NumberInput min={0} max={300} step={0.01} />` |

```tsx
// ANTES
<Input
  id="indexPercentage"
  type="number"
  step={0.01}
  min={0}
  max={300}
  value={state.indexPercentage}
  onChange={(e) => set("indexPercentage")(Number(e.target.value))}
/>

// DEPOIS
<NumberInput
  id="indexPercentage"
  value={state.indexPercentage}
  onChange={(v) => set("indexPercentage")(v)}
  min={0}
  max={300}
  step={0.01}
/>
```

### 3.4 `prefixedAnnualRate` (linha ~241)

| Campo | Valor |
|-------|-------|
| State | `number` |
| Range | 0 — ∞ |
| Tipo | Decimal (step=0.01) |
| Issue | `Number("")` = 0. Zera ao limpar. |
| Substituir por | `<NumberInput min={0} step={0.01} />` |

```tsx
// ANTES
<Input
  id="prefixedAnnualRate"
  type="number"
  step={0.01}
  min={0}
  value={state.prefixedAnnualRate}
  onChange={(e) => set("prefixedAnnualRate")(Number(e.target.value))}
/>

// DEPOIS
<NumberInput
  id="prefixedAnnualRate"
  value={state.prefixedAnnualRate}
  onChange={(v) => set("prefixedAnnualRate")(v)}
  min={0}
  step={0.01}
/>
```

---

## 4. `vacation-client.tsx` — 4 inputs

### 4.1 `daysToTake` (linha ~142)

| Campo | Valor |
|-------|-------|
| State | `number` |
| Range | 5 — 30 |
| Tipo | Inteiro |
| Issue | `Number("")` = 0, abaixo do min=5. Não consegue apagar. |
| Substituir por | `<NumberInput min={5} max={30} />` |

```tsx
// ANTES
<Input
  id="daysToTake"
  type="number"
  min={5}
  max={30}
  value={state.daysToTake}
  onChange={(e) => set("daysToTake")(Number(e.target.value))}
/>

// DEPOIS
<NumberInput
  id="daysToTake"
  value={state.daysToTake}
  onChange={(v) => set("daysToTake")(v)}
  min={5}
  max={30}
/>
```

### 4.2 `monthsAtCompany` (linha ~169)

| Campo | Valor |
|-------|-------|
| State | `number` |
| Range | 1 — 12 |
| Tipo | Inteiro |
| Issue | `Number("")` = 0, abaixo do min=1. Não consegue apagar. |
| Substituir por | `<NumberInput min={1} max={12} />` |

```tsx
// ANTES
<Input
  id="monthsAtCompany"
  type="number"
  min={1}
  max={12}
  value={state.monthsAtCompany}
  onChange={(e) => set("monthsAtCompany")(Number(e.target.value))}
/>

// DEPOIS
<NumberInput
  id="monthsAtCompany"
  value={state.monthsAtCompany}
  onChange={(v) => set("monthsAtCompany")(v)}
  min={1}
  max={12}
/>
```

### 4.3 `absences` (linha ~187)

| Campo | Valor |
|-------|-------|
| State | `number` |
| Range | 0 — ∞ |
| Tipo | Inteiro |
| Issue | `Number("")` = 0. Zera ao limpar. |
| Substituir por | `<NumberInput min={0} />` |

```tsx
// ANTES
<Input
  id="absences"
  type="number"
  min={0}
  value={state.absences}
  onChange={(e) => set("absences")(Number(e.target.value))}
/>

// DEPOIS
<NumberInput
  id="absences"
  value={state.absences}
  onChange={(v) => set("absences")(v)}
  min={0}
/>
```

### 4.4 `dependents` (linha ~203)

| Campo | Valor |
|-------|-------|
| State | `number` |
| Range | 0 — ∞ |
| Tipo | Inteiro |
| Issue | `Number("")` = 0. Zera ao limpar. |
| Substituir por | `<NumberInput min={0} />` |

```tsx
// ANTES
<Input
  id="dependents"
  type="number"
  min={0}
  value={state.dependents}
  onChange={(e) => set("dependents")(Number(e.target.value))}
/>

// DEPOIS
<NumberInput
  id="dependents"
  value={state.dependents}
  onChange={(v) => set("dependents")(v)}
  min={0}
/>
```

---

## 5. `rescisao-client.tsx` — 1 input

### 5.1 `dependents` (linha ~304)

| Campo | Valor |
|-------|-------|
| State | `number` |
| Range | 0 — 10 |
| Tipo | Inteiro |
| Issue | `Number("")` = 0. Zera ao limpar. |
| Substituir por | `<NumberInput min={0} max={10} />` |

```tsx
// ANTES
<Input
  id="deps"
  type="number"
  min={0}
  max={10}
  value={state.dependents}
  onChange={(e) => set("dependents")(Number(e.target.value))}
  className="font-mono tabular-nums"
/>

// DEPOIS
<NumberInput
  id="deps"
  value={state.dependents}
  onChange={(v) => set("dependents")(v)}
  min={0}
  max={10}
/>
```

---

## 6. `salary-client.tsx` — 1 input

### 6.1 `dependents` (linha ~153)

| Campo | Valor |
|-------|-------|
| State | `number` |
| Range | 0 — 10 |
| Tipo | Inteiro |
| Issue | `Number("")` = 0. Zera ao limpar. |
| Substituir por | `<NumberInput min={0} max={10} />` |

```tsx
// ANTES
<Input
  type="number"
  min={0}
  max={10}
  value={state.dependents}
  onChange={(e) => set("dependents")(Number(e.target.value))}
/>

// DEPOIS
<NumberInput
  value={state.dependents}
  onChange={(v) => set("dependents")(v)}
  min={0}
  max={10}
/>
```

---

## Resumo por ferramenta

| # | Ferramenta | Arquivo | Inputs |
|---|-----------|---------|--------|
| 1 | Christmas Bonus | `christmas-bonus-client.tsx` | `monthsWorked`, `dependents` |
| 2 | Compound Interest | `compound-interest-client.tsx` | `annualRate`, `months` |
| 3 | Fixed Income | `fixed-income-client.tsx` | `days`, `annualIndexRate`, `indexPercentage`, `prefixedAnnualRate` |
| 4 | Vacation | `vacation-client.tsx` | `daysToTake`, `monthsAtCompany`, `absences`, `dependents` |
| 5 | Rescisão | `rescisao-client.tsx` | `dependents` |
| 6 | Salary | `salary-client.tsx` | `dependents` |

**Total: 14 inputs em 6 arquivos.**

---

## Checklist de migração

- [x] `christmas-bonus-client.tsx`
  - [x] `monthsWorked` (1–12)
  - [x] `dependents` (≥0)
- [x] `compound-interest-client.tsx`
  - [x] `annualRate` (≥0, decimal)
  - [x] `months` (1–600)
- [ ] `fixed-income-client.tsx`
  - [ ] `days` (1–7300)
  - [ ] `annualIndexRate` (≥0, decimal)
  - [ ] `indexPercentage` (0–300, decimal)
  - [ ] `prefixedAnnualRate` (≥0, decimal)
- [ ] `vacation-client.tsx`
  - [ ] `daysToTake` (5–30)
  - [ ] `monthsAtCompany` (1–12)
  - [ ] `absences` (≥0)
  - [ ] `dependents` (≥0)
- [ ] `rescisao-client.tsx`
  - [ ] `dependents` (0–10)
- [ ] `salary-client.tsx`
  - [ ] `dependents` (0–10)
