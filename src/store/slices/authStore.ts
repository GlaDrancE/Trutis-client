import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState } from '../types'

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            authProvider: null,
            isAuthenticated: false,

            setToken: (token: string) => set({ token, isAuthenticated: true }),
            setAuthProvider: (provider: string) => set({ authProvider: provider }),
            logout: () => set({ token: null, authProvider: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
        }
    )
) 