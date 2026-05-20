/**
 * userProfileStore.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Store de perfil agronómico detectado por el Asesor IA.
 * Persistido en localStorage para que el copy contextual se mantenga
 * entre sesiones sin necesidad de que el usuario vuelva a hablar con el chat.
 *
 * Flujo:
 *   1. El chatbot detecta el cultivo/problema vía tool `updateUserIntent`.
 *   2. AgronomicAdvisorChat llama a `setProfile(crop, problem, intentScore)`.
 *   3. ProductFunnel lee `useUserProfileStore()` y adapta el copy en tiempo real.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type CropProfile =
  | 'olivicultor'
  | 'horticultor'
  | 'viticultor'
  | 'citricos'
  | 'jardinero'
  | 'vivero'
  | 'ecologico'
  | 'generic';

export interface UserProfile {
  crop: string | null;        // Texto libre detectado (ej. "olivar", "tomate")
  cropProfile: CropProfile;  // Perfil normalizado para adaptar copy
  problem: string | null;     // Problema detectado (ej. "suelo compactado")
  intentScore: number;        // 0-100, temperatura de compra
  lastUpdated: number | null; // timestamp de la última actualización
}

interface UserProfileState extends UserProfile {
  setProfile: (data: { crop?: string; problem?: string; intentScore?: number }) => void;
  resetProfile: () => void;
}

/** Normaliza el texto del cultivo detectado por la IA a un perfil tipado */
function normalizeCrop(crop: string | null | undefined): CropProfile {
  if (!crop) return 'generic';
  const lower = crop.toLowerCase();
  if (lower.match(/oliv|olivo|almazara/)) return 'olivicultor';
  if (lower.match(/hortal|tomate|pimiento|pepino|lechuga|huerto|verdura/)) return 'horticultor';
  if (lower.match(/viñ|vino|vid|uva|bodega/)) return 'viticultor';
  if (lower.match(/cítri|naranja|limón|mandarina|citrus/)) return 'citricos';
  if (lower.match(/jardín|jardiner|cesped|ornament|maceta|terraza|parque/)) return 'jardinero';
  if (lower.match(/vivero|plántula|semillero|plantón/)) return 'vivero';
  if (lower.match(/ecológic|ecolog|biodinám|agroecol/)) return 'ecologico';
  return 'generic';
}

const initialState: UserProfile = {
  crop: null,
  cropProfile: 'generic',
  problem: null,
  intentScore: 0,
  lastUpdated: null,
};

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set) => ({
      ...initialState,

      setProfile: ({ crop, problem, intentScore }) =>
        set((state) => ({
          crop: crop ?? state.crop,
          cropProfile: normalizeCrop(crop ?? state.crop),
          problem: problem ?? state.problem,
          intentScore: intentScore ?? state.intentScore,
          lastUpdated: Date.now(),
        })),

      resetProfile: () => set({ ...initialState }),
    }),
    {
      name: 'biocultor-user-profile', // clave en localStorage
      storage: createJSONStorage(() => localStorage),
      // Solo persistir los datos del perfil, no las acciones
      partialize: (state) => ({
        crop: state.crop,
        cropProfile: state.cropProfile,
        problem: state.problem,
        intentScore: state.intentScore,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
