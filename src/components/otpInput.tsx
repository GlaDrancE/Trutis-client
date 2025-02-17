import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { generateOtp, verifyOtp } from '../../../services/api';
import toast from 'react-hot-toast';

interface OTPInputProps {
    value: string;
    email: string;
    onChange: (otp: string) => void;
    disabled?: boolean;
    handleFormSubmit?: () => void;
}

const OTPInput = ({ value, email, onChange, disabled = false, handleFormSubmit }: OTPInputProps) => {
    const [otpValues, setOtpValues] = useState<string[]>(new Array(6).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Initialize refs array
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, 6);
    }, []);

    // Update individual inputs when value prop changes
    useEffect(() => {
        const otpArray = value.split('').slice(0, 6);
        setOtpValues([...otpArray, ...new Array(6 - otpArray.length).fill('')]);
    }, [value]);

    const handleVerify = async () => {
        try {
            const verify = await verifyOtp({ email: email, otp: value });
            if (!verify) {
                toast.error("Invalid OTP")
            }
            else {
                toast.success("OTP verified successfully")
                handleFormSubmit && handleFormSubmit();
            }

        } catch (error) {
            toast.error("Something went wrong, try to resend OTP")
        }

    }
    const handleChange = (index: number, e: any) => {
        const target = e.target;
        let targetValue = target.value;

        // Handle pasting
        if (targetValue.length > 1) {
            const pastedData = targetValue.slice(0, 6);
            const otpArray = pastedData.split('').slice(0, 6);
            const newOtpValues = [...otpArray, ...new Array(6 - otpArray.length).fill('')];
            setOtpValues(newOtpValues);
            onChange(newOtpValues.join(''));

            // Focus last input or first empty input
            const lastFilledIndex = newOtpValues.findIndex(val => val === '');
            const focusIndex = lastFilledIndex === -1 ? 5 : lastFilledIndex;
            inputRefs.current[focusIndex]?.focus();
            return;
        }

        // Allow only numbers
        if (!/^\d*$/.test(targetValue)) {
            return;
        }

        const newOtpValues = [...otpValues];
        newOtpValues[index] = targetValue;
        setOtpValues(newOtpValues);
        onChange(newOtpValues.join(''));

        // Auto-focus next input
        if (targetValue && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
        if (targetValue && index === 5) {
            handleVerify();
        }
    };
    const handleResendOTP = async () => {
        try {
            const resend = await generateOtp(email);
            if (resend.status !== 200) {
                toast.error("Something went wrong")
            }
            else {
                toast.success("OTP sent successfully")
            }
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newOtpValues = [...otpValues];

            if (newOtpValues[index]) {
                // Clear current input if it has a value
                newOtpValues[index] = '';
                setOtpValues(newOtpValues);
                onChange(newOtpValues.join(''));
            } else if (index > 0) {
                // Move to previous input if current is empty
                inputRefs.current[index - 1]?.focus();
                newOtpValues[index - 1] = '';
                setOtpValues(newOtpValues);
                onChange(newOtpValues.join(''));
            }
        }

        // Handle left arrow
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Handle right arrow
        if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    const handlePaste = (e: any) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);

        if (!/^\d+$/.test(pastedData)) return; // Only allow numbers

        const newOtp = [...otpValues];
        pastedData.split('').forEach((char: any, index: any) => {
            if (index < 6) newOtp[index] = char;
        });
        setOtpValues(newOtp);

        // Focus last filled input or first empty input
        const lastFilledIndex = Math.min(pastedData.length - 1, 5);
        inputRefs.current[5]?.focus();
        if (e.target.value && inputRefs.current[5]?.value !== null) {
            handleVerify();
        }
    };

    return (
        <div className="flex gap-2 items-center justify-center flex-col py-4 px-4 w-full h-full">
            <h1 className='text-center text-2xl font-semibold'>
                Enter the OTP sent to your email
            </h1>

            <div className='flex gap-2 px-6 items-center justify-center'>
                {otpValues.map((digit, index) => (
                    <Input
                        key={index}
                        ref={el => inputRefs.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        maxLength={1}
                        value={digit}
                        onInput={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onFocus={handleFocus}
                        disabled={disabled}
                        onPaste={handlePaste}
                        className="w-12 h-12 text-center text-lg font-semibold"
                    />
                ))}
            </div>
            <div className='text-center text-sm text-gray-500'>
                <div>
                    Didn't receive the OTP?
                </div>
                <div className='text-blue-500 cursor-pointer' onClick={handleResendOTP}>
                    Resend OTP
                </div>
            </div>
        </div>
    );
};

export default OTPInput;
