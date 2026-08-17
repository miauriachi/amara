export const appConfig = {
  appName: "Amara Colors",
  soundEnabled: true,
  maxUndoSteps: 24,
  defaultBrushSize: 18,
  enableAnimations: true,
  autosaveKeyPrefix: "amara-autosave",
  paintStyles: [
    { id: "bubblegum", label: "Rosa", kind: "solid", color: "#ff7fbd", preview: "#ff7fbd" },
    { id: "coral", label: "Coral", kind: "solid", color: "#ff6f61", preview: "#ff6f61" },
    { id: "sun", label: "Sol", kind: "solid", color: "#ffd84d", preview: "#ffd84d" },
    { id: "mint", label: "Menta", kind: "solid", color: "#77df9b", preview: "#77df9b" },
    { id: "sky", label: "Cielo", kind: "solid", color: "#6fc8ff", preview: "#6fc8ff" },
    { id: "lilac", label: "Lila", kind: "solid", color: "#b997ff", preview: "#b997ff" },
    { id: "choco", label: "Chocolate", kind: "solid", color: "#9a6644", preview: "#9a6644" },
    { id: "ink", label: "Negro", kind: "solid", color: "#222222", preview: "#222222" },
    { id: "snow", label: "Blanco", kind: "solid", color: "#ffffff", preview: "#ffffff" },
    {
      id: "rainbow",
      label: "Arcoiris",
      kind: "rainbow",
      color: "#ff7fbd",
      preview: "linear-gradient(135deg, #ff5c7a, #ffe35b, #77df9b, #6fc8ff, #b997ff)"
    },
    {
      id: "sparkles",
      label: "Brillitos",
      kind: "sparkles",
      color: "#b997ff",
      preview: "radial-gradient(circle at 35% 35%, #ffffff 0 8%, transparent 9%), linear-gradient(135deg, #b997ff, #ff9fce)"
    },
    {
      id: "candy",
      label: "Dulce",
      kind: "candy",
      color: "#ff7fbd",
      preview: "repeating-linear-gradient(45deg, #ff7fbd 0 12px, #ffffff 12px 22px, #6fc8ff 22px 34px)"
    },
    {
      id: "stars",
      label: "Estrellas",
      kind: "stars",
      color: "#ffd84d",
      preview: "radial-gradient(circle at 30% 35%, #fff8b5 0 12%, transparent 13%), linear-gradient(135deg, #ffd84d, #ff9fce)"
    },
    {
      id: "night-sky",
      label: "Cielo estrellado",
      kind: "nightSky",
      color: "#233067",
      preview: "radial-gradient(circle at 28% 30%, #fff7a8 0 7%, transparent 8%), radial-gradient(circle at 70% 62%, #ffffff 0 5%, transparent 6%), linear-gradient(135deg, #141a46, #4255c8)"
    },
    {
      id: "galaxy",
      label: "Galaxia",
      kind: "galaxy",
      color: "#6b4bff",
      preview: "radial-gradient(circle at 30% 40%, #ffffff 0 5%, transparent 6%), linear-gradient(135deg, #38227c, #ff78bd, #5ed7ff)"
    },
    {
      id: "mermaid",
      label: "Sirena",
      kind: "mermaid",
      color: "#3ad7c1",
      preview: "repeating-radial-gradient(circle at 50% 100%, #8af7df 0 9px, #46c7ff 10px 18px, #b997ff 19px 28px)"
    },
    {
      id: "flowers",
      label: "Flores",
      kind: "flowers",
      color: "#77df9b",
      preview: "radial-gradient(circle at 30% 35%, #ff7fbd 0 10%, transparent 11%), radial-gradient(circle at 65% 60%, #ffd84d 0 10%, transparent 11%), linear-gradient(135deg, #77df9b, #d7ff9b)"
    },
    {
      id: "confetti",
      label: "Confeti",
      kind: "confetti",
      color: "#ffffff",
      preview: "radial-gradient(circle at 30% 30%, #ff5c7a 0 8%, transparent 9%), radial-gradient(circle at 65% 42%, #6fc8ff 0 8%, transparent 9%), radial-gradient(circle at 48% 70%, #ffd84d 0 8%, transparent 9%), #ffffff"
    },
    {
      id: "gold",
      label: "Oro",
      kind: "gold",
      color: "#ffd84d",
      preview: "linear-gradient(135deg, #fff4a3, #f6b93b, #fff0a8)"
    },
    {
      id: "ice",
      label: "Hielo",
      kind: "ice",
      color: "#bdefff",
      preview: "linear-gradient(135deg, #ffffff, #bdefff, #7ed6ff)"
    },
    {
      id: "hearts",
      label: "Corazones",
      kind: "hearts",
      color: "#ff7fbd",
      preview: "radial-gradient(circle at 36% 36%, #ff7fbd 0 10%, transparent 11%), radial-gradient(circle at 60% 58%, #ff5c7a 0 10%, transparent 11%), #ffe1ef"
    },
    {
      id: "bubbles",
      label: "Burbujas",
      kind: "bubbles",
      color: "#85ddff",
      preview: "radial-gradient(circle at 30% 35%, transparent 0 10%, #ffffff 11% 15%, transparent 16%), radial-gradient(circle at 68% 64%, transparent 0 12%, #ffffff 13% 17%, transparent 18%), linear-gradient(135deg, #85ddff, #d9ceff)"
    }
  ],
};

export type PaintStyle = (typeof appConfig.paintStyles)[number];
