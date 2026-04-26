// Juros compostos com aportes mensais.
// Fórmula: M = P*(1+i)^n + PMT*[((1+i)^n - 1)/i]
// Aportes considerados no início do período (annuity-due) quando contributionTiming = "begin".

export type CompoundInterestInput = {
	principal: number;
	monthlyContribution: number;
	annualRate: number;
	months: number;
	contributionTiming?: "begin" | "end";
};

export type CompoundInterestEntry = {
	month: number;
	contributed: number;
	interest: number;
	balance: number;
};

export type CompoundInterestResult = {
	finalBalance: number;
	totalInvested: number;
	totalInterest: number;
	monthlyRate: number;
	schedule: CompoundInterestEntry[];
};

export function annualToMonthlyRate(annualRate: number): number {
	return (1 + annualRate) ** (1 / 12) - 1;
}

export function calculateCompoundInterest(
	input: CompoundInterestInput,
): CompoundInterestResult {
	const i = annualToMonthlyRate(input.annualRate);
	const timing = input.contributionTiming ?? "end";

	let balance = input.principal;
	let totalInvested = input.principal;
	let totalInterest = 0;
	const schedule: CompoundInterestEntry[] = [];

	for (let m = 1; m <= input.months; m++) {
		if (timing === "begin") {
			balance += input.monthlyContribution;
			totalInvested += input.monthlyContribution;
		}
		const interest = balance * i;
		balance += interest;
		totalInterest += interest;
		if (timing === "end") {
			balance += input.monthlyContribution;
			totalInvested += input.monthlyContribution;
		}
		schedule.push({
			month: m,
			contributed: input.monthlyContribution,
			interest: round2(interest),
			balance: round2(balance),
		});
	}

	return {
		finalBalance: round2(balance),
		totalInvested: round2(totalInvested),
		totalInterest: round2(totalInterest),
		monthlyRate: i,
		schedule,
	};
}

function round2(value: number): number {
	return Math.round(value * 100) / 100;
}
