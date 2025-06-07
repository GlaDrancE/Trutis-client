import { create } from "zustand";
import { TugoHistoryState } from "../types";
import { getTugoHistory } from "../../../services/api";

export const useTugoHistoryStore = create<TugoHistoryState>((set) => ({
    tugoHistory: [],
    isLoading: false,
    error: null,
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
    loadTugoHistory: async (id: string) => {
        try {
            set({ isLoading: true, error: null })
            const response = await getTugoHistory(id)
            set({ tugoHistory: response.data, isLoading: false })
        } catch (error) {
            set({ error: 'Failed to load tugo history', isLoading: false })
        }
    },
    reset: () => set({ tugoHistory: [], isLoading: false, error: null }),
}));
