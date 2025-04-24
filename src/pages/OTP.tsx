import React, { useEffect, useState } from 'react'
import Layout from '../layout/Layout'
import { Send, Timer } from 'lucide-react';
const OTPPage = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timer > 0 && !canResend) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            setCanResend(true);
        }
    }, [timer]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        if (element.value && element.nextSibling) {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
                const prevInput = e.currentTarget.previousSibling as HTMLInputElement;
                if (prevInput) prevInput.focus();
            }
        }
    };

    const handleResend = async () => {
        try {
            // Add your resend OTP API call here
            setTimer(60);
            setCanResend(false);
        } catch (error) {
            console.error('Failed to resend OTP:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Enter OTP</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Please enter the 6-digit code sent to your email
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <div className="flex gap-2 justify-center">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e.target, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="w-12 h-12 text-center text-2xl border-2 rounded-lg focus:border-blue-500 focus:ring-blue-500 outline-none"
                            />
                        ))}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600">
                            <Timer size={16} className="mr-1" />
                            {timer > 0 ? `${timer}s` : 'Time expired'}
                        </div>
                        <button
                            onClick={handleResend}
                            disabled={!canResend}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${canResend
                                ? 'text-white bg-blue-600 hover:bg-blue-700'
                                : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                }`}
                        >
                            <Send size={16} className="mr-2" />
                            Resend OTP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const OTPForm = () => {
    return
    (
        <Layout>
            <OTPPage />
        </Layout>
    )
}
