import { ArrowLeft, Brush, Check, Eraser, PaintBucket, Redo2, RotateCcw, Save, Trash2, Undo2 } from "lucide-react";
import { type CSSProperties, useRef, useState } from "react";
import { BackgroundPicker } from "../components/BackgroundPicker";
import { BrushSizeControl } from "../components/BrushSizeControl";
import { CelebrationOverlay } from "../components/CelebrationOverlay";
import { ColorPalette } from "../components/ColorPalette";
import { ColoringCanvas, type ColoringCanvasHandle } from "../components/ColoringCanvas";
import { ConfirmModal } from "../components/ConfirmModal";
import { IconButton } from "../components/IconButton";
import { appConfig } from "../config/appConfig";
import { findBackground } from "../data/backgrounds";
import { clearAutosave } from "../services/autosave";
import { saveDrawingRecord } from "../services/db";
import { playGallopSound, playHappySound } from "../services/sound";
import type { Drawing, SavedDrawing, ToolMode } from "../types/coloring";

type Props = {
  drawing: Drawing;
  savedDrawing?: SavedDrawing;
  onBack: () => void;
  onDoneContinue: () => void;
};

export const ColoringPage = ({ drawing, savedDrawing, onBack, onDoneContinue }: Props) => {
  const canvasRef = useRef<ColoringCanvasHandle | null>(null);
  const [activePaint, setActivePaint] = useState(appConfig.paintStyles[0]);
  const [activeBackground, setActiveBackground] = useState(findBackground(savedDrawing?.backgroundId));
  const [tool, setTool] = useState<ToolMode>("brush");
  const [brushSize, setBrushSize] = useState(appConfig.defaultBrushSize);
  const [history, setHistory] = useState({ canUndo: false, canRedo: false });
  const [confirmClear, setConfirmClear] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [savedPulse, setSavedPulse] = useState(false);

  const save = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const now = new Date().toISOString();
    await saveDrawingRecord({
      id: savedDrawing?.id ?? crypto.randomUUID(),
      drawingId: drawing.id,
      drawingSrc: drawing.src,
      backgroundId: activeBackground.id,
      colorImage: canvas.exportImage(),
      thumbnail: canvas.exportThumbnail(),
      createdAt: savedDrawing?.createdAt ?? now,
      updatedAt: now,
    });
    clearAutosave(drawing.src);
    setSavedPulse(true);
    window.setTimeout(() => setSavedPulse(false), 900);
  };

  const finish = async () => {
    await save();
    playFinishAnimation();
    setCelebrate(true);
  };

  const playFinishAnimation = () => {
    const animationKind = drawing.id === "unicorn" ? "gallop" : "happy";
    canvasRef.current?.playAnimation(animationKind);
    if (animationKind === "gallop") playGallopSound();
    else playHappySound();
  };

  const pageStyle = activeBackground.src
    ? ({
        "--scene-image": `url("${activeBackground.src}")`,
      } as CSSProperties)
    : undefined;

  return (
    <section className={`coloring-page ${activeBackground.src ? "has-scene" : ""}`} style={pageStyle} aria-label={drawing.title}>
      <header className="editor-top">
        <IconButton label="Regresar" onClick={onBack}>
          <ArrowLeft size={36} />
        </IconButton>
        <IconButton label="Pincel" active={tool === "brush"} onClick={() => setTool("brush")}>
          <Brush size={34} />
        </IconButton>
        <IconButton label="Rellenar" active={tool === "fill"} onClick={() => setTool("fill")}>
          <PaintBucket size={34} />
        </IconButton>
        <IconButton label="Borrador" active={tool === "eraser"} onClick={() => setTool("eraser")}>
          <Eraser size={34} />
        </IconButton>
        <BrushSizeControl size={brushSize} onChange={setBrushSize} />
        <IconButton label="Deshacer" disabled={!history.canUndo} onClick={() => canvasRef.current?.undo()}>
          <Undo2 size={34} />
        </IconButton>
        <IconButton label="Rehacer" disabled={!history.canRedo} onClick={() => canvasRef.current?.redo()}>
          <Redo2 size={34} />
        </IconButton>
        <IconButton label="Limpiar" onClick={() => setConfirmClear(true)}>
          <Trash2 size={34} />
        </IconButton>
        <IconButton label="Guardar" className={savedPulse ? "pulse-save" : ""} onClick={save}>
          <Save size={34} />
        </IconButton>
        <IconButton label="Terminé" className="done-button" onClick={finish}>
          <Check size={38} />
        </IconButton>
      </header>

      <ColoringCanvas
        ref={canvasRef}
        drawingSrc={drawing.src}
        backgroundSrc={activeBackground.src}
        initialColorImage={savedDrawing?.colorImage}
        paint={activePaint}
        brushSize={brushSize}
        tool={tool}
        onHistoryChange={setHistory}
      />

      <footer className="editor-bottom">
        <IconButton label="Reiniciar vista" onClick={() => setTool("brush")}>
          <RotateCcw size={30} />
        </IconButton>
        <BackgroundPicker activeBackgroundId={activeBackground.id} onPick={setActiveBackground} />
        <ColorPalette activePaintId={activePaint.id} onPick={setActivePaint} />
      </footer>

      <ConfirmModal
        open={confirmClear}
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          canvasRef.current?.clear();
          setConfirmClear(false);
        }}
      />
      <CelebrationOverlay show={celebrate} onDone={() => setCelebrate(false)} onContinue={onDoneContinue} />
    </section>
  );
};
