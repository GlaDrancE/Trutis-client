import axios from "axios";
import { Agent, Client, ClientSignUp } from "../types";

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/api` : 'http://localhost:3000/api/v1/api',
});
const paymentApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/payment` : 'http://localhost:3000/api/v1/payment'
})
const authApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth` : 'http://localhost:3000/api/v1/auth'
})
const pointsApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/points` : 'http://localhost:3000/api/v1/points'
})


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        const authProvider = JSON.parse(localStorage.getItem("auth-storage") as string)?.state.authProvider

        if (!config.headers) {
            config.headers = new axios.AxiosHeaders();
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            config.data = {
                ...config.data,
                authProvider: authProvider
            }
        }


        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
const getRefreshTokenFromCookie = () => {
    const cookies = document.cookie.split(';');
    const refreshTokenCookie = cookies.find(cookie => cookie.trim().startsWith('refreshToken='));
    return refreshTokenCookie ? refreshTokenCookie.split('=')[1].trim() : null;
};
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await axios.post('http://your-api-url/token/refresh', {
                    refreshToken: getRefreshTokenFromCookie(),
                });
                localStorage.setItem("token", data.accessToken)
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (err) {
                // Handle refresh token expiration (e.g., redirect to login)
                localStorage.removeItem("token")
                localStorage.removeItem("refreshToken")
                window.location.href = "/login"
            }
        }
        return Promise.reject(error);
    }
);



// Auth
export const login = (email: string, password: string) =>
    authApi.post("/admin/login", { email, password });

export const register = (email: string, password: string) =>
    authApi.post("/admin/signup", { email, password });

export const sendResetPasswordEmail = (email: string) =>
    authApi.post("/user/sendresetpassword", { email, userType: 'client' });

export const resetPassword = (token: string, password: string) =>
    authApi.post("/user/resetpassword", { token, password, userType: "customer" });
export const loginAgent = (email: string, password: string) =>
    authApi.post("/agent/login", { email, password });
export const createAgent = (data: Omit<Agent, "id" | "created_at">) =>
    authApi.post("/agents", data);
export const loginClient = (email: string, password: string, authProvider: string, rememberMe: boolean) =>
    authApi.post("/client/login", { email, password, authProvider, rememberMe });
export const staffLogin = (staffId: string, password: string, authProvider: string, rememberMe: boolean) =>
    authApi.post("/client/staff/login", { staffId, password, authProvider, rememberMe });
export const createClient = (data: ClientSignUp): Promise<any> => {
    return authApi.post("/clients/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};
export const logOutClient = () => authApi.post("/client/logout")

// Agents
export const getAgents = () => api.get("/agents");


export const updateAgent = (id: string, data: Partial<Agent>) =>
    api.put(`/agents/${id}`, data);

export const deleteAgent = (id: string) => api.delete(`/agents/${id}`);


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
export const updateClientIp = (id: string, ip: string) =>
    api.put(`/clients/ip/${id}`, { ip: ip }, {
        headers: { "Content-Type": "application/json" },
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
export const getPaymentLogs = () => api.get("/payment-logs");

export const getPlans = () => api.get("/clients/subscription-plans");
export const createCheckoutSession = (lookup_key: string, clientId: string) => paymentApi.post("/payment/create-checkout-session", { lookup_key, clientId });


export const verifyPaymentAndStore = (session_id: string) => paymentApi.post("/payment/verify", { session_id });
export const portalSession = (customerId: string) => paymentApi.post("/payment/create-portal-session", { customerId });

// Payments
export const createProducts = (client_id: string) => paymentApi.post("/payment/create-products", { client_id });



// OTP
export const verifyOtp = (email: string, otp: string) =>
    api.post("/client/verify-otp", { email, otp });

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
export const getCustomer = (id: string, client_id: string) => api.get(`/forms/get-customer/${id}`, { params: { client_id } })
export const fetchCustomerFromCouponID = (couponId: string) => api.post(`/coupon/getcustomer`, { couponId });
export const fetchReviewsFromClientId = (clientId: string) => api.post(`/clients/reviews`, { clientId });

// Admin
export const getStats = () => api.get("/admin/getStats");


// Forms
export const getClientFromQR = (qr_id: string) => api.post("/forms/get-client", { qr_id: qr_id });
export const redeemCoupon = (id: string, client_id: string) => api.post("/forms/redeem-coupon", { id: id, client_id: client_id });


// Points
export const updatePoints = (data: { customerId: string, name: string, email: string, amount: number, maxDiscount: number, minOrderValue: number, clientId: string, points: number }) =>
    pointsApi.post("/update-points", data)

export const redeemPoints = (data: { customerId: string, clientId: string, points: number }) =>
    pointsApi.post("/redeem-points", data)


// payment
export const getSubscriptionPlans = (client_id: string) =>
    paymentApi.post("/payment/plans", { client_id });
export const fetchSubscription = (client_id: string) =>
    paymentApi.post("/payment/fetch-subscription", { client_id });

export const createRazorpayOrder = (data: {
    amount: number;
    currency: string;
    receipt: string;
    clientId: string;
}) => paymentApi.post("/payment/create-order", data);
export const createRazorpaySubscription = (data: {
    plan: { name: string; price: number; description: string; id: string };
    clientId: string;
    client_email: string;
}) => paymentApi.post("/payment/create-subscription", data);

export const verifyRazorpayPayment = (data: { order_id: string, razorpay_payment_id: string, razorpay_signature: string }) =>
    paymentApi.post("/payment/verify", data);
export const verifyRazorpaySubscription = (data: {
    razorpay_subscription_id: string, razorpay_payment_id: string, razorpay_signature: string, client_id: string
}) =>
    paymentApi.post(`/payment/verify-subscription/${data.client_id}`, data);