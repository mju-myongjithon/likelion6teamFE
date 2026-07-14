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

interface SavedItemsContextValue {
  savedItems: SavedItem[];
  isSaved: (id: string) => boolean;
  toggleSave: (item: SavedItem) => void;
}

const SavedItemsContext = React.createContext<SavedItemsContextValue | null>(null);

export function SavedItemsProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [savedItems, setSavedItems] = React.useState<SavedItem[]>([]);

  const isSaved = (id: string): boolean => savedItems.some((it) => it.id === id);

  const toggleSave = (item: SavedItem): void => {
    setSavedItems((prev) =>
      prev.some((it) => it.id === item.id)
        ? prev.filter((it) => it.id !== item.id)
        : [...prev, item]
    );
  };

  return (
    <SavedItemsContext.Provider value={{ savedItems, isSaved, toggleSave }}>
      {children}
    </SavedItemsContext.Provider>
  );
}

export function useSavedItems(): SavedItemsContextValue {
  const ctx = React.useContext(SavedItemsContext);
  if (!ctx) throw new Error("useSavedItems must be used within SavedItemsProvider");
  return ctx;
}