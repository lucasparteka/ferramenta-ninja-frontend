import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { breadcrumbSchema } from "@/lib/seo/jsonld";

type StaticPageProps = {
	title: string;
	description?: string;
	breadcrumbLabel: string;
	href: string;
	children: React.ReactNode;
};

export function StaticPage({
	title,
	description,
	breadcrumbLabel,
	href,
	children,
}: StaticPageProps) {
	const breadcrumbs = [
		{ label: "Início", href: "/" },
		{ label: breadcrumbLabel, href },
	];

	return (
		<div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
			<Breadcrumb items={breadcrumbs} />

			<div className="mb-8">
				<h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
					{title}
				</h1>
				{description && (
					<p className="text-lg text-muted-foreground">{description}</p>
				)}
			</div>

			<Separator className="mb-7" />

			<article className="prose-fn space-y-6 text-foreground">
				{children}
			</article>

			<JsonLd data={breadcrumbSchema(breadcrumbs)} />
		</div>
	);
}
