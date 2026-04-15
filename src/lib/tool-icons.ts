import {
	Barcode,
	Binary,
	Braces,
	Brush,
	Calculator,
	Database,
	Diff,
	File,
	FileSearch,
	FileStack,
	FileText,
	Hash,
	LayoutList,
	LineDotRightHorizontal,
	Merge,
	Minimize2,
	MoonStar,
	Percent,
	Pi,
	QrCode,
	ScanLine,
	ScanText,
	Shield,
	Shuffle,
	Smile,
	Star,
	Table,
	TextCursorInput,
	Type,
	Wallet,
} from "lucide-react";

export const toolIcons: Record<string, any> = {
	// TEXTO
	"contador-de-caracteres": TextCursorInput,
	"conversor-de-texto": Type,
	"gerador-de-texto": FileText,
	"limpar-texto": FileSearch,
	"remover-duplicados": Shuffle,
	"formatador-de-texto-whatsapp": Type,
	"comparar-textos": Diff,

	// DEV / DADOS
	"codigo-binario": Binary,
	"codigo-morse": LineDotRightHorizontal,
	"conversor-csv-json": Braces,
	"converter-csv-para-sql": Database,

	// CSV / TABELAS
	"visualizador-de-csv": Table,
	"converter-csv-para-pdf": File,

	// DOCUMENTOS
	"gerador-de-cpf": Hash,
	"gerador-de-cnpj": Hash,
	"gerador-de-cartao-de-credito": Wallet,
	"validador-de-cartao-de-credito": Wallet,
	"previa-resultado-google": LayoutList,

	// CALCULADORAS
	"calculadora-de-porcentagem": Percent,
	"calculadora-adicional-noturno": MoonStar,
	"calculadora-salario-liquido": Calculator,

	// SORTEIOS
	"sorteio-online": Shuffle,
	"gerador-de-numeros": Shuffle,

	// SEGURANÇA
	"gerador-de-senha": Shield,
	"criptografia-de-texto": Shield,
	"gerador-de-uuid": Hash,

	// IMAGENS / QR
	"desenhar-online": Brush,
	"cartao-fidelidade": Star,
	"gerador-de-qr-code": QrCode,
	"gerador-de-qr-code-wifi": QrCode,
	"gerador-de-qr-code-pix": QrCode,
	"leitor-de-qr-code": ScanLine,
	"converter-imagem-em-texto": ScanText,
	"gerador-de-codigo-de-barras": Barcode,
	"gerador-de-codigo-de-barras-em-lote": Barcode,

	// DOCUMENTOS / PDF
	"criador-de-curriculo": FileText,
	"juntar-pdf": Merge,
	"dividir-pdf": FileStack,
	"comprimir-pdf": Minimize2,

	// COLEÇÕES
	emojis: Smile,
	emoticons: Smile,
	simbolos: Pi,
};
