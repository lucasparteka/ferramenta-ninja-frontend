import { existsSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";

const FERRAMENTAS_DIR = join(process.cwd(), "src/app/ferramentas");
const TOOLS_FILE = join(process.cwd(), "src/lib/data/tools.ts");

function getFilesystemSlugs(): string[] {
	return readdirSync(FERRAMENTAS_DIR, { withFileTypes: true })
		.filter(
			(entry) =>
				entry.isDirectory() &&
				!entry.name.startsWith("(") &&
				!entry.name.startsWith("[") &&
				existsSync(join(FERRAMENTAS_DIR, entry.name, "page.tsx")),
		)
		.map((entry) => entry.name);
}

function getIconName(icon: unknown): string | null {
	if (!icon) return null;
	const fn = icon as { displayName?: string; name?: string };
	return fn.displayName ?? fn.name ?? null;
}

function serializeTool(tool: Record<string, unknown>): string {
	const iconName = getIconName(tool.icon);
	const lines: string[] = [
		`      name: ${JSON.stringify(tool.name)},`,
		`      href: ${JSON.stringify(tool.href)},`,
		`      description: ${JSON.stringify(tool.description)},`,
		`      icon: ${iconName ?? "null"}, ${iconName ? "" : "// TODO: adicione o ícone manualmente"}`,
	];
	if (Array.isArray(tool.tags) && tool.tags.length > 0) {
		lines.push(`      tags: ${JSON.stringify(tool.tags)},`);
	}
	if (tool.intent) {
		lines.push(`      intent: "${tool.intent}",`);
	}
	if (tool.weight !== undefined) {
		lines.push(`      weight: ${tool.weight},`);
	}
	return `    {\n${lines.join("\n")}\n    }`;
}

function generateFileContent(
	categories: Array<{
		id: string;
		name: string;
		description?: string;
		tools: Record<string, unknown>[];
	}>,
): string {
	const iconNames = new Set<string>();
	for (const cat of categories) {
		for (const tool of cat.tools) {
			const name = getIconName(tool.icon);
			if (name) iconNames.add(name);
		}
	}

	const sortedIconNames = [...iconNames].sort();

	const importsBlock =
		sortedIconNames.length > 0
			? `import {\n  ${[...sortedIconNames, "type LucideProps"].join(",\n  ")},\n} from "lucide-react";`
			: `import { type LucideProps } from "lucide-react";`;

	const categoriesStr = categories
		.map((cat) => {
			const toolsStr = cat.tools.map(serializeTool).join(",\n");
			const descLine = cat.description
				? `    description: ${JSON.stringify(cat.description)},\n`
				: "";
			return `  {\n    id: ${JSON.stringify(cat.id)},\n    name: ${JSON.stringify(cat.name)},\n${descLine}    tools: [\n${toolsStr},\n    ],\n  }`;
		})
		.join(",\n");

	return `${importsBlock}
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export type LucideIcon = ForwardRefExoticComponent
  Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
>;

export type Tool = {
  name: string;
  href: string;
  description: string;
  icon: LucideIcon; // não-nullable: o script seta null para forçar erro de TS/build
  tags?: string[];
  intent?: "generate" | "convert" | "analyze" | "format" | "validate";
  weight?: number;
};

export type ToolCategory = {
  id: string;
  name: string;
  description?: string;
  tools: Tool[];
};

export const categories: ToolCategory[] = [
${categoriesStr},
];
`;
}

async function main() {
	const fsSlugs = new Set(getFilesystemSlugs());

	// Importa as categories atuais em runtime (tsx ignora erros de tipo)
	const { categories } = (await import("../src/lib/data/tools")) as {
		categories: Array<{
			id: string;
			name: string;
			description?: string;
			tools: Record<string, unknown>[];
		}>;
	};

	const currentSlugMap = new Map<string, string>(); // slug → category id
	for (const cat of categories) {
		for (const tool of cat.tools) {
			const slug = (tool.href as string).split("/").pop()!;
			currentSlugMap.set(slug, cat.id);
		}
	}

	const currentSlugs = new Set(currentSlugMap.keys());
	const toAdd = [...fsSlugs].filter((s) => !currentSlugs.has(s));
	const toRemove = [...currentSlugs].filter((s) => !fsSlugs.has(s));

	if (toAdd.length === 0 && toRemove.length === 0) {
		console.log("✓ tools.ts já está sincronizado");
		return;
	}

	// Remove ferramentas cujas pastas não existem mais
	let updatedCategories = categories.map((cat) => ({
		...cat,
		tools: cat.tools.filter(
			(t) => !toRemove.includes((t.href as string).split("/").pop()!),
		),
	}));

	// Adiciona novas ferramentas em "sem-categoria"
	if (toAdd.length > 0) {
		const newTools = toAdd.map((slug) => ({
			name: slug,
			href: `/ferramentas/${slug}`,
			description: "",
			icon: null,
		}));

		const semCat = updatedCategories.find((c) => c.id === "sem-categoria");
		if (semCat) {
			semCat.tools.push(...newTools);
		} else {
			updatedCategories.push({
				id: "sem-categoria",
				name: "Sem Categoria",
				tools: newTools,
			});
		}
	}

	// Remove categorias que ficaram vazias (exceto sem-categoria)
	updatedCategories = updatedCategories.filter(
		(cat) => cat.tools.length > 0 || cat.id === "sem-categoria",
	);

	const content = generateFileContent(updatedCategories);
	writeFileSync(TOOLS_FILE, content, "utf-8");

	console.log("✓ tools.ts atualizado");
	if (toAdd.length)
		console.log(
			`  + ${toAdd.length} ferramenta(s) adicionada(s): ${toAdd.join(", ")}`,
		);
	if (toRemove.length)
		console.log(
			`  - ${toRemove.length} ferramenta(s) removida(s): ${toRemove.join(", ")}`,
		);

	if (toAdd.length) {
		console.log(
			"\n⚠️  Ferramentas adicionadas com icon: null — adicione os ícones em tools.ts antes do build.",
		);
		process.exit(1); // Interrompe o build para forçar revisão manual
	}
}

main().catch((err) => {
	console.error("Erro ao sincronizar tools.ts:", err);
	process.exit(1);
});
