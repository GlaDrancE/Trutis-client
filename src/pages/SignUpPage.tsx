import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { createClient } from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from '../store'
import { Link } from "react-router-dom";
import signupBackground from "@/assets/signup-background.jpg";

const SignUpPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const { login: storeLogin, setRememberMe: storeSetRememberMe } = useAuthStore();
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const authStore = useAuthStore();
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;


    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        // Add registration logic here
        console.log({ fullName, email, phone, password, rememberMe });
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const response: any = await createClient({
                email,
                owner_name: fullName,
                password,
                phone
            });
            setIsLoading(false);
            if (response.status !== 201) {
                toast.error('Error while creating client');
            } else {
                console.log("Client Created");
                toast.success("Client created");
                localStorage.setItem("token", response.data.accessToken);
                authStore.login(response.data.accessToken, "manual", rememberMe)
                document.cookie = `refreshToken=${response.data.refreshToken}`;
                localStorage.setItem("clientId", response.data.id);
                navigate(`/${response.data.id}`);
                storeSetRememberMe(rememberMe);
                storeLogin(response.data.accessToken, 'manual', rememberMe);
            }
        } catch (error: any) {
            if (error.response.data === "User already exists") {
                toast.error("User already exists");
            } else {
                toast.error("Error while creating client");
            }
            setIsLoading(false);
            console.error(error);
        }
    };
    const handleGoogleSignUp = async (credentialResponse: any) => {
        try {
            const decode: any = jwtDecode(credentialResponse.credential);
            console.log("Decode: ", decode);
            const response: any = await createClient({
                email: decode.email,
                owner_name: decode.name,
                password: decode.sub,
                phone: ""
            });
            if (response.status !== 201) {
                toast.error("Error while creating client");
            } else {
                console.log("Client Created");
                toast.success("Client created");
                authStore.login(credentialResponse.credential, "google", rememberMe)
                // document.cookie = `refreshToken=${response.data.refreshToken}`;

                localStorage.setItem("token", credentialResponse.credential);
                localStorage.setItem("clientId", response.data.id);
                navigate(`/${response.data.id}`);
                storeSetRememberMe(rememberMe);
                storeLogin(credentialResponse.credential, 'google', rememberMe);
            }
        } catch (error: any) {
            if (error.response.data === "User already exists") {
                toast.error("User already exists");
            } else {
                toast.error("Error while creating client");
            }
            console.error(error);
        }
    };
    return (
        <div className="flex min-h-screen">
            <Toaster />
            {/* Left side - Form */}
            <div className="w-full md:w-1/2 flex flex-col py-10 px-8 md:p-16">
                <div className="mb-8">
                    <button
                        onClick={() => console.log("Back to dashboard")}
                        className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                    >
                        <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Back to Entgo
                    </button>
                </div>

                <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>
                        <p className="text-gray-500">Enter your email and password to sign in!</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="John Doe"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="mail@simmmple.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                Phone
                            </label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+91 90132 12390"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password<span className="text-indigo-600">*</span>
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Keep me logged in
                                </label>
                            </div>

                            <a
                                href="#"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Forgot password?
                            </a>
                        </div>

                        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                            Next
                        </Button>

                        <div className="relative flex items-center mt-4">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <GoogleOAuthProvider clientId={`${GOOGLE_CLIENT_ID}`}>
                            <div>
                                <GoogleLogin
                                    onSuccess={handleGoogleSignUp}
                                    onError={() => console.log("Login failed")}
                                    theme="outline"
                                    size="large"
                                    shape="circle"
                                    locale="en-US"
                                    text="signup_with"
                                    context="signup"
                                />
                            </div>
                        </GoogleOAuthProvider>

                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

            </div>

            {/* Right side - Gradient Background */}
            <div className="hidden md:block md:w-1/2 relative">
                <img src={signupBackground} alt="" className="w-full h-full object-cover absolute top-0 left-0 z-10" />
                <div className="absolute bottom-4 w-full flex justify-center space-x-6 text-sm text-white z-20">
                    <a href="#" className="hover:underline">Marketplace</a>
                    <a href="#" className="hover:underline">License</a>
                    <a href="#" className="hover:underline">Terms of Use</a>
                    <a href="#" className="hover:underline">Blog</a>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;