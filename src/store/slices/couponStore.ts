import { create } from 'zustand'
import { CouponState } from '../types'
import { getCoupons } from '../../../services/api'

export const useCouponStore = create<CouponState>((set) => ({
    coupons: [],
    isLoading: false,
    error: null,

    loadCoupons: async (id: string) => {
        try {
            set({ isLoading: true, error: null })
            const response = await getCoupons(id)
            set({ coupons: response.data, isLoading: false })
        } catch (error) {
            set({ error: 'Failed to load coupons', isLoading: false })
        }
    },
    reset: () => set({ coupons: [], isLoading: false, error: null }),
})) 