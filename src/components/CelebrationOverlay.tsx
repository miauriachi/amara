import { Play } from "lucide-react";
import { appConfig } from "../config/appConfig";

type Props = {
  show: boolean;
  onDone: () => void;
  onReplay: () => void;
};

export const CelebrationOverlay = ({ show, onDone, onReplay }: Props) => {
  if (!show) return null;

  return (
    <div className="celebration" role="dialog" aria-modal="true" aria-label="Celebracion">
      {appConfig.enableAnimations &&
        Array.from({ length: 28 }).map((_, index) => (
          <span
            key={index}
            className="sparkle"
            style={{
              left: `${8 + ((index * 29) % 84)}%`,
              animationDelay: `${(index % 9) * 0.08}s`,
              background: appConfig.paintStyles[index % appConfig.paintStyles.length].preview,
            }}
          />
        ))}

      <div className="celebration-panel">
        <button className="celebration-close" type="button" aria-label="Cerrar celebracion" onClick={onDone}>
          ×
        </button>
        <strong className="celebration-star">⭐</strong>
        <p>Muy bien hecho Amara</p>
        <button className="celebration-play" type="button" aria-label="Repetir animacion" onClick={onReplay}>
          <Play size={54} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};
