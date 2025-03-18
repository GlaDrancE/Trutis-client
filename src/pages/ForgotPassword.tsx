import React, { useState } from 'react';
import { sendResetPasswordEmail } from '../../services/api';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import signupBackground from "@/assets/signup-background.jpg";
import { ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await sendResetPasswordEmail(email);
            if (response.status === 200) {
                toast.success('Reset link sent to your email');
            } else {
                toast.error(response.data.message || 'Failed to send reset link');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left content */}
            <div className="w-full md:w-1/2 flex flex-col p-8 md:p-16">
                <div className="mb-8">
                    <Link
                        to="/login"
                        className="flex items-center text-sm text-gray-500 dark:text-white hover:text-gray-700"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                    </Link>
                </div>

                <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Forgot Password?</h1>
                        <p className="text-gray-500 dark:text-white mb-8">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium dark:text-white text-gray-700">
                                    Email<span className="text-indigo-600">*</span>
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="mail@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full py-5 rounded-2xl"
                                />
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full py-6 bg-indigo-600 dark:text-white hover:bg-indigo-700" 
                                disabled={loading}
                            >
                                {loading ? "Sending Reset Link..." : "Send Reset Link"}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Remember your password?{" "}
                            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign in
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

export default ForgotPassword;