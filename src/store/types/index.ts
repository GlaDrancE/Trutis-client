import { Client, Coupon, CustomerData } from '../../../types'

export interface AuthState {
    token: string | null;
    authProvider: string | null;
    isAuthenticated: boolean;
    rememberMe: boolean;
    setRememberMe: (value: boolean) => void;
    setToken: (token: string) => void;
    setAuthProvider: (provider: string) => void;
    logout: () => void;
    login: (token: string, authProvider: string, remember: boolean) => void;
}

export interface ClientState {
    client: Client | undefined;
    isLoading: boolean;
    error: string | null;
    setClient: (client: Client) => void;
    loadClient: (id: string) => Promise<void>;
    reset: () => void;
}

export interface CouponState {
    coupons: Coupon[];
    isLoading: boolean;
    error: string | null;
    loadCoupons: (id: string) => Promise<void>;
    reset: () => void;
}

export interface CustomerState {
    customers: CustomerData[];
    isLoading: boolean;
    error: string | null;
    loadCustomers: (id: string) => Promise<void>;
    reset: () => void;
} 