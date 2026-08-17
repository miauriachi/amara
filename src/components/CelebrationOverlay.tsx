import { appConfig } from "../config/appConfig";

type Props = {
  show: boolean;
  onDone: () => void;
};

export const CelebrationOverlay = ({ show, onDone }: Props) => {
  if (!show) return null;

  return (
    <button className="celebration" type="button" aria-label="Celebración" onClick={onDone}>
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
      <strong>⭐</strong>
    </button>
  );
};
