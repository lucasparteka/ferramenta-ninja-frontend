# Padrão: Inputs numéricos com experiência de edição fluida

## O problema

Inputs numéricos controlados pelo React têm um comportamento ruim quando o usuário tenta editar o valor:

1. O usuário quer apagar `1` para digitar `20` → ao apagar, o campo deveria ficar vazio momentaneamente, mas o estado guarda `number` e força imediatamente o fallback (ex: `0` ou `1`), impedindo a edição.
2. O campo `type="number"` tem controles nativos de seta que disparam mudanças e ignoram o estado intermediário vazio.
3. Validações com `Math.max(min, value)` aplicadas no `onChange` bloqueiam qualquer valor abaixo do mínimo — incluindo string vazia ou `0` como passo intermediário da digitação.

O resultado: o usuário não consegue apagar o campo para redigitar, a experiência de edição é travada e frustrante.

---

## A solução

**Guardar o estado como `string`, não como `number`.**

O estado interno aceita qualquer string durante a digitação. O valor numérico real (com clamp e fallback) é calculado apenas em dois momentos:
- `onBlur` — quando o campo perde o foco (normalização visual)
- No submit/ação — quando o valor vai ser de fato usado

```tsx
const [quantity, setQuantity] = useState("1");

function handleChange(raw: string) {
  // Aceita vazio e dígitos; rejeita letras e símbolos
  if (raw === "" || /^\d+$/.test(raw)) setQuantity(raw);
}

function handleBlur() {
  const n = Math.min(100, Math.max(1, Number(quantity) || 1));
  setQuantity(String(n));
}

// Na ação que consome o valor:
const value = Math.min(100, Math.max(1, Number(quantity) || 1));
```

```tsx
<Input
  type="text"
  inputMode="numeric"
  value={quantity}
  onChange={(e) => handleChange(e.target.value)}
  onBlur={handleBlur}
/>
```

> Use `type="text" inputMode="numeric"` em vez de `type="number"`. Isso remove os controles de seta nativos e evita comportamentos inesperados do browser com valores intermediários.

---

## Cenários e variações

### Fallback = 1 (quantidade mínima, sem zero)

Usado quando zero não faz sentido: quantidade de itens a gerar, número de repetições, etc.

```tsx
const [value, setValue] = useState("1");

function handleBlur() {
  const n = Math.min(MAX, Math.max(1, Number(value) || 1));
  setValue(String(n));
}

// No submit:
const parsed = Math.min(MAX, Math.max(1, Number(value) || 1));
```

### Fallback = 0 (campo opcional ou que aceita zero)

Usado quando zero é um valor válido: desconto, porcentagem adicional, campo opcional, etc.

```tsx
const [value, setValue] = useState("0");

function handleBlur() {
  const n = Math.min(MAX, Math.max(0, Number(value) || 0));
  setValue(String(n));
}
```

### Decimais (ex: porcentagem, moeda)

Aceitar ponto/vírgula durante a digitação, normalizar no blur.

```tsx
const [value, setValue] = useState("0");

function handleChange(raw: string) {
  // Aceita vazio, dígitos, ponto e vírgula
  if (/^[\d.,]*$/.test(raw)) setValue(raw);
}

function handleBlur() {
  const normalized = value.replace(",", ".");
  const n = Math.min(MAX, Math.max(0, parseFloat(normalized) || 0));
  setValue(n.toFixed(2)); // ou sem casas decimais dependendo do caso
}
```

### Sem limite máximo

Quando só há mínimo (ex: 1) mas sem teto definido:

```tsx
function handleBlur() {
  const n = Math.max(1, Number(value) || 1);
  setValue(String(n));
}
```

### Com valor inicial vindo de props/estado externo

Quando o valor inicial pode mudar (ex: editando um item existente), sincronizar via `useEffect`:

```tsx
const [raw, setRaw] = useState(String(initialValue));

useEffect(() => {
  setRaw(String(initialValue));
}, [initialValue]);
```

---

## Checklist de implementação

- [ ] Estado é `string`, não `number`
- [ ] `onChange` usa regex para filtrar caracteres inválidos (`/^\d+$/` para inteiros, `/^[\d.,]*$/` para decimais)
- [ ] `onBlur` aplica `Math.min` / `Math.max` com o fallback correto e chama `setState(String(n))`
- [ ] A ação que consome o valor (submit, geração, cálculo) também aplica o clamp como fallback de segurança
- [ ] `type="text" inputMode="numeric"` no lugar de `type="number"`
- [ ] Valor inicial do estado é string: `useState("1")` e não `useState(1)`
