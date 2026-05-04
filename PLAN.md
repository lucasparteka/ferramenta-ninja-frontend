# Plano: Remover `size="sm"` de botões de ação

**Critério:**
- **REMOVER**: botões de ação (download, cópia, upload, adicionar/remover item, limpar, randomizar, exportar)
- **MANTER**: botões de opção da ferramenta (toggles, navegação/paginação, toolbar de formatação)
- **MANTER**: `AlertDialogContent size="sm"` (prop do dialog, não do Button)

---

## Arquivos a modificar (46 remoções em 26 arquivos)

| # | Arquivo | Linha | Contexto |
|---|---------|-------|----------|
| 1 | `src/components/shared/image-uploader.tsx` | 165 | Upload de arquivo |  
| 2 | `src/components/tools/batch-barcode/batch-barcode.tsx` | 81 | Baixar SVG |  
| 3 | `src/components/tools/binary-converter/binary-converter.tsx` | 115 | CopyButton | 
| 4 | `src/components/tools/checklist/checklist-editor.tsx` | 640 | addItem |  
| 5 | `src/components/tools/checklist/checklist-editor.tsx` | 650 | addGroup |  
| 6 | `src/components/tools/cnpj-generator/cnpj-list.tsx` | 17 | CopyButton "Copiar tudo" |  
| 7 | `src/components/tools/cnpj-generator/cnpj-list.tsx` | 26 | CopyButton por item |  
| 8 | `src/components/tools/cpf-generator/cpf-list.tsx` | 17 | CopyButton "Copiar tudo" |  
| 9 | `src/components/tools/cpf-generator/cpf-list.tsx` | 26 | CopyButton por item |  
| 10 | `src/components/tools/csv-to-sql/csv-to-sql.tsx` | 548 | CopyButton "Copiar SQL" |  
| 11 | `src/components/tools/csv-to-sql/csv-to-sql.tsx` | 551 | Download SQL |  
| 12 | `src/components/tools/curriculo/resume-pdf-button/index.tsx` | 147 | Upload de arquivo |  
| 13 | `src/components/tools/curriculo/resume-pdf-button/index.tsx` | 154 | Baixar assim mesmo |  
| 14 | `src/components/tools/custom-qr-code/custom-qr-code.tsx` | 789 | Download PNG |  
| 15 | `src/components/tools/custom-qr-code/custom-qr-code.tsx` | 797 | Download JPEG |  
| 16 | `src/components/tools/custom-qr-code/custom-qr-code.tsx` | 805 | Download SVG |  
| 17 | `src/components/tools/gradient-generator/gradient-generator.tsx` | 167 | Adicionar cor |  
| 18 | `src/components/tools/gradient-generator/gradient-generator.tsx` | 171 | Randomizar |  
| 19 | `src/components/tools/gradient-generator/gradient-generator.tsx` | 194 | CopyButton |  
| 20 | `src/components/tools/image-to-text/ocr-output.tsx` | 34 | CopyButton "Copiar texto" |
| 21 | `src/components/tools/inventario/inventario-editor.tsx` | 284 | addHeaderField |
| 22 | `src/components/tools/inventario/inventario-editor.tsx` | 352 | addColumn |
| 23 | `src/components/tools/loyalty-card/export-panel.tsx` | 64 | Exportar PDF (frente) |
| 24 | `src/components/tools/loyalty-card/export-panel.tsx` | 68 | Exportar PNG (frente) |
| 25 | `src/components/tools/loyalty-card/export-panel.tsx` | 78 | Exportar PDF (verso) |
| 26 | `src/components/tools/loyalty-card/export-panel.tsx` | 82 | Exportar PNG (verso) |
| 27 | `src/components/tools/loyalty-card/loyalty-card-editor.tsx` | 683 | Remover logo |
| 28 | `src/components/tools/loyalty-card/loyalty-card-editor.tsx` | 694 | Upload de logo |
| 29 | `src/components/tools/markdown-to-html/markdown-to-html.tsx` | 119 | Limpar markdown |
| 30 | `src/components/tools/markdown-to-html/markdown-to-html.tsx` | 154 | CopyButton "Copiar HTML" |
| 31 | `src/components/tools/markdown-to-html/markdown-to-html.tsx` | 155 | Baixar HTML |
| 32 | `src/components/tools/menu/menu-controls.tsx` | 106 | Remover seção |
| 33 | `src/components/tools/menu/menu-controls.tsx` | 164 | Adicionar item |
| 34 | `src/components/tools/menu/menu-controls.tsx` | 175 | Adicionar seção |
| 35 | `src/components/tools/menu/menu-editor.tsx` | 462 | Deletar seção |
| 36 | `src/components/tools/morse-converter/morse-converter.tsx` | 107 | CopyButton |
| 37 | `src/components/tools/number-generator/number-generator.tsx` | 192 | CopyButton "Copiar" |
| 38 | `src/components/tools/ordem-servico/ordem-servico-editor.tsx` | 545 | addItem |
| 39 | `src/components/tools/qr-reader/qr-reader.tsx` | 139 | CopyButton |
| 40 | `src/components/tools/remove-duplicates/output.tsx` | 20 | CopyButton |
| 41 | `src/components/tools/text-cipher/text-cipher.tsx` | 164 | CopyButton |
| 42 | `src/components/tools/text-cleaner/text-cleaner-input.tsx` | 67 | Upload de arquivo |
| 43 | `src/components/tools/text-converter/text-output.tsx` | 22 | CopyButton |
| 44 | `src/components/tools/text-diff/diff-inputs.tsx` | 44 | Upload de arquivo |
| 45 | `src/components/tools/text-generator/generator-output.tsx` | 20 | CopyButton |
| 46 | `src/components/tools/uuid-generator/uuid-generator.tsx` | 191 | CopyButton "Copiar todos" |

---

## Arquivos que NÃO mudam (22 mantidos)

| # | Arquivo | Linha | Motivo |
|---|---------|-------|--------|
| 1 | `base64.tsx` | 66 | Toggle encode/decode |
| 2 | `css-minifier.tsx` | 71 | Toggle minify/beautify |
| 3 | `csv-to-pdf.tsx` | 143,163,174 | Paginação |
| 4 | `csv-viewer.tsx` | 150,170,181 | Paginação |
| 5 | `custom-qr-code.tsx` | 755 | Remover logo (limpa setting da ferramenta) |
| 6 | `json-formatter.tsx` | 191,198 | Toggle indent 2/4 |
| 7 | `keep-awake.tsx` | 249,256,274,282 | Toggle modo/preset |
| 8 | `text-converter/text-actions.tsx` | 29 | Transformações de texto (toolbar) |
| 9 | `whatsapp-formatter/formatting-toolbar.tsx` | 16,26,36,46 | Toolbar de formatação |
| 10 | `checklist-editor.tsx` | 667 | AlertDialogContent (não é Button) |
| 11 | `menu-editor.tsx` | 470 | AlertDialogContent (não é Button) |
