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

export type PersonalColor = 'blue' | 'yellow' | 'neutral';

export interface ColorAlias {
  canonicalName: string;
  aliases: string[];
  personalColor: PersonalColor;
}

export interface BrandAlias {
  canonicalName: string;
  aliases: string[];
}

export interface CategoryAlias {
  canonicalName: string;
  aliases: string[];
}

interface AppState {
  cosmetics: Cosmetic[];
  makeupLooks: MakeupLook[];
  userColors: ColorAlias[];
  userBrands: BrandAlias[];
  userCategories: CategoryAlias[];
  makeupListViewMode: 'grid' | 'lookbook' | 'collage';
  cosmeticListViewMode: 'grid' | 'list' | 'collage';
  lookbookIndex: number;
  lookbookPhotoIndex: number;
  addCosmetic: (cosmetic: Omit<Cosmetic, 'id'>) => void;
  deleteCosmetic: (id: string) => void;
  addMakeupLook: (makeupLook: Omit<MakeupLook, 'id'>) => void;
  deleteMakeupLook: (id: string) => void;
  addUserColor: (color: ColorAlias) => void;
  addUserBrand: (brandAlias: BrandAlias) => void;
  addUserCategory: (category: CategoryAlias) => void;
  setMakeupListViewMode: (mode: 'grid' | 'lookbook' | 'collage') => void;
  setCosmeticListViewMode: (mode: 'grid' | 'list' | 'collage') => void;
  setLookbookIndex: (index: number) => void;
  setLookbookPhotoIndex: (index: number) => void;
  updateCosmetic: (cosmetic: Cosmetic) => void;
  updateMakeupLook: (makeupLook: MakeupLook) => void;
  checkDuplicateCosmetic: (newCosmetic: Omit<Cosmetic, 'id'>) => Cosmetic | undefined;
  updateCosmeticWithDuplicate: (existingCosmeticId: string, newCosmetic: Omit<Cosmetic, 'id'>) => void;
  restoreState: (newState: AppState) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      cosmetics: [],
      makeupLooks: [],
      userColors: [],
      userBrands: [],
      userCategories: [],
      makeupListViewMode: 'grid',
      cosmeticListViewMode: 'grid',
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
      addUserColor: (color) => 
        set((state) => {
          // Ensure the color object and its name property are valid before comparison
          if (!color || typeof color.canonicalName !== 'string') {
            console.warn('Attempted to add an invalid color object:', color);
            return state; // Do not modify state if color is invalid
          }

          const existingColorIndex = state.userColors.findIndex(uc => 
            uc && typeof uc.canonicalName === 'string' && uc.canonicalName.toLowerCase() === color.canonicalName.toLowerCase()
          );

          if (existingColorIndex > -1) {
            // Update existing color's aliases and personalColor
            const updatedUserColors = [...state.userColors];
            const existingAliases = new Set(updatedUserColors[existingColorIndex].aliases.map(a => a.toLowerCase()));
            color.aliases.forEach(newAlias => {
              if (!existingAliases.has(newAlias.toLowerCase())) {
                updatedUserColors[existingColorIndex].aliases.push(newAlias);
              }
            });
            updatedUserColors[existingColorIndex].personalColor = color.personalColor; // Update personalColor
            return { userColors: updatedUserColors };
          } else {
            // Add new color
            return { userColors: [...state.userColors, color] };
          }
        }),
      addUserBrand: (brandAlias) =>
        set((state) => {
          const existingBrandIndex = state.userBrands.findIndex(b => b.canonicalName.toLowerCase() === brandAlias.canonicalName.toLowerCase());
          if (existingBrandIndex > -1) {
            // Update existing brand's aliases
            const updatedUserBrands = [...state.userBrands];
            const existingAliases = new Set(updatedUserBrands[existingBrandIndex].aliases.map(a => a.toLowerCase()));
            brandAlias.aliases.forEach(newAlias => {
              if (!existingAliases.has(newAlias.toLowerCase())) {
                updatedUserBrands[existingBrandIndex].aliases.push(newAlias);
              }
            });
            return { userBrands: updatedUserBrands };
          } else {
            // Add new brand
            return { userBrands: [...state.userBrands, brandAlias] };
          }
        }),
      addUserCategory: (category) =>
        set((state) => {
          const existingCategoryIndex = state.userCategories.findIndex(c => c.canonicalName.toLowerCase() === category.canonicalName.toLowerCase());
          if (existingCategoryIndex > -1) {
            const updatedUserCategories = [...state.userCategories];
            const existingAliases = new Set(updatedUserCategories[existingCategoryIndex].aliases.map(a => a.toLowerCase()));
            category.aliases.forEach(newAlias => {
              if (!existingAliases.has(newAlias.toLowerCase())) {
                updatedUserCategories[existingCategoryIndex].aliases.push(newAlias);
              }
            });
            return { userCategories: updatedUserCategories };
          } else {
            return { userCategories: [...state.userCategories, category] };
          }
        }),
      setMakeupListViewMode: (mode) => set({ makeupListViewMode: mode }),
      setCosmeticListViewMode: (mode) => set({ cosmeticListViewMode: mode }),
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
      checkDuplicateCosmetic: (newCosmetic) => {
        const state = get();
        const normalizeName = (name: string, aliases: { canonicalName: string; aliases: string[] }[]) => {
          const found = aliases.find(a => a.aliases.some(alias => alias.toLowerCase() === name.toLowerCase()));
          return found ? found.canonicalName.toLowerCase() : name.toLowerCase();
        };

        const normalizedNewBrand = normalizeName(newCosmetic.brand, state.userBrands);
        const normalizedNewCategory = normalizeName(newCosmetic.category, state.userCategories);
        const normalizedNewColor = normalizeName(newCosmetic.color, state.userColors);

        return state.cosmetics.find(c => {
          const normalizedExistingBrand = normalizeName(c.brand, state.userBrands);
          const normalizedExistingCategory = normalizeName(c.category, state.userCategories);
          const normalizedExistingColor = normalizeName(c.color, state.userColors);

          return (
            normalizedExistingBrand === normalizedNewBrand &&
            c.name.toLowerCase() === newCosmetic.name.toLowerCase() &&
            normalizedExistingCategory === normalizedNewCategory &&
            normalizedExistingColor === normalizedNewColor &&
            (c.colorNumber || '').toLowerCase() === (newCosmetic.colorNumber || '').toLowerCase()
          );
        });
      },
      updateCosmeticWithDuplicate: (existingCosmeticId, newCosmetic) =>
        set((state) => ({
          cosmetics: state.cosmetics.map((c) =>
            c.id === existingCosmeticId
              ? {
                  ...c,
                  brand: newCosmetic.brand,
                  name: newCosmetic.name,
                  category: newCosmetic.category,
                  color: newCosmetic.color,
                  colorNumber: newCosmetic.colorNumber,
                  remainingAmount: newCosmetic.remainingAmount,
                  price: newCosmetic.price,
                  purchaseDate: newCosmetic.purchaseDate,
                  expiryDate: newCosmetic.expiryDate,
                  personalColor: newCosmetic.personalColor,
                  memo: newCosmetic.memo,
                  purchaseCount: (c.purchaseCount || 0) + 1, // Increment purchaseCount
                  photo: c.photo, // Keep existing photos
                }
              : c
          ),
        })),
      restoreState: (newState) => set(newState),
    }),
    {
      name: 'cosme-zukan-storage', // localStorageに保存されるキー名
      version: 2, // Increment version when schema changes
      migrate: (persistedState: unknown, version) => {
        // Type guard for persistedState to be an object
        if (typeof persistedState !== 'object' || persistedState === null) {
          return {} as AppState; // Return a default empty state if it's not an object
        }

        const state = persistedState as Partial<AppState>; // Assert to Partial<AppState> for initial access

        if (version === 0) {
          // If migrating from version 0 (where userBrands/userCategories didn't exist or were different)
          // Ensure userBrands and userCategories are arrays
          if (!Array.isArray(state.userBrands)) {
            state.userBrands = [];
          }
          if (!Array.isArray(state.userCategories)) {
            state.userCategories = [];
          }
          // Also ensure userCategories is an array of objects if it was just strings
          if (Array.isArray(state.userCategories) && state.userCategories.some((c) => typeof c === 'string')) {
            state.userCategories = state.userCategories.map((c) => ({ canonicalName: c as string, aliases: [c as string] }));
          }
          // Also ensure userColors is an array of objects if it was just strings
          if (Array.isArray(state.userColors) && state.userColors.some((c) => typeof c === 'string' || (typeof c === 'object' && c !== null && 'name' in c && typeof (c as any).name === 'string'))) {
            state.userColors = state.userColors.map((c) => {
              const name = typeof c === 'string' ? c : (c as any).name;
              const personalColor = (c as any).personalColor || 'neutral';
              return { canonicalName: name, aliases: [name], personalColor };
            });
          }
        }
        if (version < 2) {
          // Migrate cosmetics to ensure personalColor is valid
          if (Array.isArray(state.cosmetics)) {
            state.cosmetics = state.cosmetics.map((cosmetic) => {
              // Assert cosmetic to a type that might have personalColor
              const c = cosmetic as { personalColor?: string };
              if (!['blue', 'yellow', 'neutral'].includes(c.personalColor as string)) {
                return { ...cosmetic, personalColor: 'neutral' };
              }
              return cosmetic;
            }) as Cosmetic[]; // Assert back to Cosmetic[]
          }
        }
        return state as AppState;
      },
    }
  )
);