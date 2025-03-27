import { create } from 'zustand'

interface AuthState {
    token: string | null
    authProvider: string | null
    isAuthenticated: boolean

    setToken: (token: string) => void
    setAuthProvider: (provider: string) => void
    logout: () => void
}
export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    authProvider: null,
    isAuthenticated: false,

    setToken: (token: string) => set({ token, isAuthenticated: true }),

    setAuthProvider: (provider: string) => set({ authProvider: provider }),

    logout: () => set({ token: null, authProvider: null, isAuthenticated: false })
}))

