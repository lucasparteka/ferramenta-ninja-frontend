"use client";

import { Flag, Pause, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ResultBox } from "@/components/shared/result-box";
import { Button } from "@/components/ui/button";
import type { Lap } from "@/lib/date/stopwatch";
import { formatStopwatch } from "@/lib/date/stopwatch";

export function Stopwatch() {
	const [isRunning, setIsRunning] = useState(false);
	const [elapsedMs, setElapsedMs] = useState(0);
	const [laps, setLaps] = useState<Lap[]>([]);
	const startTimeRef = useRef<number>(0);
	const pausedElapsedRef = useRef<number>(0);
	const rafRef = useRef<number>(0);

	const tick = useCallback(() => {
		if (!isRunning) return;
		setElapsedMs(
			pausedElapsedRef.current + (Date.now() - startTimeRef.current),
		);
		rafRef.current = requestAnimationFrame(tick);
	}, [isRunning]);

	useEffect(() => {
		if (isRunning) {
			rafRef.current = requestAnimationFrame(tick);
		}
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [isRunning, tick]);

	function handleStart() {
		if (!isRunning) {
			startTimeRef.current = Date.now();
			setIsRunning(true);
		}
	}

	function handlePause() {
		if (isRunning) {
			pausedElapsedRef.current += Date.now() - startTimeRef.current;
			setIsRunning(false);
		}
	}

	function handleReset() {
		setIsRunning(false);
		setElapsedMs(0);
		pausedElapsedRef.current = 0;
		setLaps([]);
	}

	function handleLap() {
		if (!isRunning) return;
		const current =
			pausedElapsedRef.current + (Date.now() - startTimeRef.current);
		const lastLapMs = laps.length > 0 ? laps[laps.length - 1].elapsedMs : 0;
		const split = current - lastLapMs;
		setLaps((prev) => [
			...prev,
			{ id: prev.length + 1, elapsedMs: current, splitMs: split },
		]);
	}

	return (
		<div className="space-y-6">
			<div className="max-w-2xl space-y-6">
				<ResultBox tone="primary" className="text-center">
					<p className="font-mono text-5xl font-bold text-foreground sm:text-6xl">
						{formatStopwatch(elapsedMs)}
					</p>
				</ResultBox>

				<div className="flex flex-wrap justify-center gap-3">
					{!isRunning ? (
						<Button onClick={handleStart} size="lg">
							<Play className="mr-2 h-5 w-5" />
							Iniciar
						</Button>
					) : (
						<Button onClick={handlePause} size="lg" variant="secondary">
							<Pause className="mr-2 h-5 w-5" />
							Pausar
						</Button>
					)}
					<Button
						onClick={handleLap}
						disabled={!isRunning}
						size="lg"
						variant="outline"
					>
						<Flag className="mr-2 h-5 w-5" />
						Volta
					</Button>
					<Button onClick={handleReset} size="lg" variant="ghost">
						<RotateCcw className="mr-2 h-5 w-5" />
						Reiniciar
					</Button>
				</div>
			</div>

			{laps.length > 0 && (
				<div className="max-w-2xl space-y-4">
					<h3 className="text-sm font-medium text-foreground">Voltas</h3>
					<div className="max-h-64 overflow-auto rounded-lg border border-border">
						<table className="w-full text-sm">
							<thead className="bg-muted">
								<tr>
									<th className="px-3 py-2 text-left font-medium text-muted-foreground">
										#
									</th>
									<th className="px-3 py-2 text-left font-medium text-muted-foreground">
										Volta
									</th>
									<th className="px-3 py-2 text-left font-medium text-muted-foreground">
										Total
									</th>
								</tr>
							</thead>
							<tbody>
								{laps.map((lap) => (
									<tr key={lap.id} className="border-t border-border">
										<td className="px-3 py-2 text-muted-foreground">
											{lap.id}
										</td>
										<td className="px-3 py-2 font-medium text-foreground">
											{formatStopwatch(lap.splitMs)}
										</td>
										<td className="px-3 py-2 text-foreground">
											{formatStopwatch(lap.elapsedMs)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}
