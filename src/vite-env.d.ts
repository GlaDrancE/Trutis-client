/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_BASE_URL: string
    readonly VITE_AUTH_URL: string
    readonly VITE_PAYMENT_URL: string
    readonly VITE_POINT_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}


