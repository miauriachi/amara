import { ArrowLeft, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { IconButton } from "../components/IconButton";
import { deleteSavedDrawing, getSavedDrawings } from "../services/db";
import type { SavedDrawing } from "../types/coloring";

type Props = {
  onBack: () => void;
  onOpen: (drawing: SavedDrawing) => void;
};

export const GalleryPage = ({ onBack, onOpen }: Props) => {
  const [items, setItems] = useState<SavedDrawing[]>([]);

  useEffect(() => {
    getSavedDrawings().then(setItems).catch(() => setItems([]));
  }, []);

  const remove = async (id: string) => {
    await deleteSavedDrawing(id);
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <section className="page picker-page">
      <header className="top-bar">
        <IconButton label="Regresar" onClick={onBack}>
          <ArrowLeft size={38} />
        </IconButton>
        <div className="screen-title" aria-label="Mis dibujos">
          <span>⭐</span>
          <strong>Mis dibujos</strong>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="empty-gallery" aria-label="Sin dibujos guardados">
          <span>🎨</span>
        </div>
      ) : (
        <div className="drawing-grid">
          {items.map((item) => (
            <article className="saved-drawing-card" key={item.id}>
              <button type="button" aria-label="Abrir dibujo guardado" onClick={() => onOpen(item)}>
                <img src={item.thumbnail} alt="" draggable={false} />
              </button>
              <IconButton label="Borrar dibujo guardado" onClick={() => remove(item.id)}>
                <Trash2 size={30} />
              </IconButton>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
