import type { Category, Drawing } from "../types/coloring";
import { assetUrl } from "../utils/assets";

const icons = {
  unicorn: "\uD83E\uDD84",
  dog: "\uD83D\uDC36",
  cat: "\uD83D\uDC31",
  butterfly: "\uD83E\uDD8B",
  turtle: "\uD83D\uDC22",
  dino: "\uD83E\uDD96",
  egg: "\uD83E\uDD5A",
  rainbow: "\uD83C\uDF08",
  star: "\u2B50",
  castle: "\uD83C\uDFF0",
  iceCream: "\uD83C\uDF66",
  cupcake: "\uD83E\uDDC1",
  fish: "\uD83D\uDC20",
  whale: "\uD83D\uDC33",
  rocket: "\uD83D\uDE80",
  astronaut: "\uD83E\uDDD1\u200D\uD83D\uDE80",
  music: "\uD83C\uDFA4",
  sparkle: "\u2728",
  heart: "\uD83D\uDC95",
};

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
    emoji: icons.unicorn,
    color: "#ffd7e8",
    drawings: [makeDrawing("unicorns", "unicorn", "Unicornio", icons.unicorn, "unicorn.svg")],
  },
  {
    id: "animals",
    title: "Animales",
    emoji: icons.dog,
    color: "#c7f2df",
    drawings: [
      makeDrawing("animals", "cat", "Gato", icons.cat, "cat.svg"),
      makeDrawing("animals", "dog", "Perro", icons.dog, "dog.svg"),
      makeDrawing("animals", "butterfly", "Mariposa", icons.butterfly, "butterfly.svg"),
      makeDrawing("animals", "turtle", "Tortuga", icons.turtle, "turtle.svg"),
    ],
  },
  {
    id: "dinosaurs",
    title: "Dinosaurios",
    emoji: icons.dino,
    color: "#d7f7a8",
    drawings: [
      makeDrawing("dinosaurs", "dino", "Dinosaurio", icons.dino, "dino.svg"),
      makeDrawing("dinosaurs", "baby-dino", "Dino bebe", icons.egg, "baby-dino.svg"),
    ],
  },
  {
    id: "fantasy",
    title: "Fantasia",
    emoji: icons.rainbow,
    color: "#d9ceff",
    drawings: [
      makeDrawing("fantasy", "star", "Estrella", icons.star, "star.svg"),
      makeDrawing("fantasy", "rainbow", "Arcoiris", icons.rainbow, "rainbow.svg"),
      makeDrawing("fantasy", "castle", "Castillo", icons.castle, "castle.svg"),
    ],
  },
  {
    id: "food",
    title: "Comida",
    emoji: icons.iceCream,
    color: "#ffe4b8",
    drawings: [
      makeDrawing("food", "ice-cream", "Helado", icons.iceCream, "ice-cream.png"),
      makeDrawing("food", "cupcake", "Pastelito", icons.cupcake, "cupcake.svg"),
    ],
  },
  {
    id: "sea",
    title: "Mar",
    emoji: icons.fish,
    color: "#bfeeff",
    drawings: [
      makeDrawing("sea", "fish", "Pez", icons.fish, "fish.png"),
      makeDrawing("sea", "whale", "Ballena", icons.whale, "whale.svg"),
    ],
  },
  {
    id: "space",
    title: "Espacio",
    emoji: icons.rocket,
    color: "#c9ddff",
    drawings: [
      makeDrawing("space", "rocket", "Cohete", icons.rocket, "rocket.svg"),
      makeDrawing("space", "astronaut", "Astronauta", icons.astronaut, "astronaut.svg"),
    ],
  },
  {
    id: "music",
    title: "Guerreras pop",
    emoji: icons.music,
    color: "#ffc9ef",
    drawings: [
      makeDrawing("music", "pop-warriors", "Guerreras pop", icons.sparkle, "pop-warriors.png"),
      makeDrawing("music", "pop-duo", "Duo pop", icons.music, "pop-duo.png"),
      makeDrawing("music", "pop-boy", "Chico pop", icons.music, "pop-boy.png"),
    ],
  },
];

export const allDrawings = categories.flatMap((category) => category.drawings);

export const findDrawing = (drawingId: string) =>
  allDrawings.find((drawing) => drawing.id === drawingId);
