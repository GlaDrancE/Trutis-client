import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../services/api';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import signupBackground from "@/assets/signup-background.jpg";
import { ArrowLeft, EyeIcon, EyeOffIcon } from 'lucide-react';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            if (!token) {
                toast.error('Invalid token');
                setLoading(false);
                return;
            }

            const response = await resetPassword(token, password);
            if (response.status === 200) {
                toast.success('Password reset successfully');
                navigate('/login');
            } else {
                toast.error(response.data.message || 'Failed to reset password');
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-whitebackground text-foreground">
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
                        <h1 className="text-3xl font-bold text-gray-800 mb-2 dark:text-white">Reset Password</h1>
                        <p className="text-gray-500 mb-8 dark:text-white">
                            Enter your new password below to reset your account password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium dark:text-white text-gray-700">
                                    New Password<span className="text-indigo-600">*</span>
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
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    >
                                        {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="block dark:text-white text-sm font-medium text-gray-700">
                                    Confirm Password<span className="text-indigo-600">*</span>
                                </label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full py-5 pr-10 rounded-2xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    >
                                        {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full py-6 bg-indigo-600 dark:text-white hover:bg-indigo-700" 
                                disabled={loading}
                            >
                                {loading ? "Resetting Password..." : "Reset Password"}
                            </Button>
                        </div>
                    </form>
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

export default ResetPassword;