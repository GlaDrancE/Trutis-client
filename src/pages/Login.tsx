import { LogIn } from 'lucide-react';
import React, { useState } from 'react'
import Layout from '../layout/Layout';
import { loginClient } from '../../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode';
// Login Form Component
const LoginForm = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await loginClient(email, password)
            console.log(response.data)
            toast.error(response.data)
            if (response.data) {
                localStorage.setItem('token', response.data.token)
            }
            const decode: any = jwtDecode(response.data.token)
            if (!decode) { toast.error("Login failed") }
            navigate(`/?c_id=${decode.userId}`)

        } catch (error) {
            toast.error("Invalid Credentials")
            console.error(error)
        }
    };
    const handleGoogleLogin = async (crednetialsResponse: any) => {
        try {
            const decode: any = jwtDecode(crednetialsResponse.credential)

            if (!decode) {
                toast.error("Failed to load token")
                return
            }
            const response = await loginClient(decode.email, decode.sub)
            if (response.status !== 200) {
                toast.error("Failed to load client")
                return;
            }
            localStorage.setItem('token', crednetialsResponse.credential)
            navigate(`/${response.data.userId}`)
            toast.success("Login Successful")
        } catch (error) {
            console.error(error)
        }
    }

    return (

        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Toaster />
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
                        <h2 className="text-center text-3xl font-bold text-blue-500">Sign in to your account</h2>
                    </div>
                    <GoogleOAuthProvider clientId={`${GOOGLE_CLIENT_ID}`}>
                        <div className='mb-8'>
                            <GoogleLogin text='signin' locale='en' onSuccess={handleGoogleLogin} onError={() => toast.error("Something went wrong")} />
                        </div>
                    </GoogleOAuthProvider>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
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
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <LogIn className="mr-2" size={20} />
                                Sign in
                            </button>
                        </div>
                        <div className='text-center'>
                            Don't have an account? <Link className='text-blue-400' to={'/register'}>Register</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;