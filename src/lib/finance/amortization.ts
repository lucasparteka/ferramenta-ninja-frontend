// Amortização: SAC (Sistema de Amortização Constante) e Price (Tabela Price).
// SAC: amortização fixa, parcela decrescente.
// Price: parcela fixa = P * i / (1 - (1+i)^-n).

export type AmortizationSystem = "sac" | "price";

export type AmortizationInput = {
	principal: number;
	annualRate: number;
	months: number;
	system: AmortizationSystem;
};

export type AmortizationEntry = {
	month: number;
	payment: number;
	interest: number;
	amortization: number;
	balance: number;
};

export type AmortizationResult = {
	system: AmortizationSystem;
	monthlyRate: number;
	totalPaid: number;
	totalInterest: number;
	firstPayment: number;
	lastPayment: number;
	schedule: AmortizationEntry[];
};

export function annualToMonthlyRate(annualRate: number): number {
	return (1 + annualRate) ** (1 / 12) - 1;
}

export function calculateAmortization(
	input: AmortizationInput,
): AmortizationResult {
	const i = annualToMonthlyRate(input.annualRate);
	const schedule =
		input.system === "sac"
			? buildSac(input.principal, i, input.months)
			: buildPrice(input.principal, i, input.months);

	const totalPaid = round2(schedule.reduce((s, e) => s + e.payment, 0));
	const totalInterest = round2(schedule.reduce((s, e) => s + e.interest, 0));

	return {
		system: input.system,
		monthlyRate: i,
		totalPaid,
		totalInterest,
		firstPayment: schedule[0]?.payment ?? 0,
		lastPayment: schedule[schedule.length - 1]?.payment ?? 0,
		schedule,
	};
}

function buildSac(
	principal: number,
	i: number,
	n: number,
): AmortizationEntry[] {
	const amortization = principal / n;
	let balance = principal;
	const out: AmortizationEntry[] = [];
	for (let m = 1; m <= n; m++) {
		const interest = balance * i;
		const payment = amortization + interest;
		balance -= amortization;
		out.push({
			month: m,
			payment: round2(payment),
			interest: round2(interest),
			amortization: round2(amortization),
			balance: round2(Math.max(0, balance)),
		});
	}
	return out;
}

function buildPrice(
	principal: number,
	i: number,
	n: number,
): AmortizationEntry[] {
	const payment = i === 0 ? principal / n : (principal * i) / (1 - (1 + i) ** -n);
	let balance = principal;
	const out: AmortizationEntry[] = [];
	for (let m = 1; m <= n; m++) {
		const interest = balance * i;
		const amort = payment - interest;
		balance -= amort;
		out.push({
			month: m,
			payment: round2(payment),
			interest: round2(interest),
			amortization: round2(amort),
			balance: round2(Math.max(0, balance)),
		});
	}
	return out;
}

function round2(value: number): number {
	return Math.round(value * 100) / 100;
}
