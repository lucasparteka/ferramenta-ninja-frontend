import Link from "next/link";
import { findCategoryByToolHref } from "@/lib/data/tools";
import { cn } from "@/lib/utils";

 type CategoryToolsSectionProps = {
	 currentHref: string;
 };

 export function CategoryToolsSection({ currentHref }: CategoryToolsSectionProps) {
	 const category = findCategoryByToolHref(currentHref);
	 if (!category) return null;

	 const others = category.tools;

	 return (
		 <section className="mt-12">
			 <div className="mb-4 flex items-center justify-between">
				 <h2 className="text-lg font-semibold text-foreground">
					 Ferramentas da categoria {category.name}
				 </h2>
				 <Link
					 href={`/categorias/${category.id}`}
					 className="text-sm font-medium text-primary hover:underline"
				 >
					 Ver categoria completa →
				 </Link>
			 </div>
			 <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				 {others.map((tool) => {
					 const isCurrent = tool.href === currentHref;
					 return (
						 <div
							 key={tool.href}
							 className={cn(
								 "rounded-lg border p-3 transition-colors",
								 isCurrent
									 ? "border-primary/30 bg-primary/5"
									 : "border-border bg-card hover:bg-accent",
							 )}
						 >
							 {isCurrent ? (
								 <div className="flex items-start gap-2">
									 <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
									 <div>
										 <p className="text-sm font-semibold text-foreground">
											 {tool.name}
										 </p>
										 <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
											 {tool.description}
										 </p>
									 </div>
								 </div>
							 ) : (
								 <Link
									 href={tool.href}
									 className="flex items-start gap-2"
								 >
									 <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-muted-foreground/40" />
									 <div>
										 <p className="text-sm font-semibold text-foreground">
											 {tool.name}
										 </p>
										 <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
											 {tool.description}
										 </p>
									 </div>
								 </Link>
							 )}
						 </div>
					 );
				 })}
			 </div>
		 </section>
	 );
 }
