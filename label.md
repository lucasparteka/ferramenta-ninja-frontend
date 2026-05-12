# Label - Análise de Uso

## Visão Geral

Este documento detalha os locais no projeto que usam `<label>` (HTML nativo) ao invés do componente `<Label>` do projeto localizado em `src/components/ui label.tsx`.

## Componente do Projeto

O componente `Label` está disponível em `src/components/ui/label.tsx` e possui as seguintes características:
- Estilização automática com tokens de design
- Suporte a `className` personalizado
- Acessibilidade integrada
- Estilos: `flex items-center gap-2 text-sm leading-none font-medium select-none`

## Locais que Precisam Ser Refatorados

### 1. character-counter/character-counter.tsx
- **Linha 91**: `<label htmlFor="text-input" className="sr-only">`
- Problema: Usa `<label>` nativo ao invés de `<Label>`

### 2. random-picker/random-picker.tsx
- **Linha 167**: `<label htmlFor="picker-input" className="sr-only">`
- Problema: Usa `<label>` nativo ao invés de `<Label>`

### 3. curriculo/resume-builder/education-section.tsx
- **Linha 127**: `<label htmlFor="institution-input" className="text-sm font-medium">`
- **Linha 166**: `<label htmlFor="course-area-input" className="text-sm font-medium">`
- **Linha 252**: `<label htmlFor="education-description" className="text-sm font-medium">`
- Problema: Usa `<label>` nativo com classes manuais ao invés de `<Label>`

### 4. curriculo/resume-builder/experience-section.tsx
- **Linha 203**: `<label htmlFor="experience-role" className="text-sm font-medium">`
- **Linha 218**: `<label htmlFor="experience-company" className="text-sm font-medium">`
- **Linha 235**: `<label htmlFor="experience-location" className="text-sm font-medium">`
- **Linha 302**: `<label htmlFor="experience-description" className="text-sm font-medium">`
- Problema: Usa `<label>` nativo com classes manuais ao invés de `<Label>`

### 5. pdf/compress/compress-pdf.tsx
- **Linha 113**: `<label className="block text-sm font-medium text-foreground">`
- Problema: Usa `<label>` nativo com classes manuais ao invés de `<Label>`

### 6. pdf/split/split-pdf.tsx
- **Linha 150**: `<label className="block text-sm font-medium text-foreground">`
- **Linha 213**: `<label className="flex cursor-pointer items-center gap-3">`
- **Linha 231**: `<label className="flex cursor-pointer items-center gap-3">`
- Problema: Usa `<label>` nativo com classes manuais ao invés de `<Label>`

### 7. pdf/merge/merge-pdf.tsx
- **Linha 143**: `<label className="block text-sm font-medium text-foreground">`
- Problema: Usa `<label>` nativo com classes manuais ao invés de `<Label>`

### 8. work-hours/work-hours-calculator.tsx
- **Linha 67**: `<label className="flex items-center gap-2 text-sm">`
- Problema: Usa `<label>` nativo com classes manuais ao invés de `<Label>`

### 9. whatsapp-link/whatsapp-link-generator.tsx
- **Linha 79**: `<label htmlFor="${uid}-phone" className="block text-[10px] uppercase tracking-wider text-muted-foreground">`
- **Linha 99**: `<label htmlFor="${uid}-message" className="block text-[10px] uppercase tracking-wider text-muted-foreground">`
- Problema: Usa `<label>` nativo com classes customizadas ao invés de `<Label>`

### 10. number-generator/number-generator.tsx
- **Linha 90**: `<label className="flex w-full text-sm font-medium text-foreground">`
- **Linha 159**: `<label htmlFor="unique" className="text-sm text-foreground cursor-pointer">`
- Problema: Usa `<label>` nativo com classes manuais ao invés de `<Label>`

### 11. gradient-generator/gradient-generator.tsx
- **Linha 65**: `<label...`
- **Linha 84**: `<label...`
- **Linha 185**: `<label className="block text-sm font-medium text-foreground">`
- Problema: Usa `<label>` nativo com classes manuais ao invés de `<Label>`

### 12. batch-barcode/batch-barcode.tsx
- **Linha 112**: `<label...`
- **Linha 141**: `<label htmlFor="display-value" className="cursor-pointer text-sm text-foreground">`
- **Linha 148**: `<label...`
- Problema: Usa `<label>` nativo com classes manuais ao invés de `<Label>`

### 13. wifi-qr/wifi-qr.tsx
- **Linha 146**: `<label htmlFor="wifi-hidden" className="text-sm text-foreground cursor-pointer">`
- Problema: Usa `<label>` nativo com classes manuais ao invés de `<Label>`

### 14. favicon-generator/shared-controls.tsx
- **Linha 367**: `<label htmlFor={id} className="text-sm font-medium text-foreground">`
- **Linha 475**: `<label htmlFor={id} className="text-sm font-medium text-foreground">`
- Problema: Usa `<label>` nativo com classes manuais ao invés de `<Label>`

### 15. shared/image-uploader.tsx
- **Linha 202**: `<label htmlFor="zoom-slider" className="block text-sm mb-2">`
- Problema: Usa `<label>` nativo com classes manuais ao invés de `<Label>`

### 16. menu/menu-editor.tsx
- **Linha 435**: `<label htmlFor="show-prices" className="cursor-pointer text-sm">`
- Problema: Usa `<label>` nativo com classes manuais ao invés de `<Label>`

### 17. random-picker/options.tsx
- **Linha 61**: `<label htmlFor="allow-repeat" className="cursor-pointer text-sm text-foreground">`
- **Linha 74**: `<label htmlFor="remove-empty" className="cursor-pointer text-sm text-foreground">`
- Problema: Usa `<label>` nativo com classes manuais ao invés de `<Label>`

### 18. text-generator/generator-controls.tsx
- **Linha 102**: `<label htmlFor="start-with-lorem" className="cursor-pointer text-sm text-foreground">`
- Problema: Usa `<label>` nativo com classes manuais ao invés de `<Label>`

### 19. barcode-generator/barcode-generator.tsx
- **Linha 158**: `<label htmlFor="display-value" className="cursor-pointer text-sm text-foreground">`
- Problema: Usa `<label>` nativo com classes manuais ao invés de `<Label>`

##总计

- **19 arquivos** precisam de refatoração
- **34 instâncias** de `<label>` nativo identificadas

## Padrão de Refatoração

Para refatorar, substitua:
```tsx
// Antes (incorreto)
<label className="text-sm font-medium text-foreground">

// Depois (correto)
<Label>
```

### Regras de Uso

1. **Não passe classes de cor de texto** - O componente `<Label>` usa a cor padrão do tema (`text-foreground`). Use `<Label>` sem nenhuma classe de cor.

2. **Não passe classes de tamanho ou peso** - O componente já vem com `text-sm font-medium` por padrão. Não precisa repetir.

3. **Use `<Label>` puro na maioria dos casos** - Simply use `<Label>Label texto</Label>` sem nenhuma classe adicional.

4. **Apenas use classes customizadas em casos muito específicos** - Só adicione classes customizadas se houver necessidade de espaçamento extra ou layout específico que não seja coberto pelo padrão. Exemplos de quando usar:
   - Espaçamento específico (`gap-4`, `mb-2`)
   - Alinhamento específico (`text-center`)
   - Casos excepcionais onde o padrão não serve

5. **Regra geral**: Se você está pensando em adicionar `className` ao `<Label>`, pergunte-se: "Isso é realmente necessário ou o Label padrão já resolve?" Na maioria das vezes, a resposta é que não é necessário.