import { create } from 'zustand'
import { CustomerState } from '../types'
import { getCustomers } from '../../../services/api'

export const useCustomerStore = create<CustomerState>((set) => ({
    customers: [],
    isLoading: false,
    error: null,

    loadCustomers: async (id: string) => {
        try {
            set({ isLoading: true, error: null })
            const response = await getCustomers(id)
            set({ customers: response.data, isLoading: false })
        } catch (error) {
            set({ error: 'Failed to load customers', isLoading: false })
        }
    },
    reset: () => set({ customers: [], isLoading: false, error: null }),
})) 