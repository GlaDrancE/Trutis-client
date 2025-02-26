import axios from "axios";
import { Agent, Client } from "../types";

const api = axios.create({
    baseURL: 'https://trutis-backend.onrender.com/api',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (!config.headers) {
            config.headers = new axios.AxiosHeaders();
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
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

export const linkQRCode = (publicKey: string, QRId: string, agentId: string) =>
    api.post("/agents/linkQRCode", { publicKey, QRId, agentId });

// Clients
export const getClients = () => api.get("/clients");

export const getClient = (client_id: string) => api.get(`/client/${client_id}`);

export const loginClient = (email: string, password: string) =>
    api.post("/auth/client/login", { email, password });

export const createClient = (data: Omit<Client, "id" | "created_at">): Promise<any> => {
    return api.post("/auth/clients/register", data, {
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
    api.put(`/clients/${id}`, data);

export const deleteClient = (id: string) => api.delete(`/clients/${id}`);

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
export const getPaymentLogs = () => api.get("/payment-logs");

export const getPlans = () => api.get("/clients/subscription-plans");
export const createCheckoutSession = (lookup_key: string, clientId: string) => api.post("/payments/create-checkout-session", { lookup_key, clientId });
export const verifyPaymentAndStore = (session_id: string) => api.post("/payments/verify", { session_id });
export const portalSession = (customerId: string) => api.post("/payment/create-portal-session", { customerId });
// OTP
export const verifyOtp = (data: { email: string; otp: string }) =>
    api.post("/client/verify-otp", data);

export const generateOtp = (email: string) =>
    api.post("/client/generate-otp", { email });

// Coupons
export const getCoupons = (id: string) => api.get(`/forms/get-coupons/${id}`);
export const fetchCustomerFromCoupon = (code: string) => api.post(`/clients/verify`, { code });
export const generateCoupon = (data: { qr_id: string, code: string, email: string, name: string, phone: string, DOB: string, ratings: number | null, reviewImage: File | null }) => api.post(`/coupon`, data, {
    headers: { "Content-Type": "multipart/form-data" },
});


// Admin
export const getStats = () => api.get("/admin/getStats");

// Payments
export const createProducts = (client_id: string) => api.post("/payments/create-products", { client_id });

// Forms
export const getClientFromQR = (qr_id: string) => api.post("/forms/get-client", { qr_id: qr_id });
export const redeemCoupon = (id: string) => api.post("/forms/redeem-coupon", { id: id });