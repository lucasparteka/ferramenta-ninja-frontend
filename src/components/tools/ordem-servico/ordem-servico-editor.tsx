"use client";

import { format } from "date-fns";
import {
	CalendarIcon,
	FileDown,
	Image,
	Plus,
	Trash,
	Upload,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { buildInitialState } from "@/lib/ordem-servico/defaults";
import {
	exportOrdemServicoPdf,
	exportOrdemServicoPng,
} from "@/lib/ordem-servico/export";
import type {
	CanvasHandle,
	OrdemServicoItem,
	OrdemServicoState,
} from "@/lib/ordem-servico/types";
import { OrdemServicoCanvas } from "./ordem-servico-canvas";

const LS_KEY = "ferramenta-ninja:ordem-servico";

function maskCnpjCpf(raw: string): string {
	const d = raw.replace(/\D/g, "").slice(0, 14);
	if (d.length <= 11) {
		return d
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d)/, "$1.$2")
			.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
	}
	return d
		.replace(/(\d{2})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1.$2")
		.replace(/(\d{3})(\d)/, "$1/$2")
		.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

function maskPhone(raw: string): string {
	const d = raw.replace(/\D/g, "").slice(0, 11);
	if (d.length <= 10) {
		return d
			.replace(/(\d{2})(\d)/, "($1) $2")
			.replace(/(\d{4})(\d{1,4})$/, "$1-$2");
	}
	return d
		.replace(/(\d{2})(\d)/, "($1) $2")
		.replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

type DatePickerProps = {
	value: string;
	onChange: (iso: string) => void;
	placeholder?: string;
	id?: string;
};

function DatePicker({
	value,
	onChange,
	placeholder = "Selecionar data",
	id,
}: DatePickerProps) {
	const selected = value ? new Date(`${value}T12:00:00`) : undefined;

	return (
		<div className="flex gap-1">
			<Popover>
				<PopoverTrigger
					id={id}
					render={
						<Button
							type="button"
							variant="outline"
							className="min-w-0 flex-1 justify-start gap-2 text-left font-normal bg-white"
						/>
					}
				>
					<CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
					{selected ? (
						format(selected, "dd/MM/yyyy")
					) : (
						<span className="text-muted-foreground">{placeholder}</span>
					)}
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="single"
						selected={selected}
						onSelect={(date) => {
							if (date) onChange(date.toISOString().slice(0, 10));
						}}
					/>
				</PopoverContent>
			</Popover>
			{value && (
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => onChange("")}
					aria-label="Limpar data"
					className="shrink-0"
				>
					<X className="size-4" />
				</Button>
			)}
		</div>
	);
}

function formatCurrency(value: number): string {
	return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function OrdemServicoEditor() {
	const [state, setState] = useState<OrdemServicoState>(buildInitialState);
	const [activeTab, setActiveTab] = useState<"dados" | "itens">("dados");
	const canvasRef = useRef<CanvasHandle>(null);

	useEffect(() => {
		try {
			localStorage.setItem(LS_KEY, JSON.stringify(state));
		} catch {
			// ignore
		}
	}, [state]);

	function updatePrestador(patch: Partial<OrdemServicoState["prestador"]>) {
		setState((prev) => ({
			...prev,
			prestador: { ...prev.prestador, ...patch },
		}));
	}

	function updateCliente(patch: Partial<OrdemServicoState["cliente"]>) {
		setState((prev) => ({ ...prev, cliente: { ...prev.cliente, ...patch } }));
	}

	function updateResumo(patch: Partial<OrdemServicoState["resumo"]>) {
		setState((prev) => ({ ...prev, resumo: { ...prev.resumo, ...patch } }));
	}

	function addItem() {
		setState((prev) => ({
			...prev,
			itens: [
				...prev.itens,
				{ id: crypto.randomUUID(), descricao: "", qtd: 1, valorUnit: 0 },
			],
		}));
	}

	function updateItem(id: string, patch: Partial<OrdemServicoItem>) {
		setState((prev) => ({
			...prev,
			itens: prev.itens.map((item) =>
				item.id === id ? { ...item, ...patch } : item,
			),
		}));
	}

	function removeItem(id: string) {
		setState((prev) => ({
			...prev,
			itens: prev.itens.filter((item) => item.id !== id),
		}));
	}

	function handleLogoUpload(file: File) {
		const reader = new FileReader();
		reader.onload = (ev) => {
			updatePrestador({ logo: (ev.target?.result as string) ?? "" });
		};
		reader.readAsDataURL(file);
	}

	const total = state.itens.reduce(
		(sum, item) => sum + item.qtd * item.valorUnit,
		0,
	);

	async function handleExportPdf() {
		const dataUrl = canvasRef.current?.getDataURL() ?? "";
		if (dataUrl) await exportOrdemServicoPdf(dataUrl);
	}

	function handleExportPng() {
		const dataUrl = canvasRef.current?.getDataURL() ?? "";
		if (dataUrl) exportOrdemServicoPng(dataUrl);
	}

	return (
		<div className="grid gap-6 lg:grid-cols-[5fr_6fr]">
			<div>
				<div className="flex border-b border-border mb-5">
					{(
						[
							{ id: "dados", label: "Dados" },
							{
								id: "itens",
								label: `Itens${state.itens.length > 0 ? ` (${state.itens.length})` : ""}`,
							},
						] as const
					).map((tab) => (
						<button
							key={tab.id}
							type="button"
							onClick={() => setActiveTab(tab.id)}
							className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none ${
								activeTab === tab.id
									? "border-primary text-foreground"
									: "border-transparent text-muted-foreground hover:text-foreground"
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>

				{activeTab === "dados" && (
					<div className="space-y-6">
						<fieldset className="space-y-4">
							<legend className="text-sm font-semibold text-foreground mb-2">
								Prestador de serviço
							</legend>
							<div className="space-y-2">
								<Label htmlFor="empresa">Nome / Empresa</Label>
								<Input
									id="empresa"
									value={state.prestador.empresa}
									onChange={(e) => updatePrestador({ empresa: e.target.value })}
									placeholder="Ex: Oficina do João"
									maxLength={80}
								/>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div className="space-y-2">
									<Label htmlFor="cnpjCpf">CNPJ / CPF</Label>
									<Input
										id="cnpjCpf"
										value={state.prestador.cnpjCpf}
										onChange={(e) =>
											updatePrestador({
												cnpjCpf: maskCnpjCpf(e.target.value),
											})
										}
										placeholder="00.000.000/0000-00"
										maxLength={18}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="endereco">Endereço</Label>
									<Input
										id="endereco"
										value={state.prestador.endereco}
										onChange={(e) =>
											updatePrestador({ endereco: e.target.value })
										}
										placeholder="Rua, número, cidade"
										maxLength={120}
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label>
									Logo{" "}
									<span className="font-normal text-muted-foreground">
										(opcional)
									</span>
								</Label>
								{state.prestador.logo ? (
									<div className="flex items-center gap-3">
										<img
											src={state.prestador.logo}
											alt="Logo"
											className="h-12 w-auto max-w-[120px] rounded border border-border bg-muted object-contain"
										/>
										<Button
											type="button"
											variant="secondary"
											onClick={() => updatePrestador({ logo: "" })}
										>
											<Trash className="size-4" />
											Remover
										</Button>
									</div>
								) : (
									<label className="cursor-pointer">
										<span className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-muted">
											<Upload className="size-4" />
											Carregar imagem
										</span>
										<Input
											type="file"
											accept="image/*"
											className="hidden"
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) handleLogoUpload(file);
											}}
										/>
									</label>
								)}
							</div>
						</fieldset>

						<div className="border-t border-border" />

						<fieldset className="space-y-4">
							<legend className="text-sm font-semibold text-foreground mb-2">
								Cliente
							</legend>
							<div className="grid grid-cols-2 gap-3">
								<div className="space-y-2">
									<Label htmlFor="clienteNome">Nome</Label>
									<Input
										id="clienteNome"
										value={state.cliente.nome}
										onChange={(e) => updateCliente({ nome: e.target.value })}
										placeholder="Nome do cliente"
										maxLength={80}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="clienteContato">Contato</Label>
									<Input
										id="clienteContato"
										value={state.cliente.contato}
										onChange={(e) =>
											updateCliente({ contato: maskPhone(e.target.value) })
										}
										placeholder="(11) 99999-9999"
										maxLength={15}
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="clienteEmail">
									E-mail{" "}
									<span className="font-normal text-muted-foreground">
										(opcional)
									</span>
								</Label>
								<Input
									id="clienteEmail"
									type="email"
									value={state.cliente.email}
									onChange={(e) => updateCliente({ email: e.target.value })}
									placeholder="cliente@email.com"
									maxLength={80}
								/>
							</div>
						</fieldset>

						<div className="border-t border-border" />

						<fieldset className="space-y-4">
							<legend className="text-sm font-semibold text-foreground mb-2">
								Resumo do serviço
							</legend>
							<div className="space-y-2">
								<Label htmlFor="titulo">Título</Label>
								<Input
									id="titulo"
									value={state.resumo.titulo}
									onChange={(e) => updateResumo({ titulo: e.target.value })}
									placeholder="Ex: Manutenção preventiva"
									maxLength={80}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="descricao">Descrição</Label>
								<Textarea
									id="descricao"
									value={state.resumo.descricao}
									onChange={(e) => updateResumo({ descricao: e.target.value })}
									placeholder="Descreva o serviço a ser realizado..."
									maxLength={400}
									rows={3}
								/>
							</div>
							<div className="grid grid-cols-2 gap-3">
								<div className="space-y-2">
									<Label htmlFor="dataAbertura">
										Data de abertura{" "}
										<span className="font-normal text-muted-foreground">
											(opcional)
										</span>
									</Label>
									<DatePicker
										id="dataAbertura"
										value={state.resumo.dataAbertura}
										onChange={(iso) => updateResumo({ dataAbertura: iso })}
										placeholder="Selecionar data"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="prazo">
										Prazo{" "}
										<span className="font-normal text-muted-foreground">
											(opcional)
										</span>
									</Label>
									<DatePicker
										id="prazo"
										value={state.resumo.prazo}
										onChange={(iso) => updateResumo({ prazo: iso })}
										placeholder="Selecionar prazo"
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="formaPagamento">
									Forma de pagamento{" "}
									<span className="font-normal text-muted-foreground">
										(opcional)
									</span>
								</Label>
								<Input
									id="formaPagamento"
									value={state.resumo.formaPagamento}
									onChange={(e) =>
										updateResumo({ formaPagamento: e.target.value })
									}
									placeholder="Ex: PIX, boleto, cartão"
									maxLength={60}
								/>
							</div>
						</fieldset>

						<div className="border-t border-border" />

						<div className="space-y-2">
							<Label htmlFor="observacoes">
								Observações{" "}
								<span className="font-normal text-muted-foreground">
									(opcional)
								</span>
							</Label>
							<Textarea
								id="observacoes"
								value={state.observacoes}
								onChange={(e) =>
									setState((prev) => ({
										...prev,
										observacoes: e.target.value,
									}))
								}
								placeholder="Informações adicionais, garantias, condições..."
								maxLength={500}
								rows={3}
							/>
						</div>
					</div>
				)}

				{activeTab === "itens" && (
					<div className="space-y-4">
						<div className="space-y-3">
							{state.itens.length > 0 && (
								<div className="grid grid-cols-[1fr_64px_100px_36px] gap-2 px-1">
									<span className="text-xs font-medium text-muted-foreground">
										Descrição
									</span>
									<span className="text-xs font-medium text-muted-foreground text-center">
										Qtd
									</span>
									<span className="text-xs font-medium text-muted-foreground text-right">
										Valor unit.
									</span>
									<span />
								</div>
							)}

							{state.itens.map((item) => (
								<div
									key={item.id}
									className="grid grid-cols-[1fr_64px_100px_36px] gap-2 items-center"
								>
									<Input
										value={item.descricao}
										onChange={(e) =>
											updateItem(item.id, { descricao: e.target.value })
										}
										placeholder="Descrição do item"
										maxLength={80}
									/>
									<Input
										type="number"
										value={item.qtd}
										onChange={(e) =>
											updateItem(item.id, {
												qtd: Math.max(1, Number(e.target.value)),
											})
										}
										min={1}
										className="text-center"
									/>
									<Input
										type="number"
										value={item.valorUnit === 0 ? "" : item.valorUnit}
										onChange={(e) =>
											updateItem(item.id, {
												valorUnit: Math.max(0, Number(e.target.value)),
											})
										}
										placeholder="0,00"
										min={0}
										step={0.01}
										className="text-right"
									/>
									<Button
										type="button"
										variant="secondary"
										onClick={() => removeItem(item.id)}
										disabled={state.itens.length <= 1}
										aria-label="Remover item"
										className="shrink-0"
									>
										<Trash className="size-4" />
										Remover
									</Button>
								</div>
							))}
						</div>

						<Button
							type="button"
							variant="outline"
							onClick={addItem}
							className="w-full"
						>
							<Plus className="size-4" />
							Adicionar item
						</Button>

						{state.itens.length > 0 && (
							<div className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-3">
								<span className="text-sm font-medium text-muted-foreground">
									Total geral
								</span>
								<span className="text-base font-semibold tabular-nums">
									{formatCurrency(total)}
								</span>
							</div>
						)}
					</div>
				)}
			</div>

			<div className="space-y-4">
				<div className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
					<OrdemServicoCanvas ref={canvasRef} state={state} />
				</div>
				<div className="flex gap-3">
					<Button onClick={handleExportPdf} className="flex-1">
						<FileDown className="size-4" />
						Baixar PDF
					</Button>
					<Button
						onClick={handleExportPng}
						variant="outline"
						className="flex-1"
					>
						<Image className="size-4" />
						Baixar PNG
					</Button>
				</div>
				<p className="text-xs text-muted-foreground text-center">
					Dados salvos automaticamente no navegador
				</p>
			</div>
		</div>
	);
}
