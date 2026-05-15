import type { ComponentType } from "react";
import { post as decimo } from "@/content/blog/13-salario-como-calcular";
import { post as salario } from "@/content/blog/como-calcular-salario-liquido";
import { post as ferias } from "@/content/blog/ferias-clt-guia-completo";
import { post as rescisao } from "@/content/blog/como-calcular-rescisao-trabalhista";
import { post as cdi } from "@/content/blog/o-que-e-cdi-como-calcular-rendimento";

export type BlogPost = {
	slug: string;
	title: string;
	description: string;
	publishedAt: string;
	updatedAt: string;
	author: string;
	category: string;
	relatedTools: string[];
	Component: ComponentType;
};

export const blogPosts: BlogPost[] = [cdi, rescisao, salario, ferias, decimo];

export function findPostBySlug(slug: string): BlogPost | undefined {
	return blogPosts.find((p) => p.slug === slug);
}

export function getSortedPosts(): BlogPost[] {
	return blogPosts
		.slice()
		.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
