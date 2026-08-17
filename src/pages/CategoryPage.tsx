import { ArrowLeft } from "lucide-react";
import { IconButton } from "../components/IconButton";
import type { Category, Drawing } from "../types/coloring";

type Props = {
  category: Category;
  onBack: () => void;
  onPick: (drawing: Drawing) => void;
};

export const CategoryPage = ({ category, onBack, onPick }: Props) => (
  <section className="page picker-page">
    <header className="top-bar">
      <IconButton label="Regresar" onClick={onBack}>
        <ArrowLeft size={38} />
      </IconButton>
      <div className="screen-title" aria-label={category.title}>
        <span>{category.emoji}</span>
        <strong>{category.title}</strong>
      </div>
    </header>

    <div className="drawing-grid">
      {category.drawings.map((drawing) => (
        <button key={drawing.id} className="drawing-card" type="button" aria-label={drawing.title} onClick={() => onPick(drawing)}>
          <img src={drawing.src} alt="" draggable={false} />
          <span>{drawing.emoji}</span>
        </button>
      ))}
    </div>
  </section>
);
