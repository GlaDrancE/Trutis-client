import { create } from 'zustand';
import { Client, Coupon, CustomerData } from 'types';
import { getClient, getCoupons, getCustomers } from '../../services/api';



interface ClientState {
    client: Client | undefined
    coupons: Coupon[]
    customers: CustomerData[]
    isLoading: {
        client: boolean
        coupons: boolean
        customers: boolean
    }
    isError: boolean
    publicKey: string | undefined

    // Actions
    loadClient: (id: string) => Promise<void>
    loadCoupons: (id: string) => Promise<void>
    loadCustomers: (id: string) => Promise<void>
    setClient: (client: Client) => void
    reset: () => void
}
export const useClientStore = create<ClientState>((set: any) => ({
    client: undefined,
    coupons: [],
    customers: [],
    isLoading: {
        client: false,
        coupons: false,
        customers: false
    },
    isError: false,
    publicKey: undefined,

    loadClient: async (id: string) => {
        try {
            set((state: ClientState) => ({
                isLoading: {
                    ...state.isLoading, client: true
                }
            }))
            const response = await getClient(id)
            set({ client: response.data, publicKey: response.data.publicKey, isLoading: { ...useClientStore.getState().isLoading, client: false } })
            localStorage.setItem("clientId", response.data.id)
        } catch (error) {
            set({ isError: true })
        } finally {
            set({ isLoading: { ...useClientStore.getState().isLoading, client: false } })
        }
    },
    loadCoupons: async (id: string) => {
        try {
            set((state: ClientState) => ({
                isLoading: {
                    ...state.isLoading, coupons: true
                }
            }))
            const response = await getCoupons(id)
            set({ coupons: response.data, isLoading: { ...useClientStore.getState().isLoading, coupons: false } })
        } catch (error) {
            set({ isError: true })
        } finally {
            set({ isLoading: { ...useClientStore.getState().isLoading, coupons: false } })
        }
    },
    loadCustomers: async (id: string) => {
        try {
            set((state: ClientState) => ({
                isLoading: {
                    ...state.isLoading, customers: true
                }
            }))
            const response = await getCustomers(id)
            set({ customers: response.data, isLoading: { ...useClientStore.getState().isLoading, customers: false } })
        } catch (error) {
            set({ isError: true })
        } finally {
            set({ isLoading: { ...useClientStore.getState().isLoading, customers: false } })
        }
    },
    setClient: (client: Client) => {
        set({ client })
    },
    reset: () => {
        set({ client: undefined, coupons: [], customers: [], isLoading: { client: false, coupons: false, customers: false }, isError: false, publicKey: undefined })
    }
}))
