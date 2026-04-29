export const SAMPLE_TEXTS = [
	"O sucesso nasce do querer, da determinação e persistência em se chegar a um objetivo. Mesmo não atingindo o alvo, quem busca e vence obstáculos, no mínimo fará coisas admiráveis.",
	"A vida é 10% o que acontece a você e 90% como você reage a isso. Não espere por circunstâncias ideais, elas nunca chegam. Comece onde você está, use o que você tem e faça o que puder.",
	"A única forma de fazer um excelente trabalho é amar o que você faz. Se ainda não encontrou, continue procurando. Não se acomode. Assim como em assuntos do coração, você saberá quando encontrar.",
	"O importante não é vencer todos os dias, mas lutar sempre. Vale mais dar um passo na direção certa do que dar dois na direção errada. A persistência é o caminho do êxito.",
	"Acredite em si próprio e chegará um dia em que os outros não terão outra escolha senão acreditar com você. A confiança é o primeiro passo para conquistar qualquer objetivo na vida.",
];

export function getRandomSampleText(): string {
	return SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
}

export function calculateWPM(
	charCount: number,
	elapsedSeconds: number,
): number {
	if (elapsedSeconds <= 0) return 0;
	const words = charCount / 5;
	return Math.round((words / elapsedSeconds) * 60);
}

export function calculateCPM(
	charCount: number,
	elapsedSeconds: number,
): number {
	if (elapsedSeconds <= 0) return 0;
	return Math.round((charCount / elapsedSeconds) * 60);
}

export function calculateAccuracy(
	correctChars: number,
	totalChars: number,
): number {
	if (totalChars <= 0) return 0;
	return Math.round((correctChars / totalChars) * 100);
}
