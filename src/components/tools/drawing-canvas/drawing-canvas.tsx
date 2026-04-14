"use client";

import type { FabricObject } from "fabric";
import { type Canvas, Circle, PencilBrush, Rect } from "fabric";
import { useCallback, useEffect, useRef, useState } from "react";
import { CanvasArea } from "./canvas-area";
import { CanvasToolbar } from "./canvas-toolbar";

type Tool = "pencil" | "eraser" | "rectangle" | "circle";

function makePencilCursor(): string {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path d="M12 1L15 4L4 15L1 12Z" stroke="white" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
    <path d="M12 1L15 4L4 15L1 12Z" fill="#111"/>
    <polygon points="1,12 4,15 0,16" fill="#d4a010" stroke="white" stroke-width="0.5" stroke-linejoin="round"/>
  </svg>`;
	return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 1 15, crosshair`;
}

function makeEraserCursor(brushSize: number): string {
	const size = Math.max(8, Math.min(brushSize * 3, 128));
	const half = Math.round(size / 2);
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect x="0.5" y="0.5" width="${size - 1}" height="${size - 1}" fill="white" stroke="#666" stroke-width="1"/></svg>`;
	return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${half} ${half}, crosshair`;
}

export function DrawingCanvas() {
	const [currentTool, setCurrentTool] = useState<Tool>("pencil");
	const [brushSize, setBrushSize] = useState(4);
	const [color, setColor] = useState("#000000");
	const [isGridEnabled, setIsGridEnabled] = useState(false);
	const [isTransparentExport, setIsTransparentExport] = useState(false);
	const [isCanvasReady, setIsCanvasReady] = useState(false);

	const canvasRef = useRef<Canvas | null>(null);
	const shapeRef = useRef<FabricObject | null>(null);
	const isDrawingShapeRef = useRef(false);
	const startPointRef = useRef({ x: 0, y: 0 });
	const isTransparentRef = useRef(false);

	isTransparentRef.current = isTransparentExport;

	const handleCanvasReady = useCallback((canvas: Canvas) => {
		canvasRef.current = canvas;
		setIsCanvasReady(true);
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !isCanvasReady) return;

		canvas.off("mouse:down");
		canvas.off("mouse:move");
		canvas.off("mouse:up");

		if (currentTool === "pencil") {
			canvas.isDrawingMode = true;
			canvas.selection = false;
			const brush = new PencilBrush(canvas);
			brush.width = brushSize;
			brush.color = color;
			canvas.freeDrawingBrush = brush;
			canvas.freeDrawingCursor = makePencilCursor();
		} else if (currentTool === "eraser") {
			canvas.isDrawingMode = true;
			canvas.selection = false;
			const brush = new PencilBrush(canvas);
			brush.width = brushSize * 3;
			brush.color = "#ffffff";
			canvas.freeDrawingBrush = brush;
			canvas.freeDrawingCursor = makeEraserCursor(brushSize);
		} else {
			canvas.isDrawingMode = false;
			canvas.selection = false;
			canvas.defaultCursor = "crosshair";

			canvas.on("mouse:down", (opt) => {
				if (opt.target) return;

				const pointer = opt.scenePoint;
				isDrawingShapeRef.current = true;
				startPointRef.current = { x: pointer.x, y: pointer.y };

				if (currentTool === "rectangle") {
					const rect = new Rect({
						left: pointer.x,
						top: pointer.y,
						width: 0,
						height: 0,
						fill: color,
						selectable: true,
						originX: "left",
						originY: "top",
					});
					canvas.add(rect);
					shapeRef.current = rect;
				} else {
					const circle = new Circle({
						left: pointer.x,
						top: pointer.y,
						radius: 1,
						fill: color,
						selectable: true,
						originX: "left",
						originY: "top",
					});
					canvas.add(circle);
					shapeRef.current = circle;
				}
			});

			canvas.on("mouse:move", (opt) => {
				if (!isDrawingShapeRef.current || !shapeRef.current) return;

				const pointer = opt.scenePoint;
				const start = startPointRef.current;

				if (currentTool === "rectangle") {
					const rect = shapeRef.current as Rect;
					rect.set({
						left: Math.min(pointer.x, start.x),
						top: Math.min(pointer.y, start.y),
						width: Math.abs(pointer.x - start.x),
						height: Math.abs(pointer.y - start.y),
					});
					rect.setCoords();
				} else {
					const circle = shapeRef.current as Circle;
					const dx = Math.abs(pointer.x - start.x);
					const dy = Math.abs(pointer.y - start.y);
					const radius = Math.max(1, Math.max(dx, dy) / 2);
					circle.set({
						left: Math.min(pointer.x, start.x),
						top: Math.min(pointer.y, start.y),
						radius,
					});
					circle.setCoords();
				}

				canvas.renderAll();
			});

			canvas.on("mouse:up", () => {
				isDrawingShapeRef.current = false;
				shapeRef.current = null;
			});
		}
	}, [isCanvasReady, currentTool, brushSize, color]);

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key !== "Delete" && e.key !== "Backspace") return;
			if (
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement
			)
				return;

			const canvas = canvasRef.current;
			if (!canvas) return;

			const active = canvas.getActiveObject();
			if (active) {
				canvas.remove(active);
				canvas.discardActiveObject();
				canvas.renderAll();
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	function handleClear() {
		const canvas = canvasRef.current;
		if (!canvas) return;
		canvas.clear();
		canvas.backgroundColor = "#ffffff";
		canvas.renderAll();
	}

	function handleExport() {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const originalBg = canvas.backgroundColor as string;

		if (isTransparentRef.current) {
			canvas.backgroundColor = "";
			canvas.renderAll();
		}

		const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });

		if (isTransparentRef.current) {
			canvas.backgroundColor = originalBg;
			canvas.renderAll();
		}

		const link = document.createElement("a");
		link.href = dataUrl;
		link.download = "desenho.png";
		link.click();
	}

	return (
		<div className="flex flex-col gap-4 lg:flex-row lg:items-start">
			<CanvasToolbar
				currentTool={currentTool}
				brushSize={brushSize}
				color={color}
				isGridEnabled={isGridEnabled}
				isTransparentExport={isTransparentExport}
				onToolChange={setCurrentTool}
				onBrushSizeChange={setBrushSize}
				onColorChange={setColor}
				onClear={handleClear}
				onExport={handleExport}
				onToggleGrid={() => setIsGridEnabled((v) => !v)}
				onToggleTransparent={() => setIsTransparentExport((v) => !v)}
			/>
			<CanvasArea onReady={handleCanvasReady} isGridEnabled={isGridEnabled} />
		</div>
	);
}
