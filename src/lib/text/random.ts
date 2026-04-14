const RANDOM_WORDS = [
	"tempo",
	"vida",
	"mundo",
	"pessoa",
	"trabalho",
	"projeto",
	"sistema",
	"empresa",
	"produto",
	"serviço",
	"dados",
	"resultado",
	"processo",
	"grupo",
	"área",
	"cidade",
	"mercado",
	"cliente",
	"equipe",
	"solução",
	"modelo",
	"forma",
	"estilo",
	"ponto",
	"valor",
	"nível",
	"base",
	"parte",
	"lado",
	"lugar",
	"modo",
	"tipo",
	"caso",
	"novo",
	"grande",
	"pequeno",
	"bom",
	"rápido",
	"simples",
	"completo",
	"real",
	"digital",
	"moderno",
	"eficiente",
	"especial",
	"principal",
	"geral",
	"local",
	"criar",
	"usar",
	"fazer",
	"ver",
	"ter",
	"poder",
	"dizer",
	"dar",
	"ajudar",
	"encontrar",
	"trazer",
	"mostrar",
	"permitir",
	"garantir",
	"gerar",
	"definir",
	"bem",
	"sempre",
	"ainda",
	"mais",
	"muito",
	"agora",
	"depois",
	"antes",
	"aqui",
	"assim",
	"cada",
	"todo",
	"outro",
	"mesmo",
	"tanto",
	"menos",
	"sobre",
	"entre",
	"nome",
	"ano",
	"dia",
	"mês",
	"hora",
	"minuto",
	"semana",
	"meta",
	"plano",
	"ideia",
	"texto",
	"imagem",
	"página",
	"tela",
	"botão",
	"campo",
	"lista",
	"item",
	"bloco",
	"fácil",
	"claro",
	"forte",
	"aberto",
	"final",
	"único",
	"total",
	"certo",
	"livre",
];

function randomWord(): string {
	return RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)];
}

function buildSentence(wordCount: number): string {
	const words = Array.from({ length: wordCount }, randomWord);
	const text = words.join(" ");
	return text.charAt(0).toUpperCase() + text.slice(1) + ".";
}

export function generateRandomWords(count: number): string {
	return Array.from({ length: count }, randomWord).join(" ");
}

export function generateRandomSentences(count: number): string {
	return Array.from({ length: count }, () => {
		return buildSentence(Math.floor(Math.random() * 8) + 5);
	}).join(" ");
}

export function generateRandomParagraphs(count: number): string {
	return Array.from({ length: count }, () => {
		const sentenceCount = Math.floor(Math.random() * 3) + 3;
		return Array.from({ length: sentenceCount }, () => {
			return buildSentence(Math.floor(Math.random() * 8) + 5);
		}).join(" ");
	}).join("\n\n");
}
