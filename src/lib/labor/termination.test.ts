import { describe, expect, it } from "vitest";
import { calculateTermination, noticeDaysFor } from "./termination";

describe("noticeDaysFor", () => {
	it("min 30 days", () => {
		expect(noticeDaysFor(0)).toBe(30);
	});
	it("8 years = 30 + 24 = 54", () => {
		expect(noticeDaysFor(8)).toBe(54);
	});
	it("caps at 90", () => {
		expect(noticeDaysFor(20)).toBe(90);
		expect(noticeDaysFor(50)).toBe(90);
	});
});

describe("calculateTermination", () => {
	it("no-cause, 2 years, R$ 3.000", () => {
		const r = calculateTermination({
			monthlySalary: 3000,
			admissionDate: new Date("2024-04-15"),
			terminationDate: new Date("2026-04-30"),
			type: "no-cause",
			noticePolicy: "indemnified",
			fgtsBalance: 5760,
		});
		expect(r.yearsAtCompany).toBe(2);
		expect(r.salaryBalance).toBe(3000);
		expect(r.noticeIndemnified).toBeGreaterThan(0);
		expect(r.fgtsFine).toBe(2304);
		expect(r.unemploymentInsuranceEligible).toBe(true);
	});

	it("agreement = 50% notice + 20% FGTS fine", () => {
		const r = calculateTermination({
			monthlySalary: 4000,
			admissionDate: new Date("2021-04-30"),
			terminationDate: new Date("2026-04-30"),
			type: "agreement",
			noticePolicy: "indemnified",
			fgtsBalance: 20000,
		});
		expect(r.fgtsFine).toBe(4000);
		expect(r.fgtsWithdrawable).toBe(16000);
		expect(r.unemploymentInsuranceEligible).toBe(false);
	});

	it("resignation: no notice indemnified, no FGTS fine", () => {
		const r = calculateTermination({
			monthlySalary: 3000,
			admissionDate: new Date("2025-04-30"),
			terminationDate: new Date("2026-04-30"),
			type: "resignation",
			noticePolicy: "worked",
			fgtsBalance: 2880,
		});
		expect(r.noticeIndemnified).toBe(0);
		expect(r.fgtsFine).toBe(0);
		expect(r.fgtsWithdrawable).toBe(0);
	});

	it("with-cause: no 13th, no proportional vac, no fine", () => {
		const r = calculateTermination({
			monthlySalary: 3000,
			admissionDate: new Date("2024-04-30"),
			terminationDate: new Date("2026-04-30"),
			type: "with-cause",
			noticePolicy: "not-served",
			fgtsBalance: 5760,
		});
		expect(r.thirteenthProportional).toBe(0);
		expect(r.proportionalVacation).toBe(0);
		expect(r.fgtsFine).toBe(0);
		expect(r.fgtsWithdrawable).toBe(0);
	});

	it("notice cap at 90 days for >20 years", () => {
		const r = calculateTermination({
			monthlySalary: 3000,
			admissionDate: new Date("2000-01-15"),
			terminationDate: new Date("2026-04-30"),
			type: "no-cause",
			noticePolicy: "indemnified",
		});
		expect(r.noticeDays).toBe(90);
	});

	it("expired vacation when flagged", () => {
		const r = calculateTermination({
			monthlySalary: 3000,
			admissionDate: new Date("2024-04-30"),
			terminationDate: new Date("2026-04-30"),
			type: "no-cause",
			noticePolicy: "indemnified",
			hasExpiredVacation: true,
		});
		expect(r.expiredVacation).toBe(3000);
		expect(r.expiredVacationOneThird).toBe(1000);
	});

	it("no expired vacation when not flagged", () => {
		const r = calculateTermination({
			monthlySalary: 3000,
			admissionDate: new Date("2024-04-30"),
			terminationDate: new Date("2026-04-30"),
			type: "no-cause",
			noticePolicy: "indemnified",
		});
		expect(r.expiredVacation).toBe(0);
	});

	it("net total = gross - INSS - IRRF", () => {
		const r = calculateTermination({
			monthlySalary: 5000,
			admissionDate: new Date("2024-04-30"),
			terminationDate: new Date("2026-04-30"),
			type: "no-cause",
			noticePolicy: "indemnified",
			fgtsBalance: 9600,
		});
		expect(r.netTotal).toBe(round2(r.grossTotal - r.inss - r.irrf));
	});

	it("13º acima isenção gera IRRF", () => {
		const r = calculateTermination({
			monthlySalary: 8000,
			admissionDate: new Date("2024-04-30"),
			terminationDate: new Date("2026-04-30"),
			type: "no-cause",
			noticePolicy: "indemnified",
		});
		expect(r.irrf).toBeGreaterThan(0);
	});

	it("contract-end: 13º + proporcionais sem multa FGTS", () => {
		const r = calculateTermination({
			monthlySalary: 3000,
			admissionDate: new Date("2025-10-30"),
			terminationDate: new Date("2026-04-30"),
			type: "contract-end",
			noticePolicy: "not-served",
			fgtsBalance: 1440,
		});
		expect(r.thirteenthProportional).toBeGreaterThan(0);
		expect(r.fgtsFine).toBe(0);
	});

	it("FGTS 100% saque sem justa causa", () => {
		const r = calculateTermination({
			monthlySalary: 3000,
			admissionDate: new Date("2025-04-30"),
			terminationDate: new Date("2026-04-30"),
			type: "no-cause",
			noticePolicy: "indemnified",
			fgtsBalance: 2880,
		});
		expect(r.fgtsWithdrawable).toBe(2880);
	});
});

function round2(value: number): number {
	return Math.round(value * 100) / 100;
}
