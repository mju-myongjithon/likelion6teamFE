import React from "react";
import {
  getMyScraps,
  saveGroupScrap,
  removeGroupScrap,
  saveEventScrap,
  removeEventScrap,
  type ScrapItem,
} from "../api/scrapApi";

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

function scrapItemToSavedItem(item: ScrapItem): SavedItem {
  if (item.category === "STUDY") {
    return {
      id: String(item.groupId),
      type: "group",
      title: item.title,
      category: "스터디",
      categoryTone: "violet",
      when: item.meetingRule,
      where: item.location,
      host: item.leaderName ?? "",
      members: item.currentMemberCount,
      capacity: item.maxMemberCount,
    };
  }
  return {
    id: String(item.eventId),
    type: "event",
    title: item.title,
    category: "해커톤",
    categoryTone: "orange",
    when: item.startsAt,
    where: item.location,
    host: item.organizer,
    members: 0,
    capacity: 0,
  };
}

export function SavedItemsProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [savedItems, setSavedItems] = React.useState<SavedItem[]>([]);

  React.useEffect(() => {
    getMyScraps()
      .then((res) => setSavedItems(res.data.map(scrapItemToSavedItem)))
      .catch(() => {
        // 비로그인 상태일 수 있음 — 저장 목록은 빈 상태로 둠
      });
  }, []);

  const isSaved = (id: string): boolean => savedItems.some((it) => it.id === id);

  const toggleSave = (item: SavedItem): void => {
    const alreadySaved = savedItems.some((it) => it.id === item.id);
    const save = item.type === "group" ? saveGroupScrap : saveEventScrap;
    const remove = item.type === "group" ? removeGroupScrap : removeEventScrap;

    if (alreadySaved) {
      setSavedItems((prev) => prev.filter((it) => it.id !== item.id));
      remove(item.id).catch((err) => {
        console.error("저장 해제 실패:", err);
        setSavedItems((prev) => (prev.some((it) => it.id === item.id) ? prev : [...prev, item]));
      });
    } else {
      setSavedItems((prev) => [...prev, item]);
      save(item.id).catch((err) => {
        console.error("저장 실패:", err);
        setSavedItems((prev) => prev.filter((it) => it.id !== item.id));
      });
    }
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
