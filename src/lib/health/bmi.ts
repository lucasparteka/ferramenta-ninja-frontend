export type BmiClassification =
	| "underweight"
	| "normal"
	| "overweight"
	| "obesity1"
	| "obesity2"
	| "obesity3";

export type BmiResult = {
	value: number;
	classification: BmiClassification;
	label: string;
	healthyRange: { min: number; max: number };
};

const CLASSIFICATION_LABELS: Record<BmiClassification, string> = {
	underweight: "Abaixo do peso",
	normal: "Peso normal",
	overweight: "Sobrepeso",
	obesity1: "Obesidade grau I",
	obesity2: "Obesidade grau II",
	obesity3: "Obesidade grau III",
};

export function classifyBmi(bmi: number): BmiClassification {
	if (bmi < 18.5) return "underweight";
	if (bmi < 25) return "normal";
	if (bmi < 30) return "overweight";
	if (bmi < 35) return "obesity1";
	if (bmi < 40) return "obesity2";
	return "obesity3";
}

export function calculateBmi(input: {
	weightKg: number;
	heightCm: number;
}): BmiResult {
	const { weightKg, heightCm } = input;
	if (heightCm <= 0 || weightKg <= 0) {
		throw new Error("Peso e altura devem ser maiores que zero");
	}
	const heightM = heightCm / 100;
	const value = weightKg / (heightM * heightM);
	const classification = classifyBmi(value);
	return {
		value,
		classification,
		label: CLASSIFICATION_LABELS[classification],
		healthyRange: {
			min: 18.5 * heightM * heightM,
			max: 24.99 * heightM * heightM,
		},
	};
}
