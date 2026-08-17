import { appConfig } from "../config/appConfig";

const keyFor = (drawingId: string) => `${appConfig.autosaveKeyPrefix}:${drawingId}`;

export const saveAutosave = (drawingId: string, dataUrl: string) => {
  localStorage.setItem(keyFor(drawingId), dataUrl);
};

export const loadAutosave = (drawingId: string) => localStorage.getItem(keyFor(drawingId));

export const clearAutosave = (drawingId: string) => {
  localStorage.removeItem(keyFor(drawingId));
};
