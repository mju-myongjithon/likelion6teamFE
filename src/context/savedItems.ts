import React from "react";

export interface SavedItem {
  id: string;
  type: "group" | "event";
  title: string;
  category: string;
  categoryTone: string;
  when: string;
  where: string;
  host: string;
  members: number;
  capacity: number;
}

export interface SavedItemsContextValue {
  savedItems: SavedItem[];
  isSaved: (id: string) => boolean;
  toggleSave: (item: SavedItem) => void;
}

export const SavedItemsContext = React.createContext<SavedItemsContextValue | null>(null);

export function useSavedItems(): SavedItemsContextValue {
  const context = React.useContext(SavedItemsContext);
  if (!context) throw new Error("useSavedItems must be used within SavedItemsProvider");
  return context;
}
