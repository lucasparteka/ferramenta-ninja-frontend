export function formatCNPJ(cnpj: string): string {
	const d = cnpj.replace(/\D/g, "").slice(0, 14);
	if (d.length !== 14) return cnpj;
	return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12, 14)}`;
}
