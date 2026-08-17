import { backgrounds, type ColoringBackground } from "../data/backgrounds";

type Props = {
  activeBackgroundId: string;
  onPick: (background: ColoringBackground) => void;
};

export const BackgroundPicker = ({ activeBackgroundId, onPick }: Props) => (
  <div className="background-picker" aria-label="Fondos">
    {backgrounds.map((background) => (
      <button
        key={background.id}
        className={`background-dot ${activeBackgroundId === background.id ? "is-active" : ""}`}
        type="button"
        aria-label={background.label}
        title={background.label}
        onClick={() => onPick(background)}
      >
        {background.src ? <img src={background.src} alt="" draggable={false} /> : <span>{background.emoji}</span>}
      </button>
    ))}
  </div>
);
