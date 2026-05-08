"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { categories } from "@/lib/data/tools";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Header() {
	const [categoriesOpen, setCategoriesOpen] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown on click outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setCategoriesOpen(false);
			}
		}
		if (categoriesOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [categoriesOpen]);

	// Lock body scroll and close on Escape when mobile menu is open
	useEffect(() => {
		if (mobileOpen) {
			document.body.style.overflow = "hidden";
			const onKeyDown = (e: KeyboardEvent) => {
				if (e.key === "Escape") setMobileOpen(false);
			};
			document.addEventListener("keydown", onKeyDown);
			return () => {
				document.body.style.overflow = "";
				document.removeEventListener("keydown", onKeyDown);
			};
		}
		document.body.style.overflow = "";
	}, [mobileOpen]);

	return (
		<>
			<header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
				<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
					{/* Logo */}
					<Link href="/" className="flex items-center">
						<span className="text-xl font-semibold text-primary">ferramenta</span>
						<span className="text-xl font-semibold text-foreground">.ninja</span>
					</Link>

					{/* Desktop navigation */}
					<nav aria-label="Navegação principal" className="hidden md:block">
						<ul className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
							<li>
								<Link
									href="/"
									className="transition-colors hover:text-foreground"
								>
									Início
								</Link>
							</li>
							<li>
								<Link
									href="/ferramentas"
									className="transition-colors hover:text-foreground"
								>
									Ferramentas
								</Link>
							</li>
							<li>
								<Link
									href="/blog"
									className="transition-colors hover:text-foreground"
								>
									Blog
								</Link>
							</li>
							<li>
								<div ref={dropdownRef} className="relative">
									<button
										type="button"
										onClick={() => setCategoriesOpen((v) => !v)}
										className="flex items-center gap-1 transition-colors hover:text-foreground"
										aria-expanded={categoriesOpen}
										aria-haspopup="true"
									>
										Categorias
										<ChevronDown
											className={`size-4 transition-transform ${categoriesOpen ? "rotate-180" : ""}`}
										/>
									</button>
									{categoriesOpen && (
										<div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-border bg-card p-2 shadow-lg">
											<ul className="grid gap-1">
												{categories.map((cat) => (
													<li key={cat.id}>
														<Link
															href={`/categorias/${cat.id}`}
															className="block rounded-sm px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
															onClick={() => setCategoriesOpen(false)}
														>
															<span className="font-medium">{cat.name}</span>
															<span className="block text-xs text-muted-foreground">
																{cat.tools.length}{" "}
																{cat.tools.length === 1
																	? "ferramenta"
																	: "ferramentas"}
															</span>
														</Link>
													</li>
												))}
											</ul>
										</div>
										)}
									</div>
								</li>
								<li>
									<ThemeToggle />
								</li>
							</ul>
						</nav>

						{/* Mobile theme toggle + hamburger */}
						<div className="flex items-center gap-2 md:hidden">
							<ThemeToggle />
							<button
								type="button"
								onClick={() => setMobileOpen(true)}
								className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
								aria-label="Abrir menu"
								aria-expanded={mobileOpen}
							>
								<Menu className="size-6" />
							</button>
						</div>
					</div>
				</header>

				{/* Mobile drawer — rendered OUTSIDE header to avoid stacking context issues */}
				{mobileOpen && (
					<div className="fixed inset-0 z-[100] md:hidden">
						{/* Backdrop */}
						<button
							type="button"
							className="absolute inset-0 cursor-default bg-black/50"
							onClick={() => setMobileOpen(false)}
							aria-label="Fechar menu"
							tabIndex={-1}
						/>
						{/* Panel */}
						<div className="absolute right-0 inset-y-0 w-80 max-w-[85vw] flex flex-col bg-card shadow-xl">
							<div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
								<span className="text-lg font-semibold text-foreground">Menu</span>
								<button
									type="button"
									onClick={() => setMobileOpen(false)}
									className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
									aria-label="Fechar menu"
								>
									<X className="size-5" />
								</button>
							</div>
							<nav aria-label="Navegação mobile" className="min-h-0 flex-1 overflow-y-auto p-4">
								<ul className="flex flex-col gap-2">
									<li>
										<Link
											href="/"
											className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
											onClick={() => setMobileOpen(false)}
										>
											Início
										</Link>
									</li>
									<li>
										<Link
											href="/ferramentas"
											className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
											onClick={() => setMobileOpen(false)}
										>
											Ferramentas
										</Link>
									</li>
									<li>
										<Link
											href="/blog"
											className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
											onClick={() => setMobileOpen(false)}
										>
											Blog
										</Link>
									</li>
									<li className="border-t border-border pt-2">
										<span className="block px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
											Categorias
										</span>
										<ul className="mt-1 flex flex-col gap-0.5">
											{categories.map((cat) => (
												<li key={cat.id}>
													<Link
														href={`/categorias/${cat.id}`}
														className="block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
														onClick={() => setMobileOpen(false)}
													>
														<span className="font-medium">{cat.name}</span>
														<span className="ml-1 text-xs text-muted-foreground">
															({cat.tools.length})
														</span>
													</Link>
												</li>
											))}
										</ul>
									</li>
								</ul>
							</nav>
						</div>
					</div>
				)}
			</>
		);
	}
