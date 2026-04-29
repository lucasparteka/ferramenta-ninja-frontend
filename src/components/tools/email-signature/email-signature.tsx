/** biome-ignore-all lint/performance/noImgElement: . */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, ImageIcon, Mail, Moon, Sun } from "lucide-react";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Slider } from "@/components/shared/slider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	DEFAULT_COLORS,
	FONT_SIZE_DEFAULT,
	FONT_SIZE_MAX,
	FONT_SIZE_MIN,
	PRESET_SWATCHES,
	SOCIAL_NETWORKS,
	SPACING_OPTIONS,
	TEMPLATE_IDS,
	TEMPLATE_LABELS,
} from "./config";
import { generateInlineHTML, generatePng } from "./export-utils";
import { SignaturePreview } from "./signature-preview";
import type { EmailSignatureData, SocialNetwork } from "./types";

const socialLinkSchema = z.object({
	network: z.enum([
		"linkedin",
		"instagram",
		"facebook",
		"x",
		"youtube",
		"github",
		"whatsapp",
	]),
	url: z.string().url("URL inválida").or(z.literal("")),
});

const schema = z.object({
	fullName: z.string().min(1, "Nome é obrigatório"),
	jobTitle: z.string(),
	company: z.string(),
	department: z.string(),
	email: z.string().email("Email inválido").or(z.literal("")),
	phone: z.string(),
	mobile: z.string(),
	address: z.string(),
	website: z.string().url("URL inválida").or(z.literal("")),
	socials: z.array(socialLinkSchema),
	photoUrl: z.string(),
	logoUrl: z.string(),
	bannerUrl: z.string(),
	template: z.enum([
		"minimal",
		"professional",
		"modern",
		"classic",
		"photo",
		"banner",
	]),
	primaryColor: z.string(),
	secondaryColor: z.string(),
	fontSize: z.number().min(12).max(18),
	spacing: z.enum(["compact", "normal", "spacious"]),
	greeting: z.string(),
	includeDisclaimer: z.boolean(),
	disclaimerText: z.string(),
	ctaText: z.string(),
	ctaUrl: z.string().url("URL inválida").or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
	fullName: "",
	jobTitle: "",
	company: "",
	department: "",
	email: "",
	phone: "",
	mobile: "",
	address: "",
	website: "",
	socials: [] as {
		network:
			| "linkedin"
			| "instagram"
			| "facebook"
			| "x"
			| "youtube"
			| "github"
			| "whatsapp";
		url: string;
	}[],
	photoUrl: "",
	logoUrl: "",
	bannerUrl: "",
	template: "minimal",
	primaryColor: DEFAULT_COLORS.primary,
	secondaryColor: DEFAULT_COLORS.secondary,
	fontSize: FONT_SIZE_DEFAULT,
	spacing: "normal",
	greeting: "Atenciosamente,",
	includeDisclaimer: false,
	disclaimerText:
		"Aviso: Esta mensagem e seus anexos são confidenciais. Se você a recebeu por engano, por favor notifique o remetente e apague-a.",
	ctaText: "",
	ctaUrl: "",
};

function toFormData(values: FormValues): EmailSignatureData {
	return {
		...values,
		socials: values.socials.filter((s) => s.url.trim() !== ""),
	};
}

export function EmailSignature() {
	const previewRef = useRef<HTMLDivElement>(null);
	const [darkBg, setDarkBg] = useState(false);
	const [activeSection, setActiveSection] = useState("info");
	const [copied, setCopied] = useState(false);

	const { register, control, setValue, watch } = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues,
	});

	const values = useWatch({ control });
	const data = toFormData(values as FormValues);

	const socials = watch("socials") || [];

	function handleCopyHtml() {
		const html = generateInlineHTML(data);
		navigator.clipboard.writeText(html);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	function handleDownloadHtml() {
		const html = generateInlineHTML(data);
		const blob = new Blob([html], { type: "text/html" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "assinatura.html";
		a.click();
		URL.revokeObjectURL(url);
	}

	async function handleDownloadPng() {
		if (!previewRef.current) return;
		const blob = await generatePng(previewRef.current);
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "assinatura.png";
		a.click();
		URL.revokeObjectURL(url);
	}

	function handleImageUpload(
		field: "photoUrl" | "logoUrl" | "bannerUrl",
		e: React.ChangeEvent<HTMLInputElement>,
	) {
		const file = e.target.files?.[0];
		if (file?.type.startsWith("image/")) {
			setValue(field, URL.createObjectURL(file));
		}
	}

	function addSocial(network: string) {
		const current = watch("socials") || [];
		if (!current.find((s) => s.network === network)) {
			setValue("socials", [
				...current,
				{ network: network as SocialNetwork, url: "" },
			]);
		}
	}

	function removeSocial(network: string) {
		const current = watch("socials") || [];
		setValue(
			"socials",
			current.filter((s) => s.network !== network),
		);
	}

	function updateSocialUrl(network: string, url: string) {
		const current = watch("socials") || [];
		setValue(
			"socials",
			current.map((s) => (s.network === network ? { ...s, url } : s)),
		);
	}

	const sections = [
		{ id: "info", label: "Informações" },
		{ id: "contact", label: "Contato" },
		{ id: "social", label: "Redes Sociais" },
		{ id: "appearance", label: "Aparência" },
		{ id: "images", label: "Imagens" },
		{ id: "extras", label: "Extras" },
	];

	return (
		<div className="space-y-6">
			{/* Navegação por abas */}
			<div className="flex flex-wrap gap-2">
				{sections.map((s) => (
					<button
						key={s.id}
						type="button"
						onClick={() => setActiveSection(s.id)}
						className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
							activeSection === s.id
								? "bg-primary text-primary-foreground"
								: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
						}`}
					>
						{s.label}
					</button>
				))}
			</div>

			<div className="max-w-2xl space-y-4">
				{/* Aba: Informações */}
				{activeSection === "info" && (
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="fullName">Nome completo *</Label>
							<Input id="fullName" {...register("fullName")} />
						</div>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="jobTitle">Cargo / Função</Label>
								<Input id="jobTitle" {...register("jobTitle")} />
							</div>
							<div className="space-y-2">
								<Label htmlFor="department">Departamento</Label>
								<Input id="department" {...register("department")} />
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="company">Empresa</Label>
							<Input id="company" {...register("company")} />
						</div>
					</div>
				)}

				{/* Aba: Contato */}
				{activeSection === "contact" && (
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								{...register("email")}
								placeholder="seu@email.com"
							/>
						</div>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="phone">Telefone</Label>
								<Input
									id="phone"
									type="number"
									{...register("phone")}
									placeholder="(99) 9999-9999"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="mobile">Celular / WhatsApp</Label>
								<Input
									id="mobile"
									type="number"
									{...register("mobile")}
									placeholder="(99) 99999-9999"
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor="website">Website / URL</Label>
							<Input
								id="website"
								{...register("website")}
								placeholder="https://www.suaempresa.com"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="address">Endereço</Label>
							<Textarea id="address" {...register("address")} rows={2} />
						</div>
					</div>
				)}

				{/* Aba: Redes Sociais */}
				{activeSection === "social" && (
					<div className="space-y-4">
						<p className="text-sm text-muted-foreground">
							Clique em uma rede para adicionar:
						</p>
						<div className="flex flex-wrap gap-2">
							{SOCIAL_NETWORKS.map((n) => {
								const active = socials.some((s) => s.network === n.id);
								return (
									<button
										key={n.id}
										type="button"
										onClick={() =>
											active ? removeSocial(n.id) : addSocial(n.id)
										}
										className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
											active
												? "bg-primary text-primary-foreground"
												: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
										}`}
									>
										{n.label}
									</button>
								);
							})}
						</div>
						{socials.length > 0 && (
							<div className="space-y-3">
								{socials.map((s) => (
									<div key={s.network} className="space-y-1">
										<Label className="text-sm capitalize">{s.network}</Label>
										<Input
											placeholder={`URL do ${s.network}`}
											value={s.url}
											onChange={(e) =>
												updateSocialUrl(s.network, e.target.value)
											}
										/>
									</div>
								))}
							</div>
						)}
					</div>
				)}

				{/* Aba: Aparência */}
				{activeSection === "appearance" && (
					<div className="space-y-6">
						<div className="space-y-2">
							<p className="text-sm font-medium">Template</p>
							<div className="flex flex-wrap gap-2">
								{TEMPLATE_IDS.map((id) => (
									<button
										key={id}
										type="button"
										onClick={() => setValue("template", id)}
										className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
											watch("template") === id
												? "bg-primary text-primary-foreground"
												: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
										}`}
									>
										{TEMPLATE_LABELS[id]}
									</button>
								))}
							</div>
						</div>

						<div className="space-y-2">
							<Label>Cor primária</Label>
							<div className="flex flex-wrap items-center gap-2">
								{PRESET_SWATCHES.map((color) => (
									<button
										key={color}
										type="button"
										onClick={() => setValue("primaryColor", color)}
										className={`h-8 w-8 rounded border-2 transition-all ${
											watch("primaryColor") === color
												? "border-foreground scale-110"
												: "border-transparent hover:scale-105"
										}`}
										style={{ backgroundColor: color }}
										aria-label={`Cor ${color}`}
									/>
								))}
								<Input
									type="color"
									value={watch("primaryColor")}
									onChange={(e) => setValue("primaryColor", e.target.value)}
									className="h-8 w-12 cursor-pointer p-1"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label>Cor secundária</Label>
							<div className="flex flex-wrap items-center gap-2">
								{PRESET_SWATCHES.map((color) => (
									<button
										key={color}
										type="button"
										onClick={() => setValue("secondaryColor", color)}
										className={`h-8 w-8 rounded border-2 transition-all ${
											watch("secondaryColor") === color
												? "border-foreground scale-110"
												: "border-transparent hover:scale-105"
										}`}
										style={{ backgroundColor: color }}
										aria-label={`Cor ${color}`}
									/>
								))}
								<Input
									type="color"
									value={watch("secondaryColor")}
									onChange={(e) => setValue("secondaryColor", e.target.value)}
									className="h-8 w-12 cursor-pointer p-1"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label>Tamanho da fonte</Label>
								<span className="text-sm text-muted-foreground">
									{watch("fontSize")}px
								</span>
							</div>
							<Slider
								value={[watch("fontSize")]}
								onValueChange={([v]) => setValue("fontSize", v)}
								min={FONT_SIZE_MIN}
								max={FONT_SIZE_MAX}
								step={1}
							/>
						</div>

						<div className="space-y-2">
							<p className="text-sm font-medium">Espaçamento</p>
							<div className="flex flex-wrap gap-2">
								{SPACING_OPTIONS.map((s) => (
									<button
										key={s}
										type="button"
										onClick={() => setValue("spacing", s)}
										className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors capitalize ${
											watch("spacing") === s
												? "bg-primary text-primary-foreground"
												: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
										}`}
									>
										{s === "compact"
											? "Compacto"
											: s === "spacious"
												? "Espaçoso"
												: "Normal"}
									</button>
								))}
							</div>
						</div>
					</div>
				)}

				{/* Aba: Imagens */}
				{activeSection === "images" && (
					<div className="space-y-6">
						<div className="space-y-2">
							<Label>Imagem lateral</Label>
							<div className="flex items-center gap-3">
								<Input
									type="file"
									accept="image/*"
									onChange={(e) => handleImageUpload("photoUrl", e)}
									className="cursor-pointer"
								/>
								{watch("photoUrl") && (
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => setValue("photoUrl", "")}
									>
										Remover
									</Button>
								)}
							</div>
							{watch("photoUrl") && (
								<img
									src={watch("photoUrl")}
									alt="Preview"
									className="h-16 w-16 rounded-full object-cover"
								/>
							)}
						</div>

						<div className="space-y-2">
							<Label>Imagem direita</Label>
							<div className="flex items-center gap-3">
								<Input
									type="file"
									accept="image/*"
									onChange={(e) => handleImageUpload("logoUrl", e)}
									className="cursor-pointer"
								/>
								{watch("logoUrl") && (
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => setValue("logoUrl", "")}
									>
										Remover
									</Button>
								)}
							</div>
							{watch("logoUrl") && (
								<img
									src={watch("logoUrl")}
									alt="Preview"
									className="h-10 object-contain"
								/>
							)}
						</div>

						<div className="space-y-2">
							<Label>Banner superior</Label>
							<div className="flex items-center gap-3">
								<Input
									type="file"
									accept="image/*"
									onChange={(e) => handleImageUpload("bannerUrl", e)}
									className="cursor-pointer"
								/>
								{watch("bannerUrl") && (
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => setValue("bannerUrl", "")}
									>
										Remover
									</Button>
								)}
							</div>
							{watch("bannerUrl") && (
								<img
									src={watch("bannerUrl")}
									alt="Preview"
									className="h-20 w-full rounded object-cover"
								/>
							)}
						</div>
					</div>
				)}

				{/* Aba: Extras */}
				{activeSection === "extras" && (
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="greeting">Frase de despedida</Label>
							<Input
								id="greeting"
								{...register("greeting")}
								placeholder="Atenciosamente,"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="ctaText">Texto do botão (CTA)</Label>
							<Input
								id="ctaText"
								{...register("ctaText")}
								placeholder="Agende uma reunião"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="ctaUrl">Link do CTA</Label>
							<Input
								id="ctaUrl"
								{...register("ctaUrl")}
								placeholder="https://calendly.com/..."
							/>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox
								id="disclaimer"
								checked={watch("includeDisclaimer")}
								onCheckedChange={(checked) =>
									setValue("includeDisclaimer", checked === true)
								}
							/>
							<Label htmlFor="disclaimer" className="text-sm font-normal">
								Incluir aviso de confidencialidade (LGPD)
							</Label>
						</div>
						{watch("includeDisclaimer") && (
							<div className="space-y-2">
								<Label htmlFor="disclaimerText">Texto do aviso</Label>
								<Textarea
									id="disclaimerText"
									{...register("disclaimerText")}
									rows={3}
								/>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Preview */}
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<p className="text-sm font-medium text-foreground">Preview</p>
					<button
						type="button"
						onClick={() => setDarkBg(!darkBg)}
						className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground hover:bg-secondary/80"
					>
						{darkBg ? (
							<Sun className="h-3.5 w-3.5" />
						) : (
							<Moon className="h-3.5 w-3.5" />
						)}
						{darkBg ? "Claro" : "Escuro"}
					</button>
				</div>
				<SignaturePreview ref={previewRef} data={data} darkBg={darkBg} />
			</div>

			{/* Ações */}
			<div className="flex flex-wrap gap-2">
				<Button type="button" onClick={handleCopyHtml} variant="outline">
					{copied ? (
						"Copiado!"
					) : (
						<>
							<Copy className="mr-2 h-4 w-4" />
							Copiar HTML
						</>
					)}
				</Button>
				<Button type="button" onClick={handleDownloadHtml} variant="outline">
					<Mail className="mr-2 h-4 w-4" />
					Baixar HTML
				</Button>
				<Button type="button" onClick={handleDownloadPng} variant="outline">
					<ImageIcon className="mr-2 h-4 w-4" />
					Baixar PNG
				</Button>
			</div>

			{/* Código HTML */}
			<div className="space-y-2">
				<p className="text-sm font-medium text-foreground">HTML Gerado</p>
				<pre className="max-h-48 overflow-auto rounded-lg bg-zinc-900 p-4 font-mono text-xs text-zinc-100">
					{generateInlineHTML(data)}
				</pre>
			</div>
		</div>
	);
}
