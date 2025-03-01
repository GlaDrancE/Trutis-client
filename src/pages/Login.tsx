import { Loader2, LogIn } from 'lucide-react';
import React, { useState } from 'react';
import Layout from '../layout/Layout';
import { generateOtp, getClient, loginClient, verifyOtp } from '../../services/api';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import OTPInput from '@/components/otpInput';
import { Button } from '@/components/ui/button';

// Login Form Component
const LoginForm = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();
    const [slide, setSlide] = useState<number>(1);
    const [otp, setOtp] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    const handleNext = async () => {
        setSlide((prev) => prev + 1);
    };

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleGenerateOtp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission behavior
        const loginResponse = await handleValidateLogin();
        if (!loginResponse) {
            return;
        }
        // if (!isValidEmail(email)) {
        //     handleSubmit();
        //     return;
        // }
        handleNext();
        if (email) {
            try {
                const response: any = await generateOtp(email);
                if (response.status !== 200) {
                    toast.error('Something went wrong');
                } else {
                    toast.success('OTP sent to email');
                }
            } catch (error) {
                toast.error('Failed to generate OTP');
                console.error(error);
            }
        } else {
            toast.error('Please enter an email');
        }
    };

    const handleValidateLogin = async () => {
        try {
            setIsLoading(true)
            const response = await loginClient(email, password);

            if (response.status !== 200) {
                toast.error("Invalid Credentails")
                return false
            }
            if (response.data) {
                localStorage.setItem('token', response.data.token);
            }

            return true
        } catch (error) {
            toast.error('Invalid Credentials');
            console.error(error);
            return false
        }
        finally {
            setIsLoading(false)
        }
    };
    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem("token")
            const decode: any = jwtDecode(token as string);
            if (!decode) {
                toast.error('Login failed');
                return false;
            }
            localStorage.setItem('clientId', decode.userId);
            navigate(`/${decode.userId}`)

        } catch (error) {
            toast.error("Something went wrong, try again")
            console.error(error)
        }
    }



    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
                        <h2 className="text-center text-3xl font-bold text-blue-500">Sign in to your account</h2>
                    </div>
                    {/* <GoogleOAuthProvider clientId={`${GOOGLE_CLIENT_ID}`}>
                        <div className='mb-8'>
                            <GoogleLogin text='signin' locale='en' onSuccess={handleGoogleLogin} onError={() => toast.error("Something went wrong")} />
                        </div>
                    </GoogleOAuthProvider> */}
                    {slide === 1 && (
                        <form className="space-y-6" onSubmit={handleGenerateOtp}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="text"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                        Forgot your password?
                                    </Link>
                                </div>
                            </div>
                            <div>
                                <Button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    {isLoading ? <Loader2 className='animate-spin' /> : <><LogIn className="mr-2" size={20} />
                                        <span>Sign in</span></>}

                                </Button>
                            </div>
                            <div className="text-center">
                                Don't have an account?{' '}
                                <Link className="text-blue-400" to="/register">
                                    Register
                                </Link>
                            </div>
                        </form>
                    )}
                    {slide === 2 && (
                        <OTPInput value={otp} email={email} setOtp={setOtp} handleFormSubmit={handleSubmit} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginForm;