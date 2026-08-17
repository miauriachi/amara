export type Drawing = {
  id: string;
  title: string;
  emoji: string;
  src: string;
  categoryId: string;
};

export type Category = {
  id: string;
  title: string;
  emoji: string;
  color: string;
  drawings: Drawing[];
};

export type SavedDrawing = {
  id: string;
  drawingId: string;
  drawingSrc: string;
  backgroundId?: string;
  colorImage: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
};

export type ToolMode = "brush" | "fill" | "eraser";
