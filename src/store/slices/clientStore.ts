import { create } from 'zustand'
import { ClientState } from '../types'
import { getClient } from '../../../services/api'

export const useClientStore = create<ClientState>((set) => ({
    client: undefined,
    isLoading: false,
    error: null,

    setClient: (client) => set({ client }),
    loadClient: async (id: string) => {
        try {
            set({ isLoading: true, error: null })
            const response = await getClient(id)
            set({ client: response.data, isLoading: false })
        } catch (error) {
            set({ error: 'Failed to load client', isLoading: false })
        }
    },
    reset: () => set({ client: undefined, isLoading: false, error: null }),
})) 