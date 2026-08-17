import { forwardRef, useEffect, useImperativeHandle, useRef, type PointerEvent } from "react";
import { appConfig, type PaintStyle } from "../config/appConfig";
import { loadAutosave, saveAutosave } from "../services/autosave";
import type { ToolMode } from "../types/coloring";
import { dataUrlToImageData, loadImage, makeThumbnail } from "../utils/canvas";

export type ColoringCanvasHandle = {
  undo: () => void;
  redo: () => void;
  clear: () => void;
  exportImage: () => string;
  exportThumbnail: () => string;
  playAnimation: (kind?: "happy" | "gallop") => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
};

type Props = {
  drawingSrc: string;
  backgroundSrc?: string;
  initialColorImage?: string;
  paint: PaintStyle;
  brushSize: number;
  tool: ToolMode;
  onHistoryChange: (state: { canUndo: boolean; canRedo: boolean }) => void;
};

const CANVAS_SIZE = 960;
const LINE_THRESHOLD = 95;

const barrierAt = (data: Uint8ClampedArray, index: number) =>
  data[index + 3] > 0 &&
  data[index] < LINE_THRESHOLD &&
  data[index + 1] < LINE_THRESHOLD &&
  data[index + 2] < LINE_THRESHOLD;

const makeCanvas = () => {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  return canvas;
};

