"use client";

import { Play, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ResultBox } from "@/components/shared/result-box";
import { Slider } from "@/components/shared/slider";
import { Button } from "@/components/ui/button";

type Mode = "infinite" | "timed";
type Preset = "15min" | "30min" | "1h" | "custom";

const PRESET_MINUTES: Record<Exclude<Preset, "custom">, number> = {
	"15min": 15,
	"30min": 30,
	"1h": 60,
};

function formatMs(ms: number): string {
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function formatMinutes(minutes: number): string {
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	if (h > 0 && m > 0) return `${h}h ${m}min`;
	if (h > 0) return `${h}h`;
	return `${m}min`;
}

export function KeepAwake() {
	const [isActive, setIsActive] = useState(false);
	const [elapsedMs, setElapsedMs] = useState(0);
	const [mode, setMode] = useState<Mode>("infinite");
	const [preset, setPreset] = useState<Preset>("15min");
	const [customMinutes, setCustomMinutes] = useState(60);
	const [remainingMs, setRemainingMs] = useState(0);
	const [error, setError] = useState<string | null>(null);

	const wakeLockRef = useRef<WakeLockSentinel | null>(null);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const rafRef = useRef<number>(0);
	const lastTsRef = useRef<number>(0);
	const elapsedRef = useRef(0);
	const remainingRef = useRef(0);

	const totalTimedMs =
		mode === "timed"
			? (preset === "custom" ? customMinutes : PRESET_MINUTES[preset]) * 60_000
			: 0;

	const requestWakeLock = useCallback(async () => {
		try {
			if ("wakeLock" in navigator) {
				const sentinel = await navigator.wakeLock.request("screen");
				wakeLockRef.current = sentinel;
				sentinel.addEventListener("release", () => {
					wakeLockRef.current = null;
				});
				return;
			}
		} catch {
			// fallback abaixo
		}

		if (!videoRef.current) {
			const video = document.createElement("video");
			video.src =
				"data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC";
			video.loop = true;
			video.muted = true;
			video.playsInline = true;
			video.setAttribute("playsinline", "true");
			video.style.width = "1px";
			video.style.height = "1px";
			video.style.opacity = "0";
			video.style.position = "fixed";
			video.style.pointerEvents = "none";
			document.body.appendChild(video);
			videoRef.current = video;
		}
		void videoRef.current.play();
	}, []);

	const releaseWakeLock = useCallback(() => {
		if (wakeLockRef.current) {
			wakeLockRef.current.release().catch(() => {});
			wakeLockRef.current = null;
		}
		if (videoRef.current) {
			videoRef.current.pause();
		}
	}, []);

	const stopTimers = useCallback(() => {
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = 0;
		}
		lastTsRef.current = 0;
	}, []);

	const tick = useCallback(
		(ts: number) => {
			if (!lastTsRef.current) lastTsRef.current = ts;
			const delta = ts - lastTsRef.current;
			lastTsRef.current = ts;

			elapsedRef.current += delta;
			setElapsedMs(elapsedRef.current);

			if (mode === "timed") {
				remainingRef.current -= delta;
				if (remainingRef.current <= 0) {
					remainingRef.current = 0;
					setRemainingMs(0);
					releaseWakeLock();
					stopTimers();
					setIsActive(false);
					return;
				}
				setRemainingMs(remainingRef.current);
			}

			rafRef.current = requestAnimationFrame(tick);
		},
		[mode, releaseWakeLock, stopTimers],
	);

	const activate = useCallback(async () => {
		setError(null);
		try {
			await requestWakeLock();
		} catch {
			setError("Não foi possível manter a tela ligada neste dispositivo.");
			return;
		}

		setIsActive(true);
		elapsedRef.current = 0;
		setElapsedMs(0);
		if (mode === "timed") {
			remainingRef.current = totalTimedMs;
			setRemainingMs(totalTimedMs);
		}
		lastTsRef.current = 0;
		rafRef.current = requestAnimationFrame(tick);
	}, [requestWakeLock, mode, totalTimedMs, tick]);

	const deactivate = useCallback(() => {
		releaseWakeLock();
		stopTimers();
		setIsActive(false);
		setElapsedMs(0);
		setRemainingMs(0);
		elapsedRef.current = 0;
		remainingRef.current = 0;
	}, [releaseWakeLock, stopTimers]);

	useEffect(() => {
		return () => {
			releaseWakeLock();
			stopTimers();
			if (videoRef.current) {
				videoRef.current.remove();
				videoRef.current = null;
			}
		};
	}, [releaseWakeLock, stopTimers]);

	const handleToggle = () => {
		if (isActive) {
			deactivate();
		} else {
			void activate();
		}
	};

	const handleModeChange = (newMode: Mode) => {
		if (isActive) {
			deactivate();
		}
		setMode(newMode);
	};

	const handlePresetChange = (newPreset: Preset) => {
		if (isActive) {
			deactivate();
		}
		setPreset(newPreset);
	};

	return (
		<div className="space-y-8 lg:h-100">
			<div className="flex flex-col items-center gap-6">
				<ResultBox tone="primary" className="w-full max-w-sm text-center">
					<p className="text-sm text-muted-foreground">Tempo de sessão</p>
					<p className="text-5xl font-bold tracking-tight text-primary tabular-nums">
						{formatMs(elapsedMs)}
					</p>
					{mode === "timed" && isActive && (
						<p className="mt-1 text-sm text-muted-foreground">
							Restante: {formatMs(remainingMs)}
						</p>
					)}
					{mode === "timed" && !isActive && (
						<p className="mt-1 text-sm text-muted-foreground">
							Tempo definido:{" "}
							{formatMinutes(
								preset === "custom" ? customMinutes : PRESET_MINUTES[preset],
							)}
						</p>
					)}
				</ResultBox>

				<div className="flex flex-wrap items-center justify-center gap-3">
					<Button
						size="lg"
						onClick={handleToggle}
						variant={isActive ? "destructive" : "default"}
					>
						{isActive ? (
							<>
								<Square />
								Desativar
							</>
						) : (
							<>
								<Play />
								Ativar
							</>
						)}
					</Button>
				</div>

				{error && <p className="text-sm text-destructive">{error}</p>}
			</div>

			<div className="mx-auto max-w-md space-y-6">
				<div className="space-y-3 flex items-center flex-col">
					<h3 className="text-sm font-semibold text-foreground">Modo</h3>
					<div className="flex gap-2">
						<Button
							variant={mode === "infinite" ? "default" : "outline"}
							size="sm"
							onClick={() => handleModeChange("infinite")}
						>
							Infinito
						</Button>
						<Button
							variant={mode === "timed" ? "default" : "outline"}
							size="sm"
							onClick={() => handleModeChange("timed")}
						>
							Programado
						</Button>
					</div>
				</div>

				{mode === "timed" && (
					<div className="space-y-3 flex flex-col items-center">
						<h3 className="text-sm font-semibold text-foreground">Tempo</h3>
						<div className="flex flex-wrap gap-2">
							{(
								Object.keys(PRESET_MINUTES) as Array<Exclude<Preset, "custom">>
							).map((p) => (
								<Button
									key={p}
									variant={preset === p ? "default" : "outline"}
									size="sm"
									onClick={() => handlePresetChange(p)}
								>
									{p === "15min" ? "15 min" : p === "30min" ? "30 min" : "1 h"}
								</Button>
							))}
							<Button
								variant={preset === "custom" ? "default" : "outline"}
								size="sm"
								onClick={() => handlePresetChange("custom")}
							>
								Customizado
							</Button>
						</div>

						{preset === "custom" && (
							<div className="space-y-3 w-full">
								<div className="flex items-center justify-between text-sm text-muted-foreground">
									<span>1h</span>
									<span className="font-medium text-foreground">
										{formatMinutes(customMinutes)}
									</span>
									<span>10h</span>
								</div>
								<Slider
									min={60}
									max={600}
									step={30}
									value={[customMinutes]}
									onValueChange={([v]) => setCustomMinutes(v)}
								/>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
