import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon, CheckCircle2, XCircle } from "lucide-react";
import { createClient, generateOtp, verifyOtp } from "../../services/api";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from '../store';
import signupBackground from "@/assets/signup-background.jpg";

const SignUpPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [countryCode, setCountryCode] = useState<string>("+91");
    const [countryCodes, setCountryCodes] = useState<{ code: string; label: string }[]>([]);
    const [isLoadingCountryCodes, setIsLoadingCountryCodes] = useState<boolean>(true);
    const [password, setPassword] = useState<string>("");
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
    const [canResendOtp, setCanResendOtp] = useState<boolean>(true);
    const [resendTimer, setResendTimer] = useState<number>(0);

    const [hasMinLength, setHasMinLength] = useState<boolean>(false);
    const [hasUpperCase, setHasUpperCase] = useState<boolean>(false);
    const [hasLowerCase, setHasLowerCase] = useState<boolean>(false);
    const [hasNumber, setHasNumber] = useState<boolean>(false);

    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

    const navigate = useNavigate();
    const { login: storeLogin, setRememberMe: storeSetRememberMe } = useAuthStore();
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const otpRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

    useEffect(() => {
        const fetchCountryCodes = async () => {
            try {
                setIsLoadingCountryCodes(true);
                const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd');
                const data = await response.json();

                const codes = data
                    .map((country: any) => {
                        const dialCode = `${country?.idd?.root || ''}${country?.idd?.suffixes?.[0] || ''}`;
                        if (!dialCode) return null;
                        return {
                            code: dialCode,
                            label: `${dialCode} (${country.name.common})`,
                        };
                    })
                    .filter((country: any) => country !== null)
                    .sort((a: any, b: any) => a.label.localeCompare(b.label));

                setCountryCodes(codes);

                const defaultCountry = codes.find((c: any) => c.code === "+91");
                if (!defaultCountry && codes.length > 0) {
                    setCountryCode(codes[0].code);
                }
            } catch (error) {
                console.error("Error fetching country codes:", error);
                setCountryCodes([{ code: "+91", label: "+91 (India)" }]);
            } finally {
                setIsLoadingCountryCodes(false);
            }
        };

        fetchCountryCodes();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        } else if (resendTimer === 0 && !canResendOtp) {
            setCanResendOtp(true);
        }
        return () => clearInterval(interval);
    }, [resendTimer, canResendOtp]);


    useEffect(() => {
        setHasMinLength(password.length >= 8);
        setHasUpperCase(/[A-Z]/.test(password));
        setHasLowerCase(/[a-z]/.test(password));
        setHasNumber(/\d/.test(password));
    }, [password]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pastedData = e.clipboardData.getData("text").trim();
        if (/^\d{6}$/.test(pastedData)) {
            setOtp(pastedData.split(""));
            otpRefs.current[5]?.focus();
        }
        e.preventDefault();
    };

    const handleGenerateOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setHasSubmitted(true);
        if (!email) {
            toast.error("Please enter a valid email");
            return;
        }

        if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasNumber) {
            toast.error("Password does not meet the requirements");
            return;
        }
        setIsLoading(true);
        try {
            const response = await generateOtp(email, fullName);
            if (response.data) {
                toast.success("OTP sent to your email");
                setIsOtpSent(true);
                setCanResendOtp(false);
                setResendTimer(60);
            } else {
                toast.error("Failed to send OTP");
            }
        } catch (error) {
            toast.error("Error generating OTP");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (!canResendOtp) return;
        setIsLoading(true);
        try {
            const response = await generateOtp(email, fullName);
            if (response.data) {
                toast.success("New OTP sent to your email");
                setCanResendOtp(false);
                setResendTimer(60);
            } else {
                toast.error("Failed to send OTP");
            }
        } catch (error) {
            toast.error("Error generating OTP");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtpAndSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpString = otp.join("");
        if (otpString.length !== 6) {
            toast.error("Please enter a 6-digit OTP");
            return;
        }
        setIsLoading(true);
        try {
            const verifyResponse = await verifyOtp(email, otpString);
            if (verifyResponse.data === "OTP verified successfully") {
                const fullPhoneNumber = `${countryCode}${phone}`;
                const response = await createClient({
                    email,
                    owner_name: fullName,
                    password,
                    phone: fullPhoneNumber,
                });

                if (response.status === 201) {
                    toast.success("Client created");
                    localStorage.setItem("token", response.data.accessToken);
                    storeLogin(response.data.accessToken, "manual", rememberMe);
                    document.cookie = `refreshToken=${response.data.refreshToken}`;
                    localStorage.setItem("clientId", response.data.id);
                    navigate(`/${response.data.id}`);
                    storeSetRememberMe(rememberMe);
                } else {
                    toast.error("Error while creating client");
                }
            } else {
                toast.error("Failed to verify OTP");
            }
        } catch (error: any) {
            if (error.response?.data === "User already exists") {
                toast.error("User already exists");
            } else {
                toast.error("Error during signup");
            }
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async (credentialResponse: any) => {
        try {
            const decode: any = jwtDecode(credentialResponse.credential);
            const response: any = await createClient({
                email: decode.email,
                owner_name: decode.name,
                password: decode.sub,
                phone: "",
            });
            if (response.status === 201) {
                toast.success("Client created");
                storeLogin(credentialResponse.credential, "google", rememberMe);
                localStorage.setItem("token", credentialResponse.credential);
                localStorage.setItem("clientId", response.data.id);
                navigate(`/${response.data.id}`);
                storeSetRememberMe(rememberMe);
            } else {
                toast.error("Error while creating client");
            }
        } catch (error: any) {
            if (error.response?.data === "User already exists") {
                toast.error("User already exists");
            } else {
                toast.error("Error while creating client");
            }
            console.error(error);
        }
    };


    const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber;

    return (
        <div className="flex min-h-screen bg-whitebackground text-foreground">
            <Toaster position="top-right" />
            <div className="w-full md:w-1/2 flex flex-col py-10 px-8 md:p-16">
                <div className="mb-8">
                    <button
                        onClick={() => window.location.href = "https://entugo.com/in"}
                        className="flex items-center text-sm hover:underline"
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
                        Back to Entugo
                    </button>
                </div>

                <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">Create Your Entugo Account</h1>
                        <p>
                            {isOtpSent ? "Enter the OTP sent to your email" : "Start your journey with reviews, rewards & revisits"}
                        </p>
                    </div>

                    <form onSubmit={isOtpSent ? handleVerifyOtpAndSignup : handleGenerateOtp} className="space-y-6">
                        {!isOtpSent ? (
                            <>
                                <div className="space-y-2">
                                    <label htmlFor="fullName" className="block text-sm font-medium">
                                        Your full name
                                    </label>
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium">
                                        Email address
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="mail@simmmple.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone" className="block text-sm font-medium">
                                        Mobile number
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            value={countryCode}
                                            onChange={(e) => setCountryCode(e.target.value)}
                                            className="w-2/5 border dark:text-black border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                                            disabled={isLoadingCountryCodes}
                                        >
                                            {isLoadingCountryCodes ? (
                                                <option value="">Loading...</option>
                                            ) : (
                                                countryCodes.map((country) => (
                                                    <option key={country.code} value={country.code}>
                                                        {country.label}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="99999 99999"
                                            value={phone}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                setPhone(value);
                                            }}
                                            maxLength={10}
                                            className="w-full"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="password" className="block text-sm font-medium">
                                        Create a password<span className="text-indigo-600">*</span>
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="At least 8 characters"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className={`w-full pr-10 ${hasSubmitted && !isPasswordValid
                                                ? "border-red-500 focus:ring-red-500"
                                                : ""
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        >
                                            {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                        </button>
                                    </div>

                                    {hasSubmitted && !isPasswordValid && (
                                        <div className="mt-2 space-y-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                {hasMinLength ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                )}
                                                <span className={hasMinLength ? "text-green-500" : "text-red-500"}>
                                                    At least 8 characters
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                {hasUpperCase ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                )}
                                                <span className={hasUpperCase ? "text-green-500" : "text-red-500"}>
                                                    At least one uppercase letter
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                {hasLowerCase ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                )}
                                                <span className={hasLowerCase ? "text-green-500" : "text-red-500"}>
                                                    At least one lowercase letter
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                {hasNumber ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                )}
                                                <span className={hasNumber ? "text-green-500" : "text-red-500"}>
                                                    At least one number
                                                </span>
                                            </div>
                                        </div>
                                    )}
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
                                            Keep me signed in on this device
                                        </label>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 dark:text-white"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Sending OTP..." : "Send OTP to Verify & Continue"}
                                </Button>

                                <div className="relative flex items-center mt-4">
                                    <div className="flex-grow border-t border-gray-200"></div>
                                    <span className="flex-shrink mx-4 text-sm">or</span>
                                    <div className="flex-grow border-t border-gray-200"></div>
                                </div>

                                <GoogleOAuthProvider clientId={`${GOOGLE_CLIENT_ID}`}>
                                    <GoogleLogin
                                        onSuccess={handleGoogleSignIn}
                                        onError={() => console.log("Login failed")}
                                        theme="outline"
                                        size="large"
                                        shape="circle"
                                        locale="en-US"
                                        text="signup_with"
                                        context="signup"
                                    />
                                </GoogleOAuthProvider>

                                <div className="text-center mt-4">
                                    <p className="text-sm">
                                        Already using Entugo?{" "}
                                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                            Log in here
                                        </Link>
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-center">
                                        Enter OTP
                                    </label>
                                    <div className="flex justify-center gap-2">
                                        {otp.map((digit, index) => (
                                            <Input
                                                key={index}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                onPaste={index === 0 ? handleOtpPaste : undefined}
                                                ref={(el) => (otpRefs.current[index] = el)}
                                                className="w-12 h-12 text-center text-lg font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-sm text-center mt-2">
                                        Check your Junk or Spam folder if the OTP email is not in your inbox.
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Verifying..." : "Verify OTP & Sign Up"}
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        setIsOtpSent(false);
                                        setOtp(Array(6).fill(""));
                                    }}
                                >
                                    Back to Form
                                </Button>

                                <div className="text-center">
                                    <p>
                                        OTP is valid for 10 minutes
                                    </p>
                                </div>
                                {isOtpSent && (
                                    <div className="text-center mt-4">
                                        {canResendOtp ? (
                                            <button
                                                type="button"
                                                onClick={handleResendOtp}
                                                className="text-sm text-indigo-600 hover:text-indigo-500"
                                            >
                                                Resend OTP
                                            </button>
                                        ) : (
                                            <p className="text-sm">
                                                Resend OTP in {resendTimer} seconds
                                            </p>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </form>
                </div>
            </div>

            <div className="hidden md:block md:w-1/2 relative">
                <img src={signupBackground} alt="" className="w-full h-full object-cover absolute top-0 left-0 z-10" />
                {/* <div className="absolute bottom-4 w-full flex justify-center space-x-6 text-sm text-white z-20">
                    <a href="#" className="hover:underline">Marketplace</a>
                    <a href="#" className="hover:underline">License</a>
                    <a href="#" className="hover:underline">Terms of Use</a>
                    <a href="#" className="hover:underline">Blog</a>
                </div> */}
            </div>
        </div >
    );
};

export default SignUpPage;