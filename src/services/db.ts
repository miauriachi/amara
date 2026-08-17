import type { SavedDrawing } from "../types/coloring";

const DB_NAME = "amara-colors";
const STORE_NAME = "saved-drawings";
const DB_VERSION = 1;

const openDatabase = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("updatedAt", "updatedAt");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const withStore = async <T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const request = action(tx.objectStore(STORE_NAME));

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
    tx.onerror = () => reject(tx.error);
  });
};

export const saveDrawingRecord = (drawing: SavedDrawing) =>
  withStore<IDBValidKey>("readwrite", (store) => store.put(drawing));

export const getSavedDrawings = async (): Promise<SavedDrawing[]> => {
  const items = await withStore<SavedDrawing[]>("readonly", (store) => store.getAll());
  return items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
};

export const getSavedDrawing = (id: string): Promise<SavedDrawing | undefined> =>
  withStore<SavedDrawing | undefined>("readonly", (store) => store.get(id));

export const deleteSavedDrawing = (id: string) =>
  withStore<undefined>("readwrite", (store) => store.delete(id));
