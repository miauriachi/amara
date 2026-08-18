import { Images } from "lucide-react";
import { appConfig } from "../config/appConfig";
import { categories } from "../data/categories";

type Props = {
  onCategory: (categoryId: string) => void;
  onGallery: () => void;
};

export const HomePage = ({ onCategory, onGallery }: Props) => (
  <section className="page home-page">
    <header className="home-header">
      <h1>{appConfig.appName}</h1>
      <button className="gallery-card" type="button" aria-label="Mis dibujos" onClick={onGallery}>
        <Images size={48} aria-hidden />
        <span>{"\u2B50"}</span>
      </button>
    </header>

    <div className="category-grid">
      {categories.map((category) => (
        <button
          key={category.id}
          className="category-card"
          style={{ background: category.color }}
          type="button"
          aria-label={category.title}
          onClick={() => onCategory(category.id)}
        >
          <span className="category-emoji">{category.emoji}</span>
          <span className="category-title">{category.title}</span>
        </button>
      ))}
      <button className="category-card saved-card" type="button" aria-label="Mis dibujos" onClick={onGallery}>
        <span className="category-emoji">{"\u2B50"}</span>
        <span className="category-title">Mis dibujos</span>
      </button>
    </div>
  </section>
);
