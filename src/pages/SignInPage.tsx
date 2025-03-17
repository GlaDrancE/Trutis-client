import React, { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import signupBackground from "@/assets/signup-background.jpg";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { createGoogleClient, loginClient } from "../../services/api";
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
    const [otp, setOtp] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const authStore = useAuthStore();


    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;



    const handleValidateLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true)
            const response = await loginClient(email, password, "manual");

            if (response.status !== 200) {
                toast.error("Invalid Credentails")
            }
            console.log(response.data)
            localStorage.setItem('clientId', response.data.id);
            localStorage.setItem('token', response.data.accessToken)
            authStore.setRememberMe(rememberMe)
            // document.cookie = `refreshToken=${response.data.refreshToken}`;
            authStore.login(response.data.accessToken, "manual", rememberMe)

            navigate(`/${response.data.id}`);
        } catch (error) {
            toast.error('Invalid Credentials');
            console.error(error);
        }
        finally {
            setIsLoading(false)
        }
    };
    const handleGoogleSignIn = async (crednetialsResponse: any) => {
        try {
            const decode: any = jwtDecode(crednetialsResponse.credential);
            console.log("Decode: ", decode);
            const response = await loginClient(decode.email, decode.sub as string, "google", rememberMe)
            if (response.status !== 200) {
                toast.error("Failed to create an account");
                return;
            }
            // localStorage.setItem('token', crednetialsResponse.credential);
            // document.cookie = `refreshToken=${response.data.refreshToken}`;
            authStore.login(crednetialsResponse.credential, "google", rememberMe)
            authStore.setRememberMe(rememberMe)

            localStorage.setItem('token', crednetialsResponse.credential)
            localStorage.setItem('clientId', response.data.id)
            navigate(`/${response.data.id}`);

        } catch (error) {
            console.error(error);
            toast.error("Failed to create account");
        }
    };
    return (
        <div className="flex min-h-screen">
            <Toaster />
            {/* Left content */}
            <div className="w-full md:w-1/2 flex flex-col p-8 md:p-16">
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
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>
                        <p className="text-gray-500 mb-8">Enter your email and password to sign in!</p>
                    </div>

                    <div className="mb-6">

                        <GoogleOAuthProvider clientId={`${GOOGLE_CLIENT_ID}`}>
                            <div>
                                <GoogleLogin
                                    onSuccess={handleGoogleSignIn}
                                    onError={() => console.log("Login failed")}
                                    theme="outline"
                                    size="large"
                                    shape="circle"
                                    locale="en-US"
                                    text="signin_with"
                                    context="signin"
                                />
                            </div>
                        </GoogleOAuthProvider>
                    </div>

                    <div className="flex items-center mb-6">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="px-4 text-sm text-gray-500">or</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <form onSubmit={handleValidateLogin}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email<span className="text-blue-600">*</span>
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="mail@simmmple.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full py-5 rounded-2xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password<span className="text-blue-600">*</span>
                                </label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Min. 8 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full py-5 pr-10 rounded-2xl"
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

                            <Button type="submit" className="w-full py-6 bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
                                {
                                    isLoading ? "Signing In..." : "Sign In"
                                }
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Not registered yet?{" "}
                            <Link to="/sign-up" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Create an Account
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-auto text-center text-xs text-gray-400 py-4">
                    © 2022 Horizon UI. All Rights Reserved. Made with love by Simmmple!
                </div>
            </div>

            {/* Right gradient background */}
            <div className="hidden md:block md:w-1/2 relative">
                <img src={signupBackground} alt="" className="w-full h-full object-cover absolute top-0 left-0 z-10" />
                <div className="absolute bottom-4 left-4 flex space-x-4 text-sm text-white z-20">
                    <a href="#" className="hover:underline">Marketplace</a>
                    <a href="#" className="hover:underline">License</a>
                    <a href="#" className="hover:underline">Terms of Use</a>
                    <a href="#" className="hover:underline">Blog</a>
                </div>
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