import Link from "next/link";
import { Fragment } from "react";

type BreadcrumbProps = {
	items: { label: string; href?: string }[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
	if (items.length === 0) return null;

	return (
		<nav aria-label="breadcrumb" className="mb-4 text-sm text-muted-foreground">
			<ol className="flex flex-wrap items-center gap-1">
				{items.map((item, index) => {
					const isLast = index === items.length - 1;
					return (
						<Fragment key={item.href ?? item.label}>
							<li>
								{item.href && !isLast ? (
									<Link
										href={item.href}
										className="transition-colors hover:text-foreground"
									>
										{item.label}
									</Link>
								) : (
									<span
										className={isLast ? "text-foreground" : undefined}
										aria-current={isLast ? "page" : undefined}
									>
										{item.label}
									</span>
								)}
							</li>
							{!isLast && (
								<li aria-hidden="true" className="px-1">
									›
								</li>
							)}
						</Fragment>
					);
				})}
			</ol>
		</nav>
	);
}
