"use client";

import { motion } from "framer-motion";
import { FileCode, Image, Smile, Type } from "lucide-react";
import type { FaviconMode } from "@/lib/image/favicon";

interface ModeOption {
	mode: FaviconMode;
	label: string;
	description: string;
	icon: React.ElementType;
	color: string;
	bgColor: string;
	borderColor: string;
	hoverBorderColor: string;
}

const MODES: ModeOption[] = [
	{
		mode: "image",
		label: "Imagem",
		description: "Envie uma imagem PNG ou JPG",
		icon: Image,
		color: "text-blue-600 dark:text-blue-400",
		bgColor: "bg-blue-50 dark:bg-blue-950/30",
		borderColor: "border-blue-200 dark:border-blue-800",
		hoverBorderColor: "hover:border-blue-400 dark:hover:border-blue-600",
	},
	{
		mode: "svg",
		label: "SVG",
		description: "Cole ou envie um arquivo SVG",
		icon: FileCode,
		color: "text-purple-600 dark:text-purple-400",
		bgColor: "bg-purple-50 dark:bg-purple-950/30",
		borderColor: "border-purple-200 dark:border-purple-800",
		hoverBorderColor: "hover:border-purple-400 dark:hover:border-purple-600",
	},
	{
		mode: "text",
		label: "Texto",
		description: "Crie com letras e escolha cores",
		icon: Type,
		color: "text-emerald-600 dark:text-emerald-400",
		bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
		borderColor: "border-emerald-200 dark:border-emerald-800",
		hoverBorderColor: "hover:border-emerald-400 dark:hover:border-emerald-600",
	},
	{
		mode: "emoji",
		label: "Emoji",
		description: "Escolha um emoji e cor de fundo",
		icon: Smile,
		color: "text-amber-600 dark:text-amber-400",
		bgColor: "bg-amber-50 dark:bg-amber-950/30",
		borderColor: "border-amber-200 dark:border-amber-800",
		hoverBorderColor: "hover:border-amber-400 dark:hover:border-amber-600",
	},
];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.1,
		},
	},
	exit: {
		opacity: 0,
		transition: { duration: 0.2 },
	},
};

const cardVariants = {
	hidden: {
		opacity: 0,
		y: 24,
		scale: 0.96,
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			type: "spring" as const,
			damping: 20,
			stiffness: 300,
		},
	},
};

interface ModeSelectorProps {
	onSelect: (mode: FaviconMode) => void;
}

export function ModeSelector({ onSelect }: ModeSelectorProps) {
	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
			className="space-y-6"
		>
			<div className="text-center space-y-2">
				<motion.h2
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0, duration: 0.4 }}
					className="text-xl font-semibold tracking-tight"
				>
					Como deseja criar seu favicon?
				</motion.h2>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.15, duration: 0.4 }}
					className="text-sm text-muted-foreground max-w-md mx-auto"
				>
					Escolha uma das opções abaixo para começar. Você poderá visualizar e
					ajustar antes de gerar o pacote final.
				</motion.p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{MODES.map((item) => {
					const Icon = item.icon;
					return (
						<motion.button
							key={item.mode}
							type="button"
							variants={cardVariants}
							onClick={() => onSelect(item.mode)}
							whileHover={{ y: -4, transition: { duration: 0.2 } }}
							whileTap={{ scale: 0.97 }}
							className={`
								group relative flex flex-col items-center gap-4
								rounded-2xl border-2 p-6 text-center
								bg-card shadow-sm
								transition-colors duration-200
								${item.borderColor} ${item.hoverBorderColor}
								hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
							`}
						>
							<div
								className={`
									flex h-14 w-14 items-center justify-center rounded-xl
									${item.bgColor}
									transition-transform duration-200 group-hover:scale-110
								`}
							>
								<Icon className={`h-7 w-7 ${item.color}`} />
							</div>

							<div className="space-y-1">
								<span className="block text-base font-semibold">
									{item.label}
								</span>
								<span className="block text-xs text-muted-foreground leading-relaxed">
									{item.description}
								</span>
							</div>

							<motion.div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 dark:from-white/[0.02] pointer-events-none" />
						</motion.button>
					);
				})}
			</div>
		</motion.div>
	);
}
