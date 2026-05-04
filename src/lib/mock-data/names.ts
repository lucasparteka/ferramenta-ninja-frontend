export const FIRST_NAMES = [
	"João", "Maria", "José", "Ana", "Carlos", "Juliana", "Pedro", "Marina",
	"Lucas", "Fernanda", "Paulo", "Camila", "Rafael", "Larissa", "Marcos",
	"Bruna", "Felipe", "Amanda", "Leonardo", "Natália", "Gabriel", "Letícia",
	"Diego", "Vanessa", "Thiago", "Tatiane", "Rodrigo", "Gabriela", "Eduardo",
	"Priscila", "Bruno", "Débora", "Renato", "Carolina", "Alexandre", "Patrícia",
	"Ricardo", "Renata", "André", "Jaqueline", "Gustavo", "Aline", "Fábio",
	"Raquel", "Vinícius", "Bianca", "Anderson", "Luciana", "Matheus", "Simone",
];

export const LAST_NAMES = [
	"Silva", "Santos", "Oliveira", "Souza", "Pereira", "Costa", "Ferreira",
	"Rodrigues", "Almeida", "Nascimento", "Lima", "Araújo", "Ribeiro",
	"Carvalho", "Gomes", "Martins", "Barbosa", "Rocha", "Dias", "Moreira",
	"Cardoso", "Teixeira", "Cavalcanti", "Melo", "Monteiro", "Barros",
	"Mendes", "Freitas", "Vieira", "Nunes", "Machado", "Fernandes",
];

export const CITIES = [
	{ name: "São Paulo", state: "SP" },
	{ name: "Rio de Janeiro", state: "RJ" },
	{ name: "Belo Horizonte", state: "MG" },
	{ name: "Brasília", state: "DF" },
	{ name: "Curitiba", state: "PR" },
	{ name: "Salvador", state: "BA" },
	{ name: "Fortaleza", state: "CE" },
	{ name: "Manaus", state: "AM" },
	{ name: "Porto Alegre", state: "RS" },
	{ name: "Recife", state: "PE" },
	{ name: "Campinas", state: "SP" },
	{ name: "Vitória", state: "ES" },
	{ name: "Florianópolis", state: "SC" },
	{ name: "Goiânia", state: "GO" },
	{ name: "Natal", state: "RN" },
];

export const STREET_PREFIXES = [
	"Rua", "Avenida", "Travessa", "Praça", "Alameda", "Rodovia",
];

export const STREET_NAMES = [
	"das Flores", "Paulista", "Atlântica", "Brasil", "Independência",
	"Central", "São João", "da Paz", "Getúlio Vargas", "Tiradentes",
	"Sete de Setembro", "XV de Novembro", "Pacaembu", "da Consolação",
	"Doutor Arnaldo", "Rebouças", "Faria Lima", "Brigadeiro Faria Lima",
	"Presidente Vargas", "Rio Branco",
];

export const PRODUCT_CATEGORIES = [
	"Eletrônicos", "Roupas", "Calçados", "Alimentos", "Bebidas",
	"Móveis", "Ferramentas", "Brinquedos", "Livros", "Esportes",
	"Beleza", "Automotivo", "Jardim", "Pet Shop", "Papelaria",
];

export const PRODUCT_ADJECTIVES = [
	"Premium", "Básico", "Profissional", "Confort", "Sport", "Plus",
	"Max", "Ultra", "Lite", "Pro", "Smart", "Classic", "Deluxe",
	"Eco", "Master", "Super", "Mega", "Turbo",
];

export const PRODUCT_TYPES: Record<string, string[]> = {
	"Eletrônicos": ["Fone de Ouvido", "Carregador", "Mouse", "Teclado", "Webcam"],
	"Roupas": ["Camiseta", "Calça", "Jaqueta", "Vestido", "Short"],
	"Calçados": ["Tênis", "Sapato", "Sandália", "Bota", "Chinelo"],
	"Alimentos": ["Arroz", "Feijão", "Macarrão", "Azeite", "Café"],
	"Bebidas": ["Suco", "Refrigerante", "Água", "Cerveja", "Vinho"],
	"Móveis": ["Mesa", "Cadeira", "Sofá", "Estante", "Armário"],
	"Ferramentas": ["Martelo", "Chave de Fenda", "Alicate", "Furadeira", "Serra"],
	"Brinquedos": ["Carrinho", "Boneca", "Quebra-Cabeça", "Jogo de Tabuleiro", "Bola"],
	"Livros": ["Romance", "Técnico", "Didático", "Infantil", "Biografia"],
	"Esportes": ["Bola", "Camisa", "Tênis", "Garrafa", "Mochila"],
	"Beleza": ["Shampoo", "Condicionador", "Perfume", "Base", "Protetor Solar"],
	"Automotivo": ["Óleo", "Filtro", "Pneu", "Pastilha de Freio", "Bateria"],
	"Jardim": ["Vaso", "Semente", "Adubo", "Mangueira", "Pá"],
	"Pet Shop": ["Ração", "Coleira", "Brinquedo", "Cama", "Shampoo Pet"],
	"Papelaria": ["Caneta", "Lápis", "Caderno", "Borracha", "Marca-texto"],
};

export const ROLES = ["admin", "user", "editor", "moderator", "viewer"];

export const EMAIL_DOMAINS = [
	"gmail.com", "hotmail.com", "outlook.com", "yahoo.com.br",
	"uol.com.br", "bol.com.br", "ig.com.br", "proton.me",
];

export const STATUS_MESSAGES = {
	success: [
		"Operação realizada com sucesso",
		"Dados processados com sucesso",
		"Requisição completada",
		"Recurso criado com sucesso",
		"Operação concluída",
	],
	error: [
		"Erro interno do servidor",
		"Recurso não encontrado",
		"Requisição inválida",
		"Não autorizado",
		"Conflito ao processar requisição",
		"Limite de requisições excedido",
		"Dados inválidos",
	],
};
