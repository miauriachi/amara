import { Play } from "lucide-react";
import { appConfig } from "../config/appConfig";

type Props = {
  show: boolean;
  onDone: () => void;
  onContinue: () => void;
};

export const CelebrationOverlay = ({ show, onDone, onContinue }: Props) => {
  if (!show) return null;

  return (
    <div className="celebration" role="status" aria-label="Muy bien hecho Amara">
      {appConfig.enableAnimations &&
        Array.from({ length: 22 }).map((_, index) => (
          <span
            key={index}
            className="sparkle"
            style={{
              left: `${8 + ((index * 31) % 84)}%`,
              animationDelay: `${(index % 9) * 0.08}s`,
              background: appConfig.paintStyles[index % appConfig.paintStyles.length].preview,
            }}
          />
        ))}

      <div className="celebration-banner">
        <button className="celebration-close" type="button" aria-label="Cerrar celebracion" onClick={onDone}>
          ×
        </button>
        <strong className="celebration-star">⭐</strong>
        <p>Muy bien hecho Amara</p>
        <button className="celebration-play" type="button" aria-label="Continuar" onClick={onContinue}>
          <Play size={48} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};
