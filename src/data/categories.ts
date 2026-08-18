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
    emoji: "ðŸ¦„",
    color: "#ffd7e8",
    drawings: [makeDrawing("unicorns", "unicorn", "Unicornio", "ðŸ¦„", "unicorn.svg")],
  },
  {
    id: "animals",
    title: "Animales",
    emoji: "ðŸ¶",
    color: "#c7f2df",
    drawings: [
      makeDrawing("animals", "cat", "Gato", "ðŸ±", "cat.svg"),
      makeDrawing("animals", "dog", "Perro", "ðŸ¶", "dog.svg"),
      makeDrawing("animals", "butterfly", "Mariposa", "ðŸ¦‹", "butterfly.svg"),
      makeDrawing("animals", "turtle", "Tortuga", "ðŸ¢", "turtle.svg"),
    ],
  },
  {
    id: "dinosaurs",
    title: "Dinosaurios",
    emoji: "ðŸ¦–",
    color: "#d7f7a8",
    drawings: [
      makeDrawing("dinosaurs", "dino", "Dinosaurio", "ðŸ¦–", "dino.svg"),
      makeDrawing("dinosaurs", "baby-dino", "Dino bebÃ©", "ðŸ¥š", "baby-dino.svg"),
    ],
  },
  {
    id: "fantasy",
    title: "FantasÃ­a",
    emoji: "ðŸŒˆ",
    color: "#d9ceff",
    drawings: [
      makeDrawing("fantasy", "star", "Estrella", "â­", "star.svg"),
      makeDrawing("fantasy", "rainbow", "Arcoiris", "ðŸŒˆ", "rainbow.svg"),
      makeDrawing("fantasy", "castle", "Castillo", "ðŸ°", "castle.svg"),
    ],
  },
  {
    id: "food",
    title: "Comida",
    emoji: "ðŸ¦",
    color: "#ffe4b8",
    drawings: [
      makeDrawing("food", "ice-cream", "Helado", "ðŸ¦", "ice-cream.png"),
      makeDrawing("food", "cupcake", "Pastelito", "ðŸ§", "cupcake.svg"),
    ],
  },
  {
    id: "sea",
    title: "Mar",
    emoji: "ðŸ ",
    color: "#bfeeff",
    drawings: [
      makeDrawing("sea", "fish", "Pez", "ðŸ ", "fish.png"),
      makeDrawing("sea", "whale", "Ballena", "ðŸ³", "whale.svg"),
    ],
  },
  {
    id: "space",
    title: "Espacio",
    emoji: "ðŸš€",
    color: "#c9ddff",
    drawings: [
      makeDrawing("space", "rocket", "Cohete", "ðŸš€", "rocket.svg"),
      makeDrawing("space", "astronaut", "Astronauta", "ðŸ›¸", "astronaut.svg"),
    ],
  },
];

export const allDrawings = categories.flatMap((category) => category.drawings);

export const findDrawing = (drawingId: string) =>
  allDrawings.find((drawing) => drawing.id === drawingId);

