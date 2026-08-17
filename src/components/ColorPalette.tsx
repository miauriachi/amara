import { appConfig } from "../config/appConfig";
import type { PaintStyle } from "../config/appConfig";

type Props = {
  activePaintId: string;
  onPick: (paint: PaintStyle) => void;
};

export const ColorPalette = ({ activePaintId, onPick }: Props) => (
  <div className="color-palette" aria-label="Colores">
    {appConfig.paintStyles.map((paint) => (
      <button
        key={paint.id}
        className={`color-dot ${activePaintId === paint.id ? "is-active" : ""}`}
        style={{ background: paint.preview }}
        aria-label={paint.label}
        title={paint.label}
        type="button"
        onClick={() => onPick(paint)}
      />
    ))}
  </div>
);
