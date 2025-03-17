import axios from "axios";
import { Agent, Client, ClientSignUp } from "../types";
import { useAuthStore } from '../src/store/slices/authStore'

const baseUrl = 'http://localhost:3000/api/api'
const api = axios.create({
    baseURL: baseUrl,
});
const paymentApi = axios.create({
    baseURL: 'http://localhost:3000/payment/payment'
});

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token
        const authProvider = useAuthStore.getState().authProvider
        console.log("Auth Provider: ", authProvider)

        if (!config.headers) {
            config.headers = new axios.AxiosHeaders();
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log("Config Data: ", config.data)
            // if (config.data) {
            //     config.data = {
            //         ...config.data,
            //         authProvider: authProvider
            //     }
            // } else {
            //     config.data = { authProvider }
            // }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


// const getRefreshTokenFromCookie = () => {
//     const cookies = document.cookie.split(';');
//     const refreshTokenCookie = cookies.find(cookie => cookie.trim().startsWith('refreshToken='));
//     return refreshTokenCookie ? refreshTokenCookie.split('=')[1].trim() : null;
// };


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await axios.post(`${baseUrl}/token/refresh`, {
                    withCredentials: true,
                });
                console.log("refresh token", data)
                localStorage.setItem("token", data.accessToken)
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (err) {
                localStorage.removeItem("token")
                localStorage.removeItem("refreshToken")
                console.log("error", err)
                // window.location.href = "/login"
            }
        }
        return Promise.reject(error);
    }
);



// Auth
export const login = (email: string, password: string) =>
    api.post("/auth/admin/login", { email, password });

export const register = (email: string, password: string) =>
    api.post("/auth/admin/signup", { email, password });

export const sendResetPasswordEmail = (email: string) =>
    api.post("/client/sendresetpassword", { email });

export const resetPassword = (token: string, password: string) =>
    api.post("/client/resetpassword", { token, password });

// Agents
export const getAgents = () => api.get("/agents");

export const createAgent = (data: Omit<Agent, "id" | "created_at">) =>
    api.post("/agents", data);

export const updateAgent = (id: string, data: Partial<Agent>) =>
    api.put(`/agents/${id}`, data);

export const deleteAgent = (id: string) => api.delete(`/agents/${id}`);

export const loginAgent = (email: string, password: string) =>
    api.post("/auth/agent/login", { email, password });

export const getAgentClients = (agentId: string) => api.get(`/agent-clients/${agentId}`);

export const getAgentProfile = (agentId: string) => api.get(`/agent/${agentId}`);

export const updateAgentStatus = (agentId: string, newStatus: boolean) =>
    api.put(`/agent/update-status/${agentId}`, { newStatus });

export const searchClient = (publicKey: string) => api.post(`/agents/client`, { publicKey });

export const linkQRCode = (publicKey: string, QRId: string, agentId?: string) =>
    api.post("/agents/linkQRCode", { publicKey, QRId, agentId });

// Clients
export const getClients = () => api.get("/clients");

export const getClient = (client_id: string) => api.get(`/client/${client_id}`);

export const loginClient = (email: string, password: string, authProvider: string, rememberMe: boolean = useAuthStore.getState().rememberMe) =>
    api.post("/auth/client/login", { email, password, authProvider, rememberMe });
export const logOutClient = () => api.post("/auth/client/logout");

export const createClient = (data: ClientSignUp, rememberMe: boolean = useAuthStore.getState().rememberMe): Promise<any> => {
    return api.post("/auth/clients/register", { ...data, rememberMe }, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};
export const createClientPublicKey = (clientId: string) => api.post("/client/create-public-key", { clientId });
export const createGoogleClient = (data: Omit<Client, "id" | "created_at">): Promise<any> => {
    return api.post("/auth/clients/google/register", data);
};

export const verifyClientOtp = (data: string) => {
    return api.post("/client/verify-otp", data);
};

export const updateClient = (id: string, data: Partial<Client>) =>
    api.put(`/clients/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

export const deleteClient = (id: string) => api.delete(`/clients/${id}`);
export const uploadToCloudinary = (data: { file: File, upload_preset: string }) => api.post("https://api.cloudinary.com/v1_1/doahncdjq/image/upload", { data })
// TODO: Need to create endpoint for google bucket upload



// Staff
export const updateStaff = (data: { client_id: string; staff_id?: string; staff_password?: string; staffStatus?: boolean }) =>
    api.post("/client/create-staff", data);

// QR Codes
export const getQRCodes = () => api.get("/qr-codes");

export const generateQRCode = (data: { id: string }) =>
    api.post("/qr-codes", data);

export const getQrId = (token: string) => {
    return api.post("/client/getqrid", { token });
};


// Payment Logs
export const getPaymentLogs = () => paymentApi.get("/payment-logs");
export const getPlans = () => paymentApi.get("/clients/subscription-plans");
export const createCheckoutSession = (lookup_key: string, clientId: string) => paymentApi.post("/create-checkout-session", { lookup_key, clientId });
export const verifyPaymentAndStore = (session_id: string) => paymentApi.post("/verify", { session_id });
export const portalSession = (customerId: string) => paymentApi.post("/create-portal-session", { customerId });
export const createProducts = (client_id: string) => paymentApi.post("/create-products", { client_id });


// OTP
export const verifyOtp = (data: { email: string; otp: string }) =>
    api.post("/client/verify-otp", data);

export const generateOtp = (email: string) =>
    api.post("/client/generate-otp", { email });

// Coupons
export const getCoupons = (id: string) => api.get(`/forms/get-coupons/${id}`);
export const generateCoupon = (data: { qr_id: string, code: string, email: string, name: string, phone: string, DOB: string, ratings: number | null, reviewImage: File | null }) => api.post(`/coupon`, data, {
    headers: { "Content-Type": "multipart/form-data" },
});

// Customers
export const fetchCustomerFromCoupon = (code: string) => api.post(`/coupon/verify`, { code });
export const getCustomers = (id: string) => api.get(`/forms/get-customers/${id}`);
export const fetchCustomerFromCouponID = (couponId: string) => api.post(`/coupon/getcustomer`, { couponId });

// Admin
export const getStats = () => api.get("/admin/getStats");


// Forms
export const getClientFromQR = (qr_id: string) => api.post("/forms/get-client", { qr_id: qr_id });
export const redeemCoupon = (id: string) => api.post("/forms/redeem-coupon", { id: id });