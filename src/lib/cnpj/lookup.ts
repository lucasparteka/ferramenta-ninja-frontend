import { formatCNPJ } from "./format";
import { validateCNPJ } from "./validate";

export type CnpjPartner = {
	name: string;
	role?: string;
};

export type CnpjCompany = {
	cnpj: string;
	corporateName: string;
	tradeName?: string;
	status?: string;
	statusReason?: string;
	openingDate?: string;
	mainActivity?: string;
	legalNature?: string;
	size?: string;
	shareCapital?: number;
	address: {
		street?: string;
		number?: string;
		complement?: string;
		neighborhood?: string;
		city?: string;
		state?: string;
		zip?: string;
	};
	phone?: string;
	email?: string;
	partners: CnpjPartner[];
	simples?: {
		optant: boolean;
		optionDate?: string;
		exclusionDate?: string;
	};
	mei?: {
		optant: boolean;
		optionDate?: string;
		exclusionDate?: string;
	};
};

export type CnpjLookupResult =
	| { status: "ok"; data: CnpjCompany }
	| { status: "invalid"; message: string }
	| { status: "not-found"; message: string }
	| { status: "rate-limited"; message: string }
	| { status: "network-error"; message: string };

type BrasilApiResponse = {
	cnpj?: string;
	razao_social?: string;
	nome_fantasia?: string;
	situacao_cadastral?: number;
	descricao_situacao_cadastral?: string;
	motivo_situacao_cadastral?: string;
	data_inicio_atividade?: string;
	cnae_fiscal_descricao?: string;
	natureza_juridica?: string;
	porte?: string;
	capital_social?: number;
	logradouro?: string;
	numero?: string;
	complemento?: string;
	bairro?: string;
	municipio?: string;
	uf?: string;
	cep?: string;
	ddd_telefone_1?: string;
	email?: string;
	qsa?: { nome_socio?: string; qualificacao_socio?: string }[];
	opcao_pelo_simples?: boolean;
	data_opcao_pelo_simples?: string | null;
	data_exclusao_do_simples?: string | null;
	opcao_pelo_mei?: boolean;
	data_opcao_pelo_mei?: string | null;
	data_exclusao_do_mei?: string | null;
};

export function sanitizeCnpj(raw: string): string {
	return raw.replace(/\D/g, "").slice(0, 14);
}

export async function lookupCnpj(raw: string): Promise<CnpjLookupResult> {
	const cnpj = sanitizeCnpj(raw);
	if (cnpj.length !== 14) {
		return { status: "invalid", message: "CNPJ deve conter 14 dígitos" };
	}
	if (!validateCNPJ(cnpj)) {
		return {
			status: "invalid",
			message: "CNPJ inválido (dígitos verificadores não conferem)",
		};
	}
	try {
		const response = await fetch(
			`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`,
		);
		if (response.status === 404) {
			return {
				status: "not-found",
				message: "CNPJ não encontrado na Receita Federal",
			};
		}
		if (response.status === 429) {
			return {
				status: "rate-limited",
				message: "Muitas consultas em pouco tempo. Aguarde alguns segundos.",
			};
		}
		if (!response.ok) {
			return {
				status: "network-error",
				message: "Não foi possível consultar o CNPJ agora",
			};
		}
		const payload = (await response.json()) as BrasilApiResponse;
		return { status: "ok", data: mapResponse(cnpj, payload) };
	} catch {
		return {
			status: "network-error",
			message: "Falha de conexão ao consultar o CNPJ",
		};
	}
}

function mapResponse(cnpj: string, p: BrasilApiResponse): CnpjCompany {
	return {
		cnpj: formatCNPJ(cnpj),
		corporateName: p.razao_social ?? "",
		tradeName: p.nome_fantasia || undefined,
		status: p.descricao_situacao_cadastral,
		statusReason: p.motivo_situacao_cadastral,
		openingDate: p.data_inicio_atividade,
		mainActivity: p.cnae_fiscal_descricao,
		legalNature: p.natureza_juridica,
		size: p.porte,
		shareCapital: p.capital_social,
		address: {
			street: p.logradouro,
			number: p.numero,
			complement: p.complemento,
			neighborhood: p.bairro,
			city: p.municipio,
			state: p.uf,
			zip: p.cep,
		},
		phone: p.ddd_telefone_1,
		email: p.email,
		partners: (p.qsa ?? []).map((s) => ({
			name: s.nome_socio ?? "",
			role: s.qualificacao_socio,
		})),
		simples: {
			optant: p.opcao_pelo_simples === true,
			optionDate: p.data_opcao_pelo_simples ?? undefined,
			exclusionDate: p.data_exclusao_do_simples ?? undefined,
		},
		mei: {
			optant: p.opcao_pelo_mei === true,
			optionDate: p.data_opcao_pelo_mei ?? undefined,
			exclusionDate: p.data_exclusao_do_mei ?? undefined,
		},
	};
}

export function formatCnpjMask(raw: string): string {
	const d = sanitizeCnpj(raw);
	if (d.length <= 2) return d;
	if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
	if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
	if (d.length <= 12)
		return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
	return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}
