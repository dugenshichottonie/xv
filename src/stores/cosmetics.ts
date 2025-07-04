
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Cosmetic {
  id: string;
  brand: string;
  name: string;
  category: string;
  color: string;
  colorNumber?: string;
  remainingAmount?: string;
  price?: number;
  purchaseDate?: string;
  expiryDate?: string;
  purchaseCount?: number;
  personalColor: 'blue' | 'yellow' | 'neutral';
  photo?: string[]; // URL or base64 string
  memo?: string;
}

export interface MakeupLook {
  id: string;
  title?: string;
  photo: string[]; // URL or base64 string
  usedCosmetics: string[]; // Array of cosmetic IDs
  situation?: string;
  season?: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
  tags?: string[];
  memo?: string;
}

interface AppState {
  cosmetics: Cosmetic[];
  makeupLooks: MakeupLook[];
  makeupListViewMode: 'grid' | 'lookbook' | 'collage';
  lookbookIndex: number;
  lookbookPhotoIndex: number;
  addCosmetic: (cosmetic: Omit<Cosmetic, 'id'>) => void;
  deleteCosmetic: (id: string) => void;
  addMakeupLook: (makeupLook: Omit<MakeupLook, 'id'>) => void;
  deleteMakeupLook: (id: string) => void;
  setMakeupListViewMode: (mode: 'grid' | 'lookbook' | 'collage') => void;
  setLookbookIndex: (index: number) => void;
  setLookbookPhotoIndex: (index: number) => void;
  updateCosmetic: (cosmetic: Cosmetic) => void;
  updateMakeupLook: (makeupLook: MakeupLook) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      cosmetics: [],
      makeupLooks: [],
      makeupListViewMode: 'grid',
      lookbookIndex: 0,
      lookbookPhotoIndex: 0,
      addCosmetic: (cosmetic) =>
        set((state) => ({
          cosmetics: [...state.cosmetics, { ...cosmetic, id: Date.now().toString() }],
        })),
      deleteCosmetic: (id) =>
        set((state) => ({
          cosmetics: state.cosmetics.filter((c) => c.id !== id),
          makeupLooks: state.makeupLooks.map((look) => ({
            ...look,
            usedCosmetics: look.usedCosmetics.filter((cosmeticId) => cosmeticId !== id),
          })),
        })),
      addMakeupLook: (makeupLook) =>
        set((state) => ({
          makeupLooks: [...state.makeupLooks, { ...makeupLook, id: Date.now().toString() }],
        })),
      deleteMakeupLook: (id) =>
        set((state) => ({
          makeupLooks: state.makeupLooks.filter((look) => look.id !== id),
        })),
      setMakeupListViewMode: (mode) => set({ makeupListViewMode: mode }),
      setLookbookIndex: (index) => set({ lookbookIndex: index }),
      setLookbookPhotoIndex: (index) => set({ lookbookPhotoIndex: index }),
      updateCosmetic: (updatedCosmetic) =>
        set((state) => ({
          cosmetics: state.cosmetics.map((c) =>
            c.id === updatedCosmetic.id ? updatedCosmetic : c
          ),
        })),
      updateMakeupLook: (updatedMakeupLook) =>
        set((state) => ({
          makeupLooks: state.makeupLooks.map((ml) =>
            ml.id === updatedMakeupLook.id ? updatedMakeupLook : ml
          ),
        })),
    }),
    {
      name: 'cosme-zukan-storage', // localStorageに保存されるキー名
    }
  )
);
