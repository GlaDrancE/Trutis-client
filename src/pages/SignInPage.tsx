import React, { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import signupBackground from "@/assets/signup-background.jpg";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { createGoogleClient, loginClient, staffLogin } from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";

const SignInPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const navigate = useNavigate();
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const [slide, setSlide] = useState<number>(1);
    const [otp, setOtp] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const authStore = useAuthStore();

    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleValidateLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isValidEmail(email)) {
                const response = await loginClient(email, password, "manual", rememberMe);
                if (response.status !== 200) {
                    toast.error("Invalid Credentials");
                    setIsLoading(false);
                    return;
                }
                localStorage.setItem("clientId", response.data.id);
                localStorage.setItem("token", response.data.accessToken);
                authStore.setRememberMe(rememberMe);
                authStore.login(response.data.accessToken, "manual", rememberMe);
                navigate(`/${response.data.id}`);
            } else {
                const response = await staffLogin(email, password, "manual", rememberMe);
                if (response.status !== 200) {
                    toast.error("Invalid Staff Credentials");
                    setIsLoading(false);
                    return;
                }
                localStorage.setItem("clientId", response.data.id);
                localStorage.setItem("token", response.data.accessToken);
                authStore.setRememberMe(rememberMe);
                authStore.login(response.data.accessToken, "manual", rememberMe);
                navigate(`/${response.data.id}/coupon-scanner`);
            }
        } catch (error: any) {
            switch (error.response?.status) {
                case 400:
                    toast.error("User already exists");
                    break;
                case 401:
                    toast.error("Invalid email or password");
                    break;
                default:
                    toast.error("Error while creating client");
                    break;
            }
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async (crednetialsResponse: any) => {
        try {
            const decode: any = jwtDecode(crednetialsResponse.credential);
            const response = await loginClient(decode.email, decode.sub as string, "google", rememberMe);
            if (response.status !== 200) {
                toast.error("Failed to create an account");
                return;
            }
            authStore.login(crednetialsResponse.credential, "google", rememberMe);
            authStore.setRememberMe(rememberMe);
            localStorage.setItem("token", crednetialsResponse.credential);
            localStorage.setItem("clientId", response.data.id);
            navigate(`/${response.data.id}`);
        } catch (error: any) {
            switch (error.response?.status) {
                case 400:
                    toast.error("User already exists");
                    break;
                case 401:
                    toast.error("Invalid email or password");
                    break;
                default:
                    toast.error("Error while signing in");
                    break;
            }
            console.error(error);
        }
    };

    return (
        <div className="flex min-h-screen bg-whitebackground text-foreground">
            <Toaster />
            <div className="w-full md:w-1/2 flex flex-col p-8 md:p-16">
                <div className="mb-8">
                    <button
                        onClick={() => (window.location.href = "https://entugo.com/in")}
                        className="flex items-center  text-sm  "
                    >
                        <ArrowLeft className="w-4 h-4 mr-2"/>
                        Back to Home
                    </button>
                </div>

                <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                    <div className="text-center sm:text-left">
                        <h1 className="text-2xl font-bold mb-2">Welcome to Entugo! <br/>Sign in to your account</h1>
                        <p className=" mb-8 ">Ready to grow your business the smart way? Log in now</p>
                    </div>

                    <div className="mb-6 w-full" id="google-button">
                        <GoogleOAuthProvider clientId={`${GOOGLE_CLIENT_ID}`}>
                            <div className="w-full">
                                <GoogleLogin
                                    onSuccess={handleGoogleSignIn}
                                    onError={() => console.log("Login failed")}
                                    theme="outline"
                                    size="large"
                                    shape="circle"
                                    locale="en-US"
                                    text="signin_with"
                                    context="signin"
                                    width="100%"
                                />
                            </div>
                        </GoogleOAuthProvider>
                    </div>

                    <div className="flex items-center mb-6">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="px-4 text-sm ">or</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <form onSubmit={handleValidateLogin}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className=" block text-sm font-medium ">
                                    EMAIL/ID<span className="text-blue-600">*</span>
                                </label>
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="mail@simmmple.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full py-5 rounded-2xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className=" block text-sm font-medium ">
                                    Your Password<span className="text-blue-600">*</span>
                                </label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="**********"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full py-5 pr-10 rounded-2xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 "
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
                                        Remember me on this device
                                    </label>
                                </div>

                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    Forgot your password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className=" w-full py-6 bg-indigo-600 hover:bg-indigo-700"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing In..." : "Log in to Entugo"}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm  dark:">
                            New to Entugo?{" "}
                            <Link to="/sign-up" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Create an Account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <div className="hidden md:block md:w-1/2 relative">
                <img src={signupBackground} alt="" className="w-full h-full object-cover absolute top-0 left-0 z-10" />
                {/* <div className="absolute bottom-4 left-4 flex space-x-4 text-sm text-white z-20"> <a href="#" className="hover:underline">Marketplace</a>
                    <a href="#" className="hover:underline">License</a>
                    <a href="#" className="hover:underline">Terms of Use</a>
                    <a href="#" className="hover:underline">Blog</a>
                </div> */}
                <button className="absolute bottom-4 right-28 bg-white bg-opacity-20 rounded-full p-2 text-white">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default SignInPage;