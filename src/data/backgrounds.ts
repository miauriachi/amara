import { assetUrl } from "../utils/assets";

export type ColoringBackground = {
  id: string;
  label: string;
  emoji: string;
  src: string;
};

export const backgrounds: ColoringBackground[] = [
  { id: "plain", label: "Blanco", emoji: "⬜", src: "" },
  { id: "meadow", label: "Pradera", emoji: "🌼", src: assetUrl("backgrounds/meadow.png") },
  { id: "forest", label: "Bosque", emoji: "🌲", src: assetUrl("backgrounds/forest.png") },
  { id: "jungle", label: "Selva", emoji: "🌿", src: assetUrl("backgrounds/jungle.png") },
  { id: "rainbow", label: "Arcoiris", emoji: "🌈", src: assetUrl("backgrounds/rainbow-meadow.png") },
  { id: "night", label: "Noche", emoji: "🌙", src: assetUrl("backgrounds/starry-sky.png") },
];

export const defaultBackground = backgrounds[0];

export const findBackground = (id?: string) =>
  backgrounds.find((background) => background.id === id) ?? defaultBackground;
