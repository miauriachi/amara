import type { Category, Drawing } from "../types/coloring";
import { assetUrl } from "../utils/assets";

const makeDrawing = (
  categoryId: string,
  id: string,
  title: string,
  emoji: string,
  fileName: string
): Drawing => ({
  id,
  title,
  emoji,
  src: assetUrl(`coloring/${categoryId}/${fileName}`),
  categoryId,
});

export const categories: Category[] = [
  {
    id: "unicorns",
    title: "Unicornios",
    emoji: "🦄",
    color: "#ffd7e8",
    drawings: [makeDrawing("unicorns", "unicorn", "Unicornio", "🦄", "unicorn.png")],
  },
  {
    id: "animals",
    title: "Animales",
    emoji: "🐶",
    color: "#c7f2df",
    drawings: [
      makeDrawing("animals", "cat", "Gato", "🐱", "cat.png"),
      makeDrawing("animals", "dog", "Perro", "🐶", "dog.png"),
      makeDrawing("animals", "butterfly", "Mariposa", "🦋", "butterfly.svg"),
      makeDrawing("animals", "turtle", "Tortuga", "🐢", "turtle.svg"),
    ],
  },
  {
    id: "dinosaurs",
    title: "Dinosaurios",
    emoji: "🦖",
    color: "#d7f7a8",
    drawings: [
      makeDrawing("dinosaurs", "dino", "Dinosaurio", "🦖", "dino.svg"),
      makeDrawing("dinosaurs", "baby-dino", "Dino bebé", "🥚", "baby-dino.svg"),
    ],
  },
  {
    id: "fantasy",
    title: "Fantasía",
    emoji: "🌈",
    color: "#d9ceff",
    drawings: [
      makeDrawing("fantasy", "star", "Estrella", "⭐", "star.svg"),
      makeDrawing("fantasy", "rainbow", "Arcoiris", "🌈", "rainbow.svg"),
      makeDrawing("fantasy", "castle", "Castillo", "🏰", "castle.svg"),
    ],
  },
  {
    id: "food",
    title: "Comida",
    emoji: "🍦",
    color: "#ffe4b8",
    drawings: [
      makeDrawing("food", "ice-cream", "Helado", "🍦", "ice-cream.png"),
      makeDrawing("food", "cupcake", "Pastelito", "🧁", "cupcake.svg"),
    ],
  },
  {
    id: "sea",
    title: "Mar",
    emoji: "🐠",
    color: "#bfeeff",
    drawings: [
      makeDrawing("sea", "fish", "Pez", "🐠", "fish.png"),
      makeDrawing("sea", "whale", "Ballena", "🐳", "whale.svg"),
    ],
  },
  {
    id: "space",
    title: "Espacio",
    emoji: "🚀",
    color: "#c9ddff",
    drawings: [
      makeDrawing("space", "rocket", "Cohete", "🚀", "rocket.png"),
      makeDrawing("space", "ufo", "Nave", "🛸", "ufo.svg"),
    ],
  },
];

export const allDrawings = categories.flatMap((category) => category.drawings);

export const findDrawing = (drawingId: string) =>
  allDrawings.find((drawing) => drawing.id === drawingId);
