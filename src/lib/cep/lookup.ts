export type CepAddress = {
	cep: string;
	street: string;
	complement: string;
	neighborhood: string;
	city: string;
	state: string;
	stateName?: string;
	region?: string;
	ibge?: string;
	gia?: string;
	ddd?: string;
	siafi?: string;
};

export type CepLookupResult =
	| { status: "ok"; data: CepAddress }
	| { status: "invalid"; message: string }
	| { status: "not-found"; message: string }
	| { status: "network-error"; message: string };

type ViaCepResponse = {
	cep?: string;
	logradouro?: string;
	complemento?: string;
	bairro?: string;
	localidade?: string;
	uf?: string;
	estado?: string;
	regiao?: string;
	ibge?: string;
	gia?: string;
	ddd?: string;
	siafi?: string;
	erro?: boolean;
};

export function sanitizeCep(raw: string): string {
	return raw.replace(/\D/g, "");
}

export function formatCep(raw: string): string {
	const digits = sanitizeCep(raw).slice(0, 8);
	if (digits.length <= 5) return digits;
	return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export async function lookupCep(raw: string): Promise<CepLookupResult> {
	const cep = sanitizeCep(raw);
	if (cep.length !== 8) {
		return {
			status: "invalid",
			message: "CEP deve conter 8 dígitos",
		};
	}
	try {
		const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
		if (!response.ok) {
			return {
				status: "network-error",
				message: "Não foi possível consultar o CEP agora",
			};
		}
		const payload = (await response.json()) as ViaCepResponse;
		if (payload.erro) {
			return {
				status: "not-found",
				message: "CEP não encontrado",
			};
		}
		return {
			status: "ok",
			data: {
				cep: payload.cep ?? formatCep(cep),
				street: payload.logradouro ?? "",
				complement: payload.complemento ?? "",
				neighborhood: payload.bairro ?? "",
				city: payload.localidade ?? "",
				state: payload.uf ?? "",
				stateName: payload.estado,
				region: payload.regiao,
				ibge: payload.ibge,
				gia: payload.gia,
				ddd: payload.ddd,
				siafi: payload.siafi,
			},
		};
	} catch {
		return {
			status: "network-error",
			message: "Falha de conexão ao consultar o CEP",
		};
	}
}
