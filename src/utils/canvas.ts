export const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    image.src = src;
  });

export const dataUrlToImageData = async (
  dataUrl: string,
  width: number,
  height: number
): Promise<ImageData> => {
  const image = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas no disponible");
  ctx.drawImage(image, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
};

export const makeThumbnail = (canvas: HTMLCanvasElement, maxSize = 360) => {
  const ratio = Math.min(maxSize / canvas.width, maxSize / canvas.height);
  const thumb = document.createElement("canvas");
  thumb.width = Math.round(canvas.width * ratio);
  thumb.height = Math.round(canvas.height * ratio);
  const ctx = thumb.getContext("2d");
  if (!ctx) return canvas.toDataURL("image/png");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, thumb.width, thumb.height);
  ctx.drawImage(canvas, 0, 0, thumb.width, thumb.height);
  return thumb.toDataURL("image/jpeg", 0.82);
};
