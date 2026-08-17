import { useMemo, useState } from "react";
import { appConfig } from "./config/appConfig";
import { categories, findDrawing } from "./data/categories";
import { useRegisterServiceWorker } from "./hooks/useRegisterServiceWorker";
import { CategoryPage } from "./pages/CategoryPage";
import { ColoringPage } from "./pages/ColoringPage";
import { GalleryPage } from "./pages/GalleryPage";
import { HomePage } from "./pages/HomePage";
import type { Drawing, SavedDrawing } from "./types/coloring";

type Screen =
  | { name: "home" }
  | { name: "category"; categoryId: string }
  | { name: "coloring"; drawing: Drawing; saved?: SavedDrawing }
  | { name: "gallery" };

export const App = () => {
  useRegisterServiceWorker();
  const [screen, setScreen] = useState<Screen>({ name: "home" });

  const currentCategory = useMemo(
    () => (screen.name === "category" ? categories.find((item) => item.id === screen.categoryId) : undefined),
    [screen]
  );

  return (
    <main className="app-shell" aria-label={appConfig.appName}>
      {screen.name === "home" && (
        <HomePage
          onCategory={(categoryId) => setScreen({ name: "category", categoryId })}
          onGallery={() => setScreen({ name: "gallery" })}
        />
      )}

      {screen.name === "category" && currentCategory && (
        <CategoryPage
          category={currentCategory}
          onBack={() => setScreen({ name: "home" })}
          onPick={(drawing) => setScreen({ name: "coloring", drawing })}
        />
      )}

      {screen.name === "gallery" && (
        <GalleryPage
          onBack={() => setScreen({ name: "home" })}
          onOpen={(saved) => {
            const drawing = findDrawing(saved.drawingId) ?? {
              id: saved.drawingId,
              title: "Dibujo",
              emoji: "*",
              src: saved.drawingSrc,
              categoryId: "gallery",
            };
            setScreen({ name: "coloring", drawing, saved });
          }}
        />
      )}

      {screen.name === "coloring" && (
        <ColoringPage
          drawing={screen.drawing}
          savedDrawing={screen.saved}
          onBack={() => {
            if (screen.saved) {
              setScreen({ name: "gallery" });
            } else {
              setScreen({ name: "home" });
            }
          }}
        />
      )}
    </main>
  );
};