const drawImageCover = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  focusY = 0.68
) => {
  const scale = Math.max(CANVAS_SIZE / image.naturalWidth, CANVAS_SIZE / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  const x = (CANVAS_SIZE - width) / 2;
  const y = (CANVAS_SIZE - height) * focusY;
  ctx.drawImage(image, x, y, width, height);
};

const keepLineArtOnly = (ctx: CanvasRenderingContext2D) => {
  const image = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  const data = image.data;

  for (let index = 0; index < data.length; index += 4) {
    const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
    if (data[index + 3] < 16 || brightness > 205) {
      data[index + 3] = 0;
      continue;
    }
    data[index] = 17;
    data[index + 1] = 17;
    data[index + 2] = 17;
    data[index + 3] = Math.max(data[index + 3], 230);
  }

  ctx.putImageData(image, 0, 0);
};

export const ColoringCanvas = forwardRef<ColoringCanvasHandle, Props>(
  ({ drawingSrc, backgroundSrc, initialColorImage, paint, brushSize, tool, onHistoryChange }, ref) => {
    const backgroundCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const drawingLayersRef = useRef<HTMLDivElement | null>(null);
    const colorCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const lineCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const strokeCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const pointerRef = useRef<{ id: number; x: number; y: number; region: HTMLCanvasElement } | null>(null);
    const undoStack = useRef<ImageData[]>([]);
    const redoStack = useRef<ImageData[]>([]);
    const rafRef = useRef<number | null>(null);

    const notifyHistory = () =>
      onHistoryChange({ canUndo: undoStack.current.length > 0, canRedo: redoStack.current.length > 0 });

    const getColorContext = () => colorCanvasRef.current?.getContext("2d", { willReadFrequently: true }) ?? null;

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      for (let point = 0; point < 10; point += 1) {
        const angle = -Math.PI / 2 + (point * Math.PI) / 5;
        const radius = point % 2 === 0 ? size : size * 0.42;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        if (point === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    };

    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y + size * 0.45);
      ctx.bezierCurveTo(x - size, y - size * 0.25, x - size * 0.3, y - size, x, y - size * 0.28);
      ctx.bezierCurveTo(x + size * 0.3, y - size, x + size, y - size * 0.25, x, y + size * 0.45);
      ctx.fill();
    };

    const makePaint = (ctx: CanvasRenderingContext2D): string | CanvasGradient | CanvasPattern => {
      if (paint.kind === "solid") return paint.color;

      if (["rainbow", "galaxy", "gold", "ice"].includes(paint.kind)) {
        const gradient = ctx.createLinearGradient(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        const stops =
          paint.kind === "rainbow"
            ? ["#ff5c7a", "#ff9a3c", "#ffe35b", "#77df9b", "#6fc8ff", "#b997ff"]
            : paint.kind === "galaxy"
              ? ["#24124f", "#6b4bff", "#ff78bd", "#5ed7ff"]
              : paint.kind === "gold"
                ? ["#fff4a3", "#f6b93b", "#fff0a8"]
                : ["#ffffff", "#bdefff", "#7ed6ff"];
        stops.forEach((stop, index) => gradient.addColorStop(index / (stops.length - 1), stop));
        return gradient;
      }

      const patternCanvas = document.createElement("canvas");
      patternCanvas.width = 112;
      patternCanvas.height = 112;
      const patternCtx = patternCanvas.getContext("2d");
      if (!patternCtx) return paint.color;

      const fillGradient = (from: string, to: string) => {
        const gradient = patternCtx.createLinearGradient(0, 0, 112, 112);
        gradient.addColorStop(0, from);
        gradient.addColorStop(1, to);
        patternCtx.fillStyle = gradient;
        patternCtx.fillRect(0, 0, 112, 112);
      };

      if (paint.kind === "candy") {
        patternCtx.fillStyle = "#ffffff";
        patternCtx.fillRect(0, 0, 112, 112);
        patternCtx.lineWidth = 20;
        ["#ff7fbd", "#6fc8ff", "#ffd84d"].forEach((stripe, stripeIndex) => {
          patternCtx.strokeStyle = stripe;
          for (let offset = -112 + stripeIndex * 28; offset < 224; offset += 84) {
            patternCtx.beginPath();
            patternCtx.moveTo(offset, 112);
            patternCtx.lineTo(offset + 112, 0);
            patternCtx.stroke();
          }
        });
      }

      if (paint.kind === "sparkles") {
        fillGradient("#ff9fce", "#b997ff");
        patternCtx.fillStyle = "rgba(255,255,255,0.9)";
        [[26, 24, 9], [78, 35, 5], [54, 82, 7]].forEach(([x, y, radius]) => {
          patternCtx.beginPath();
          patternCtx.arc(x, y, radius, 0, Math.PI * 2);
          patternCtx.fill();
        });
      }

      if (paint.kind === "stars" || paint.kind === "nightSky") {
        fillGradient(paint.kind === "nightSky" ? "#141a46" : "#ffd84d", paint.kind === "nightSky" ? "#4255c8" : "#ff9fce");
        patternCtx.fillStyle = paint.kind === "nightSky" ? "#fff8b5" : "#ffffff";
        [[26, 28], [72, 68], [90, 24]].forEach(([x, y]) => drawStar(patternCtx, x, y, 12));
      }

      if (paint.kind === "mermaid") {
        fillGradient("#3ad7c1", "#b997ff");
        patternCtx.strokeStyle = "rgba(255,255,255,0.75)";
        patternCtx.lineWidth = 4;
        for (let y = 18; y < 128; y += 28) {
          for (let x = -14; x < 128; x += 28) {
            patternCtx.beginPath();
            patternCtx.arc(x, y, 17, 0, Math.PI);
            patternCtx.stroke();
          }
        }
      }

      if (paint.kind === "flowers") {
        fillGradient("#77df9b", "#d7ff9b");
        const flowers: Array<[number, number, string]> = [
          [32, 36, "#ff7fbd"],
          [78, 78, "#ffd84d"],
        ];
        flowers.forEach(([x, y, color]) => {
          patternCtx.fillStyle = color;
          for (let petal = 0; petal < 6; petal += 1) {
            const angle = (petal * Math.PI) / 3;
            patternCtx.beginPath();
            patternCtx.arc(x + Math.cos(angle) * 9, y + Math.sin(angle) * 9, 7, 0, Math.PI * 2);
            patternCtx.fill();
          }
          patternCtx.fillStyle = "#ffffff";
          patternCtx.beginPath();
          patternCtx.arc(x, y, 5, 0, Math.PI * 2);
          patternCtx.fill();
        });
      }

      if (paint.kind === "confetti") {
        patternCtx.fillStyle = "#ffffff";
        patternCtx.fillRect(0, 0, 112, 112);
        ["#ff5c7a", "#6fc8ff", "#ffd84d", "#77df9b", "#b997ff"].forEach((confetti, index) => {
          patternCtx.fillStyle = confetti;
          patternCtx.save();
          patternCtx.translate(20 + ((index * 19) % 82), 20 + ((index * 31) % 82));
          patternCtx.rotate(index * 0.9);
          patternCtx.fillRect(-5, -10, 10, 20);
          patternCtx.restore();
        });
      }

      if (paint.kind === "hearts") {
        fillGradient("#ffe1ef", "#ff9fce");
        patternCtx.fillStyle = "#ff5c7a";
        drawHeart(patternCtx, 32, 42, 13);
        patternCtx.fillStyle = "#ffffff";
        drawHeart(patternCtx, 78, 78, 11);
      }

      if (paint.kind === "bubbles") {
        fillGradient("#85ddff", "#d9ceff");
        patternCtx.strokeStyle = "rgba(255,255,255,0.9)";
        patternCtx.lineWidth = 5;
        [[30, 34, 13], [76, 72, 17], [88, 30, 9]].forEach(([x, y, radius]) => {
          patternCtx.beginPath();
          patternCtx.arc(x, y, radius, 0, Math.PI * 2);
          patternCtx.stroke();
        });
      }

      return ctx.createPattern(patternCanvas, "repeat") ?? paint.color;
    };

    const snapshot = () => {
      const ctx = getColorContext();
      if (!ctx) return;
      undoStack.current.push(ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE));
      if (undoStack.current.length > appConfig.maxUndoSteps) undoStack.current.shift();
      redoStack.current = [];
      notifyHistory();
    };

    const autosave = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const canvas = colorCanvasRef.current;
        if (canvas) saveAutosave(drawingSrc, canvas.toDataURL("image/png"));
      });
    };

    const restoreImageData = (imageData: ImageData) => {
      const ctx = getColorContext();
      if (!ctx) return;
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      ctx.putImageData(imageData, 0, 0);
      autosave();
    };

    const makeComposedCanvas = () => {
      const output = makeCanvas();
      const ctx = output.getContext("2d");
      const backgroundCanvas = backgroundCanvasRef.current;
      const colorCanvas = colorCanvasRef.current;
      const lineCanvas = lineCanvasRef.current;
      if (!ctx || !colorCanvas || !lineCanvas) return output;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      if (backgroundCanvas) ctx.drawImage(backgroundCanvas, 0, 0);
      ctx.drawImage(colorCanvas, 0, 0);
      ctx.drawImage(lineCanvas, 0, 0);
      return output;
    };

    const exportColorLayer = () => colorCanvasRef.current?.toDataURL("image/png") ?? "";

    const buildRegionMask = (startX: number, startY: number) => {
      const maskCtx = maskCanvasRef.current?.getContext("2d", { willReadFrequently: true });
      if (!maskCtx) return null;

      const x = Math.max(0, Math.min(CANVAS_SIZE - 1, startX));
      const y = Math.max(0, Math.min(CANVAS_SIZE - 1, startY));
      const mask = maskCtx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      const startIndex = (y * CANVAS_SIZE + x) * 4;
      if (barrierAt(mask.data, startIndex)) return null;

      const region = makeCanvas();
      const regionCtx = region.getContext("2d", { willReadFrequently: true });
      if (!regionCtx) return null;

      const regionImage = regionCtx.createImageData(CANVAS_SIZE, CANVAS_SIZE);
      const stack = [[x, y]];
      const visited = new Uint8Array(CANVAS_SIZE * CANVAS_SIZE);
      let touchesCanvasEdge = false;

      while (stack.length) {
        const item = stack.pop();
        if (!item) continue;
        const [px, py] = item;
        if (px < 0 || py < 0 || px >= CANVAS_SIZE || py >= CANVAS_SIZE) continue;
        const offset = py * CANVAS_SIZE + px;
        if (visited[offset]) continue;
        visited[offset] = 1;
        const index = offset * 4;
        if (barrierAt(mask.data, index)) continue;
        if (px === 0 || py === 0 || px === CANVAS_SIZE - 1 || py === CANVAS_SIZE - 1) touchesCanvasEdge = true;

        regionImage.data[index] = 255;
        regionImage.data[index + 1] = 255;
        regionImage.data[index + 2] = 255;
        regionImage.data[index + 3] = 255;
        stack.push([px + 1, py], [px - 1, py], [px, py + 1], [px, py - 1]);
      }

      if (touchesCanvasEdge) return null;
      regionCtx.putImageData(regionImage, 0, 0);
      return region;
    };

    useImperativeHandle(ref, () => ({
      undo: () => {
        const ctx = getColorContext();
        if (!ctx || undoStack.current.length === 0) return;
        redoStack.current.push(ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE));
        const previous = undoStack.current.pop();
        if (previous) restoreImageData(previous);
        notifyHistory();
      },
      redo: () => {
        const ctx = getColorContext();
        if (!ctx || redoStack.current.length === 0) return;
        undoStack.current.push(ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE));
        const next = redoStack.current.pop();
        if (next) restoreImageData(next);
        notifyHistory();
      },
      clear: () => {
        const ctx = getColorContext();
        if (!ctx) return;
        snapshot();
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        autosave();
      },
      exportImage: exportColorLayer,
      exportThumbnail: () => makeThumbnail(makeComposedCanvas()),
      playAnimation: (kind = "happy") => {
        const layers = drawingLayersRef.current;
        if (!layers) return;
        layers.classList.remove("is-celebrating", "is-galloping");
        void layers.offsetWidth;
        layers.classList.add(kind === "gallop" ? "is-galloping" : "is-celebrating");
        window.setTimeout(() => layers.classList.remove("is-celebrating", "is-galloping"), kind === "gallop" ? 3400 : 2600);
      },
      canUndo: () => undoStack.current.length > 0,
      canRedo: () => redoStack.current.length > 0,
    }));

    useEffect(() => {
      let cancelled = false;

      const setup = async () => {
        const [lineImage, backgroundImage, savedImageData] = await Promise.all([
          loadImage(drawingSrc),
          backgroundSrc ? loadImage(backgroundSrc) : Promise.resolve(undefined),
          initialColorImage
            ? dataUrlToImageData(initialColorImage, CANVAS_SIZE, CANVAS_SIZE)
            : loadAutosave(drawingSrc)
              ? dataUrlToImageData(loadAutosave(drawingSrc)!, CANVAS_SIZE, CANVAS_SIZE)
              : Promise.resolve(undefined),
        ]);
        if (cancelled) return;

        const backgroundCanvas = backgroundCanvasRef.current;
        const lineCanvas = lineCanvasRef.current;
        const maskCanvas = maskCanvasRef.current;
        const colorCanvas = colorCanvasRef.current;
        const backgroundCtx = backgroundCanvas?.getContext("2d");
        const lineCtx = lineCanvas?.getContext("2d");
        const maskCtx = maskCanvas?.getContext("2d", { willReadFrequently: true });
        const colorCtx = colorCanvas?.getContext("2d", { willReadFrequently: true });
        if (
          !backgroundCanvas ||
          !lineCanvas ||
          !maskCanvas ||
          !colorCanvas ||
          !backgroundCtx ||
          !lineCtx ||
          !maskCtx ||
          !colorCtx
        ) {
          return;
        }

        [backgroundCanvas, lineCanvas, maskCanvas, colorCanvas].forEach((canvas) => {
          canvas.width = CANVAS_SIZE;
          canvas.height = CANVAS_SIZE;
        });

        backgroundCtx.fillStyle = "#ffffff";
        backgroundCtx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        if (backgroundImage) {
          backgroundCtx.save();
          backgroundCtx.globalAlpha = 0.2;
          drawImageCover(backgroundCtx, backgroundImage);
          backgroundCtx.restore();
          backgroundCtx.fillStyle = "rgba(255, 255, 255, 0.68)";
          backgroundCtx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        }

        colorCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        if (savedImageData) colorCtx.putImageData(savedImageData, 0, 0);

        lineCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        lineCtx.drawImage(lineImage, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
        keepLineArtOnly(lineCtx);
        maskCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        maskCtx.drawImage(lineCanvas, 0, 0);

        undoStack.current = [];
        redoStack.current = [];
        notifyHistory();
      };

      setup().catch(() => undefined);
      return () => {
        cancelled = true;
      };
    }, [drawingSrc, backgroundSrc, initialColorImage]);

    const pointFromEvent = (event: PointerEvent<HTMLCanvasElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      return {
        x: Math.round(((event.clientX - rect.left) / rect.width) * CANVAS_SIZE),
        y: Math.round(((event.clientY - rect.top) / rect.height) * CANVAS_SIZE),
      };
    };

    const drawTo = (x: number, y: number) => {
      const ctx = getColorContext();
      const previous = pointerRef.current;
      if (!ctx || !previous) return;

      const strokeCanvas = strokeCanvasRef.current ?? makeCanvas();
      strokeCanvasRef.current = strokeCanvas;
      const strokeCtx = strokeCanvas.getContext("2d");
      if (!strokeCtx) return;

      strokeCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      strokeCtx.save();
      strokeCtx.lineCap = "round";
      strokeCtx.lineJoin = "round";
      strokeCtx.lineWidth = brushSize;
      strokeCtx.strokeStyle = tool === "eraser" ? "#000000" : makePaint(strokeCtx);
      strokeCtx.beginPath();
      strokeCtx.moveTo(previous.x, previous.y);
      strokeCtx.lineTo(x, y);
      strokeCtx.stroke();
      strokeCtx.globalCompositeOperation = "destination-in";
      strokeCtx.drawImage(previous.region, 0, 0);
      strokeCtx.restore();

      ctx.save();
      if (tool === "eraser") ctx.globalCompositeOperation = "destination-out";
      ctx.drawImage(strokeCanvas, 0, 0);
      ctx.restore();
      pointerRef.current = { ...previous, x, y };
    };

    const floodFill = (startX: number, startY: number) => {
      const ctx = getColorContext();
      if (!ctx) return;
      const region = buildRegionMask(startX, startY);
      if (!region) return;

      const fillCanvas = makeCanvas();
      const fillCtx = fillCanvas.getContext("2d");
      if (!fillCtx) return;
      fillCtx.fillStyle = makePaint(fillCtx);
      fillCtx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      fillCtx.globalCompositeOperation = "destination-in";
      fillCtx.drawImage(region, 0, 0);
      ctx.drawImage(fillCanvas, 0, 0);
      autosave();
    };

    const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      const point = pointFromEvent(event);
      snapshot();
      if (tool === "fill") {
        floodFill(point.x, point.y);
        return;
      }
      const region = buildRegionMask(point.x, point.y);
      if (!region) return;
      pointerRef.current = { id: event.pointerId, x: point.x, y: point.y, region };
      drawTo(point.x + 0.1, point.y + 0.1);
    };

    const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
      if (!pointerRef.current || pointerRef.current.id !== event.pointerId || tool === "fill") return;
      event.preventDefault();
      const point = pointFromEvent(event);
      drawTo(point.x, point.y);
    };

    const onPointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
      if (pointerRef.current?.id !== event.pointerId) return;
      pointerRef.current = null;
      autosave();
    };

    return (
      <div className="canvas-stage">
        <canvas ref={backgroundCanvasRef} className="background-layer" aria-hidden />
        <div className="gallop-dust" aria-hidden />
        <div ref={drawingLayersRef} className="drawing-layers">
          <canvas ref={colorCanvasRef} className="paint-layer" aria-hidden />
          <canvas ref={lineCanvasRef} className="line-layer" aria-hidden />
        </div>
        <canvas
          className="touch-layer"
          aria-label="Area para colorear"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        <canvas ref={maskCanvasRef} className="hidden-canvas" aria-hidden />
      </div>
    );
  }
);
