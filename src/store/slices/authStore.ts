import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState } from '../types'

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            authProvider: null,
            isAuthenticated: false,
            rememberMe: false,


            setRememberMe: (value: boolean) => set({ rememberMe: value }),

            login: (token: string, authProvider: string, remember: boolean) => set({
                token,
                authProvider,
                isAuthenticated: true,
                rememberMe: remember
            }),

            logout: () => set({
                token: null,
                authProvider: null,
                isAuthenticated: false,
                rememberMe: false
            }),

            setToken: (token: string) => set({ token, isAuthenticated: true }),
            setAuthProvider: (provider: string) => set({ authProvider: provider }),
        }),
        {
            name: 'auth-storage',
        }
    )
)